import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = process.env.VISUAL_AUDIT_BASE_URL ?? "http://localhost:3006";
const outputDirectory =
  process.env.VISUAL_AUDIT_OUTPUT ?? "artifacts/targeted-design/after";
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_EXECUTABLE_PATH ??
    "/tmp/pw/chromium_headless_shell-1187/chrome-mac/headless_shell",
});

await mkdir(outputDirectory, { recursive: true });

const page = await browser.newPage();
const report = [];
const pageErrors = [];
const failedRequests = [];

page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("requestfailed", (request) => {
  failedRequests.push(
    `${request.method()} ${request.url()} ${request.failure()?.errorText}`,
  );
});

async function prepare(route, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (
      let top = 0;
      top < document.documentElement.scrollHeight;
      top += window.innerHeight * 0.8
    ) {
      window.scrollTo(0, top);
      await new Promise((resolve) => window.setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(
      () =>
        Array.from(document.images).every(
          (image) => image.complete && image.naturalWidth > 0,
        ),
      undefined,
      { timeout: 10_000 },
    )
    .catch(() => {});
}

async function record(name, route, width, height, selector, fullPage = false) {
  await prepare(route, width, height);
  const target = selector ? page.locator(selector).first() : page;
  if (selector) {
    await target.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(250);
  await target.screenshot({
    path: `${outputDirectory}/${name}.png`,
    ...(selector ? {} : { fullPage }),
  });
  const metrics = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  report.push({
    height,
    name,
    overflow:
      Math.max(metrics.bodyWidth, metrics.documentWidth) - metrics.viewportWidth,
    route,
    width,
  });
}

async function checkOverflow(name, route, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(350);
  const metrics = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  report.push({
    height,
    name,
    overflow:
      Math.max(metrics.bodyWidth, metrics.documentWidth) - metrics.viewportWidth,
    route,
    width,
  });
}

for (const [label, width, height] of [
  ["desktop-1440", 1440, 900],
  ["mobile-390", 390, 844],
]) {
  await record(
    `section-04-${label}`,
    "/",
    width,
    height,
    "#selected-pieces",
  );
  await record(
    `section-05-${label}`,
    "/",
    width,
    height,
    ".mobile-material-story",
  );
  await record(`footer-${label}`, "/", width, height, ".site-footer");
  await record(`men-${label}`, "/collections/men", width, height, null, true);
  await record(
    `women-${label}`,
    "/collections/women",
    width,
    height,
    null,
    true,
  );
}

for (const [width, height] of [
  [375, 844],
  [430, 932],
  [768, 1024],
  [1920, 1080],
]) {
  for (const [name, route] of [
    ["home", "/"],
    ["men", "/collections/men"],
    ["women", "/collections/women"],
  ]) {
    await checkOverflow(`${name}-overflow-${width}`, route, width, height);
  }
}

await writeFile(
  `${outputDirectory}/report.json`,
  JSON.stringify(
    {
      failedRequests: failedRequests.filter(
        (request) => !request.endsWith("net::ERR_ABORTED"),
      ),
      pageErrors,
      screens: report,
    },
    null,
    2,
  ),
);

await browser.close();

console.log(JSON.stringify({ pageErrors, screens: report }, null, 2));
