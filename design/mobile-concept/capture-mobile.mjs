import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import net from "node:net";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = Number(process.env.CAPTURE_DEBUG_PORT ?? 9223);
const origin = `http://127.0.0.1:${port}`;
const site = process.env.CAPTURE_SITE ?? "http://localhost:3000";
const outDir = "design/mobile-concept/screenshots";
const captureWidth = Number(process.env.CAPTURE_WIDTH ?? 390);
const captureHeight = Number(process.env.CAPTURE_HEIGHT ?? 844);

mkdirSync(outDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=/tmp/low-signal-mobile-capture-${port}`,
  `--window-size=${captureWidth},${captureHeight}`,
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
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await evaluate(
      cdp,
      `document.readyState === "complete" &&
       !document.body.innerText.includes("LOADING COLLECTION") &&
       !document.body.innerText.includes("Loading collection")`,
    );
    if (ready) break;
    await sleep(150);
  }
  await evaluate(
    cdp,
    `Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      ...[...document.images].filter((image) => image.loading !== "lazy").map(
        (image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        })
      )
    ]).then(() => true)`,
  );
  await sleep(500);
}

async function screenshot(cdp, file, fullPage = true, directory = outDir) {
  if (fullPage) {
    await warmLazyImages(cdp);
  }
  const params = { captureBeyondViewport: fullPage, format: "png", fromSurface: true };
  if (fullPage) {
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const content = metrics.cssContentSize;
    params.clip = {
      height: Math.ceil(content.height),
      scale: 1,
      width: Math.ceil(content.width),
      x: 0,
      y: 0,
    };
  } else {
    const metrics = await cdp.send("Page.getLayoutMetrics");
    const viewport = metrics.cssVisualViewport;
    params.captureBeyondViewport = true;
    params.clip = {
      height: Math.ceil(viewport.clientHeight),
      scale: 1,
      width: Math.ceil(viewport.clientWidth),
      x: Math.max(0, viewport.pageX),
      y: Math.max(0, viewport.pageY),
    };
  }
  const result = await cdp.send("Page.captureScreenshot", params);
  writeFileSync(`${directory}/${file}`, Buffer.from(result.data, "base64"));
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
  await navigate(cdp, path, captureWidth, captureHeight);
  const pageState = await evaluate(
    cdp,
    `({
      height: document.documentElement.scrollHeight,
      innerWidth,
      loading: document.body.innerText.includes("LOADING COLLECTION")
    })`,
  );
  console.log(name, JSON.stringify(pageState, null, 2));
  await screenshot(cdp, `${name}-full-${captureWidth}.png`);
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

async function captureContactSheet() {
  const cdp = await newPage();
  let loaded;
  const loadedPromise = new Promise((resolve) => {
    loaded = resolve;
  });
  cdp.on("Page.loadEventFired", loaded);
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height: 1200,
    isMobile: false,
    mobile: false,
    width: 2400,
  });
  await cdp.send("Page.navigate", {
    url: `file://${process.cwd()}/design/mobile-concept/contact-sheet.html`,
  });
  await Promise.race([loadedPromise, sleep(3500)]);
  await sleep(1200);
  await screenshot(cdp, "contact-sheet.png", true, "design/mobile-concept");
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

const selectedRoutes = process.env.CAPTURE_ROUTE
  ? routes.filter(([path]) => path === process.env.CAPTURE_ROUTE)
  : routes;

if (process.env.CAPTURE_ONLY !== "states") {
  for (const [path, name] of selectedRoutes) {
    await captureRoute(path, name);
  }
}

if (!process.env.SKIP_STATES) {
  await captureState("/", "key-home-hero", `scrollTo(0, 0); true`);
  await captureState(
    "/",
    "key-home-selected",
    `(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const node = document.querySelector("#selected-pieces");
      scrollTo(0, Math.max(0, (node?.offsetTop ?? 0) - 64));
      return true;
    })()`,
  );
  await captureState("/collections", "key-collections", `scrollTo(0, 0); true`);
  await captureState(
    "/collections/men",
    "key-men-catalog",
    `(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const node = document.querySelector(".mobile-product-section");
      scrollTo(0, Math.max(0, (node?.offsetTop ?? 0) - 64));
      return true;
    })()`,
  );
  await captureState(
    "/collections/women",
    "key-women-catalog",
    `(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const node = document.querySelector(".mobile-product-section");
      scrollTo(0, Math.max(0, (node?.offsetTop ?? 0) - 64));
      return true;
    })()`,
  );
  await captureState("/products/field-jacket", "key-product", `scrollTo(0, 0); true`);
  await captureState("/lookbook", "key-lookbook", `scrollTo(0, 0); true`);
  await captureState("/about", "key-about", `scrollTo(0, 0); true`);
  await captureState("/cart", "key-cart-route", `scrollTo(0, 0); true`);
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
}

if (process.env.CAPTURE_ONLY !== "states" && !process.env.SKIP_CHECKS) {
  const checks = await checkWidths(selectedRoutes.map(([path]) => path));
  console.log(JSON.stringify(checks, null, 2));
}

if (!process.env.SKIP_CONTACT_SHEET && !process.env.CAPTURE_ROUTE) {
  await captureContactSheet();
}

chrome.kill("SIGTERM");
