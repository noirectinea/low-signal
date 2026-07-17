import { expect, test } from "@playwright/test";

test.use({ viewport: { height: 844, width: 390 } });

test("product, cart persistence, quantity, and guest checkout", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/products/field-jacket");

  await expect(page.getByText(/01 \/ 03/).last()).toBeVisible();
  const mediumSize = page
    .locator("button[aria-pressed]")
    .filter({ hasText: /^M$/ })
    .last();
  await mediumSize.click();
  await expect(mediumSize).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Selected: M")).toBeVisible();
  await page.getByRole("button", { name: /^Add to cart/i }).click();
  await expect(page.getByLabel("Cart, 1 items").first()).toBeVisible();

  await page.getByLabel("Cart, 1 items").first().click();
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Add one Field Jacket" }).click();
  await expect(page.getByText("2", { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("2", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: /Proceed to checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/Guest checkout is available/)).toBeVisible();
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});
