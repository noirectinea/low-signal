import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const baseURL = "http://localhost:3006";
const outputDirectory = "artifacts/ecommerce-qa";
const browser = await chromium.launch({
  executablePath:
    "/tmp/pw/chromium_headless_shell-1187/chrome-mac/headless_shell",
});

await mkdir(outputDirectory, { recursive: true });

const report = [];
const page = await browser.newPage();
const pageErrors = [];
const failedRequests = [];

page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("requestfailed", (request) => {
  failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`);
});

async function capture(name, route, width, height, fullPage = true) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  if (fullPage) {
    await page.evaluate(async () => {
      for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight * 0.8) {
        window.scrollTo(0, top);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
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
    await page.waitForTimeout(300);
  }
  await page.screenshot({
    fullPage,
    path: `${outputDirectory}/${name}.png`,
  });
  const metrics = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  report.push({
    height,
    name,
    overflow: Math.max(metrics.bodyWidth, metrics.documentWidth) - metrics.viewportWidth,
    route,
    width,
  });
}

for (const width of [375, 390, 430, 768]) {
  await capture(`home-${width}`, "/", width, width === 768 ? 1024 : 844);
}

await capture("home-desktop-1440", "/", 1440, 900);
await capture("collections-mobile-390", "/collections", 390, 844);
await capture("men-mobile-390", "/collections/men", 390, 844);

await page.getByRole("button", { name: /Filters/ }).click();
await page.screenshot({
  path: `${outputDirectory}/filters-mobile-390.png`,
});
await page.getByRole("button", { exact: true, name: "Close" }).click();

await capture("product-mobile-390", "/products/field-jacket", 390, 844);
const mediumSize = page.locator("button[aria-pressed]").filter({ hasText: /^M$/ }).last();
await mediumSize.evaluate((element) => element.click());
await page
  .getByRole("button", { name: /^Add to cart/i })
  .last()
  .evaluate((element) => element.click());
await capture("cart-mobile-390", "/cart", 390, 844);
await capture("checkout-mobile-390", "/checkout", 390, 844);
await capture("search-mobile-390", "/search?q=work", 390, 844);
await capture("lookbook-mobile-390", "/lookbook", 390, 844);
await capture("about-mobile-390", "/about", 390, 844);

await page.goto(`${baseURL}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Menu" }).click();
await page.screenshot({
  path: `${outputDirectory}/menu-mobile-390.png`,
});

await capture("product-desktop-1440", "/products/field-jacket", 1440, 900);
await capture("catalog-desktop-1440", "/collections/men", 1440, 900);

await writeFile(
  `${outputDirectory}/report.json`,
  JSON.stringify({
    failedRequests: failedRequests.filter((request) => !request.endsWith("net::ERR_ABORTED")),
    pageErrors,
    screens: report,
  }, null, 2),
);

await browser.close();

console.log(
  JSON.stringify(
    {
      failedRequests,
      pageErrors,
      screens: report,
    },
    null,
    2,
  ),
);
