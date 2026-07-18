import { expect, test } from "@playwright/test";

test("mobile header and menu expose ecommerce navigation", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await expect(page.getByLabel("Search products")).toBeHidden();
  await expect(page.getByLabel("Sign in")).toBeVisible();
  await expect(page.getByLabel(/Cart, \d+ items/).first()).toBeVisible();
  await page.getByRole("button", { name: "Menu" }).click();

  const menu = page.getByRole("dialog", { name: "Site menu" });
  for (const label of [
    "Home",
    "Collections",
    "Men",
    "Women",
    "Lookbook",
    "About",
    "Search",
    "Cart (0)",
    "Shipping",
    "Returns",
    "Contact",
    "Cookies",
    "Privacy",
    "Terms",
    "Instagram ↗",
  ]) {
    await expect(menu.getByText(label, { exact: true })).toBeVisible();
  }
});

test("desktop header keeps primary navigation and commerce actions", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const header = page.locator(".mobile-site-header");
  for (const label of ["Home", "Collections", "Lookbook", "About"]) {
    await expect(header.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(header.getByLabel("Search products")).toBeVisible();
  await expect(header.getByLabel("Sign in")).toBeVisible();
  await expect(header.getByLabel(/Cart, \d+ items/).last()).toBeVisible();
  await expect(header.getByRole("button", { name: "Menu" })).toBeHidden();
});

test("mobile filters apply, close, and persist in the URL", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/collections/men");
  await page.getByRole("button", { name: /^Filters/ }).click();

  const filters = page.getByRole("dialog", { name: "Collection filters" });
  await filters.getByRole("button", { name: "Canvas" }).click();
  await filters.getByRole("button", { name: /View \d+ pieces/ }).click();

  await expect(filters).toBeHidden();
  await expect(page).toHaveURL(/material=canvas/);
  await expect(page.getByText("Canvas", { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/material=canvas/);
  await expect(page.getByRole("button", { name: /^Filters \/ 1/ })).toBeVisible();
});
