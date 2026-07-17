import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import net from "node:net";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9223;
const origin = `http://127.0.0.1:${port}`;
const site = "http://localhost:3000";
const outDir = "design/mobile-concept/screenshots";

mkdirSync(outDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  "--user-data-dir=/tmp/low-signal-mobile-capture",
  "--window-size=390,844",
], {
  stdio: "ignore",
});

process.on("exit", () => chrome.kill("SIGTERM"));
process.on("SIGINT", () => {
  chrome.kill("SIGTERM");
  process.exit(130);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForChrome() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`${origin}/json/version`);
      if (response.ok) return;
    } catch {
      await sleep(120);
    }
  }
  throw new Error("Chrome DevTools did not start.");
}

class CdpSocket {
  constructor(wsUrl) {
    const url = new URL(wsUrl);
    this.host = url.hostname;
    this.port = Number(url.port);
    this.path = `${url.pathname}${url.search}`;
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();
    this.buffer = Buffer.alloc(0);
  }

  async connect() {
    this.socket = net.createConnection({ host: this.host, port: this.port });
    await new Promise((resolve, reject) => {
      this.socket.once("connect", resolve);
      this.socket.once("error", reject);
    });

    const key = randomBytes(16).toString("base64");
    this.socket.write(
      [
        `GET ${this.path} HTTP/1.1`,
        `Host: ${this.host}:${this.port}`,
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Key: ${key}`,
        "Sec-WebSocket-Version: 13",
        "\r\n",
      ].join("\r\n"),
    );

    await new Promise((resolve, reject) => {
      let handshake = Buffer.alloc(0);
      const onData = (chunk) => {
        handshake = Buffer.concat([handshake, chunk]);
        const headerEnd = handshake.indexOf("\r\n\r\n");
        if (headerEnd === -1) return;
        this.socket.off("data", onData);
        const header = handshake.subarray(0, headerEnd).toString("utf8");
        if (!header.includes("101")) {
          reject(new Error(`WebSocket upgrade failed: ${header}`));
          return;
        }
        const rest = handshake.subarray(headerEnd + 4);
        if (rest.length) this.receive(rest);
        this.socket.on("data", (data) => this.receive(data));
        resolve();
      };
      this.socket.on("data", onData);
      this.socket.once("error", reject);
    });
  }

  on(method, handler) {
    this.events.set(method, handler);
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = Buffer.from(JSON.stringify({ id, method, params }));
    const mask = randomBytes(4);
    const header =
      payload.length < 126
        ? Buffer.from([0x81, 0x80 | payload.length])
        : Buffer.from([0x81, 0x80 | 126, payload.length >> 8, payload.length & 0xff]);
    const masked = Buffer.alloc(payload.length);
    for (let i = 0; i < payload.length; i += 1) {
      masked[i] = payload[i] ^ mask[i % 4];
    }
    this.socket.write(Buffer.concat([header, mask, masked]));

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  receive(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= 2) {
      const first = this.buffer[0];
      const second = this.buffer[1];
      let offset = 2;
      let length = second & 0x7f;
      if (length === 126) {
        if (this.buffer.length < 4) return;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) return;
        length = Number(this.buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const masked = Boolean(second & 0x80);
      const maskOffset = masked ? 4 : 0;
      if (this.buffer.length < offset + maskOffset + length) return;
      let payload = this.buffer.subarray(offset + maskOffset, offset + maskOffset + length);
      if (masked) {
        const mask = this.buffer.subarray(offset, offset + 4);
        payload = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
      }
      this.buffer = this.buffer.subarray(offset + maskOffset + length);
      const opcode = first & 0x0f;
      if (opcode === 0x8) return;
      if (opcode !== 0x1) continue;
      const message = JSON.parse(payload.toString("utf8"));
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
      } else if (message.method && this.events.has(message.method)) {
        this.events.get(message.method)(message.params);
      }
    }
  }

  close() {
    this.socket.end();
  }
}

async function newPage() {
  const response = await fetch(`${origin}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });
  const target = await response.json();
  const cdp = new CdpSocket(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return cdp;
}

async function navigate(cdp, path, width, height) {
  let loaded;
  const loadedPromise = new Promise((resolve) => {
    loaded = resolve;
  });
  cdp.on("Page.loadEventFired", loaded);
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    isMobile: width < 768,
    mobile: width < 768,
    width,
  });
  await cdp.send("Page.navigate", { url: `${site}${path}` });
  await Promise.race([loadedPromise, sleep(3500)]);
  await sleep(900);
}

async function screenshot(cdp, file, fullPage = true) {
  if (fullPage) {
    await warmLazyImages(cdp);
  }
  const params = { captureBeyondViewport: fullPage, format: "png", fromSurface: true };
  const result = await cdp.send("Page.captureScreenshot", params);
  writeFileSync(`${outDir}/${file}`, Buffer.from(result.data, "base64"));
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  return result.result.value;
}

async function warmLazyImages(cdp) {
  await evaluate(
    cdp,
    `new Promise(async (resolve) => {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      for (let y = 0; y <= height; y += Math.max(420, Math.floor(innerHeight * 0.72))) {
        scrollTo(0, y);
        await new Promise((done) => setTimeout(done, 170));
      }
      scrollTo(0, 0);
      await new Promise((done) => setTimeout(done, 500));
      resolve(true);
    })`,
  );
}

async function captureRoute(path, name) {
  const cdp = await newPage();
  await navigate(cdp, path, 390, 844);
  await screenshot(cdp, `${name}-full-390.png`);
  cdp.close();
}

async function captureState(path, name, expression) {
  const cdp = await newPage();
  await navigate(cdp, path, 390, 844);
  await sleep(1800);
  await evaluate(cdp, expression);
  await sleep(800);
  await screenshot(cdp, `${name}-390.png`, false);
  cdp.close();
}

async function checkWidths(paths) {
  const widths = [375, 390, 430, 768];
  const rows = [];
  for (const path of paths) {
    for (const width of widths) {
      const cdp = await newPage();
      await navigate(cdp, path, width, 844);
      const overflow = await evaluate(
        cdp,
        `(() => {
          const doc = document.documentElement;
          const body = document.body;
          const offenders = [...document.querySelectorAll("*")]
            .map((el) => ({ tag: el.tagName, cls: el.className, rect: el.getBoundingClientRect() }))
            .filter((item) => item.rect.width > 0 && (item.rect.left < -1 || item.rect.right > innerWidth + 1))
            .slice(0, 8);
          return { path: location.pathname, width: innerWidth, scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth), overflow: Math.max(doc.scrollWidth, body.scrollWidth) - innerWidth, offenders };
        })()`,
      );
      rows.push(overflow);
      cdp.close();
    }
  }
  writeFileSync(`${outDir}/viewport-checks.json`, JSON.stringify(rows, null, 2));
  return rows;
}

await waitForChrome();

const routes = [
  ["/", "home"],
  ["/collections", "collections"],
  ["/collections/men", "men"],
  ["/collections/women", "women"],
  ["/lookbook", "lookbook"],
  ["/about", "about"],
  ["/products/field-jacket", "product-field-jacket"],
  ["/cart", "cart-route"],
];

if (process.env.CAPTURE_ONLY !== "states") {
  for (const [path, name] of routes) {
    await captureRoute(path, name);
  }
}

await captureState(
  "/?menu=open",
  "state-mobile-menu",
  `true`,
);

await captureState(
  "/collections/men",
  "state-men-filters-open",
  `(() => {
    const details = [...document.querySelectorAll("details")];
    details[0].open = true;
    details[1].open = true;
    const nested = [...document.querySelectorAll("details details")];
    if (nested[0]) nested[0].open = true;
  })()`,
);

if (process.env.CAPTURE_ONLY !== "states") {
  const checks = await checkWidths(routes.map(([path]) => path));
  console.log(JSON.stringify(checks, null, 2));
}

chrome.kill("SIGTERM");
