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
  await page.getByRole("button", { name: /^Select a size/i }).click();
  await expect(page.getByText("Choose a size before adding this piece.")).toBeVisible();
  const mediumSize = page
    .locator("button[aria-pressed]")
    .filter({ hasText: /^M$/ })
    .last();
  await mediumSize.click();
  await expect(mediumSize).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Selected: M")).toBeVisible();
  await page.getByRole("button", { name: /^Add to cart/i }).click();
  await expect(page.getByLabel("Cart, 1 items").first()).toBeVisible();
  const stepper = page.getByLabel("Field Jacket quantity");
  await expect(stepper).toBeVisible();
  await expect(stepper.getByText("In cart", { exact: true })).toBeVisible();
  await expect(
    page.locator(".related-product-card").filter({ visible: true }),
  ).toHaveCount(2);
  await stepper.getByRole("button", { name: "Add one Field Jacket" }).click();
  await expect(stepper.getByText("2", { exact: true })).toBeVisible();

  await page.getByLabel("Cart, 2 items").first().click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Add one Field Jacket" }).click();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: /Proceed to checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/continue as guest/)).toBeVisible();
  await page.getByText(/Order summary/).first().click();
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  const email = page.getByRole("textbox", { name: "Email *" });
  await email.fill("guest@example.com");
  await page.reload();
  await expect(email).toHaveValue("guest@example.com");
  expect(pageErrors).toEqual([]);
});
