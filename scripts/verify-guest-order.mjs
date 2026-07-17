import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath:
    "/tmp/pw/chromium_headless_shell-1187/chrome-mac/headless_shell",
});
const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
const errors = [];

page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://localhost:3006/products/field-jacket");
await page.evaluate(() => localStorage.clear());
await page.reload();

const mediumSize = page.locator("button[aria-pressed]").filter({ hasText: /^M$/ }).last();
await mediumSize.click();
await page.getByRole("button", { name: /^Add to cart/i }).last().click();
await page.goto("http://localhost:3006/checkout");

await page.getByLabel("Email").fill(`guest-${Date.now()}@example.com`);
await page.getByLabel("First name").fill("Guest");
await page.getByLabel("Last name").fill("Customer");
await page.getByLabel("Shipping name").fill("Guest Customer");
await page.getByLabel("Address line 1").fill("12 Concrete Road");
await page.getByLabel("City").fill("Istanbul");
await page.getByLabel("Postal code").fill("34000");
await page.getByLabel("Country").fill("Türkiye");
await page.getByRole("button", { name: /Place order/ }).click();
await page.waitForURL(/\/checkout\/success/, { timeout: 30_000 });

const orderNumber = await page
  .locator("main")
  .getByText(/^LS-/)
  .first()
  .textContent();

await page.screenshot({
  fullPage: true,
  path: "artifacts/ecommerce-qa/checkout-success-mobile-390.png",
});

console.log(
  JSON.stringify(
    {
      cartCount: await page.getByLabel(/Cart, \d+ items/).first().getAttribute("aria-label"),
      errors,
      orderNumber,
      url: page.url(),
    },
    null,
    2,
  ),
);

await browser.close();
