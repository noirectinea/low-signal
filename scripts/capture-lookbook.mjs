import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath:
    "/tmp/pw/chromium_headless_shell-1187/chrome-mac/headless_shell",
});
const page = await browser.newPage({ viewport: { height: 844, width: 390 } });

await page.goto("http://localhost:3006/lookbook", {
  waitUntil: "domcontentloaded",
});

const images = page.locator("main img");
for (let index = 0; index < (await images.count()); index += 1) {
  const image = images.nth(index);
  await image.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(260);
}

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({
  fullPage: true,
  path: "artifacts/ecommerce-qa/lookbook-mobile-390.png",
});

console.log(
  JSON.stringify({
    images: await images.count(),
    incomplete: await images.evaluateAll((elements) =>
      elements
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src")),
    ),
  }),
);

await browser.close();
