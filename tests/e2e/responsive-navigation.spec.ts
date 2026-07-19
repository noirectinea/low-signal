import { expect, test } from "@playwright/test";

test("mobile header and menu expose ecommerce navigation", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await expect(page.getByLabel("Search products")).toBeHidden();
  await expect(page.getByLabel("Sign in to account")).toHaveText("Account");
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
    "Admin ↗",
    "© 2026 LOW SIGNAL",
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
  await expect(header.getByLabel("Sign in to account")).toHaveText("Account");
  await expect(header.getByLabel(/Cart, \d+ items/).last()).toBeVisible();
  await expect(header.getByRole("button", { name: "Menu" })).toBeHidden();
});

test("mobile home keeps the first screen exact and removes the large footer", async ({
  page,
}) => {
  test.setTimeout(60_000);

  for (const viewport of [
    { height: 812, width: 375 },
    { height: 844, width: 390 },
    { height: 854, width: 400 },
    { height: 932, width: 430 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator(".mobile-home-hero").waitFor();

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>(".mobile-home-hero");
      const editorial =
        document.querySelector<HTMLElement>(".mobile-home-editorial");
      const spring =
        document.querySelector<HTMLElement>(".mobile-spring-teaser");
      const footer = document.querySelector<HTMLElement>(".site-footer");

      return {
        documentWidth: document.documentElement.scrollWidth,
        editorialTop: editorial?.getBoundingClientRect().top,
        footerDisplay: footer ? getComputedStyle(footer).display : null,
        heroHeight: hero?.getBoundingClientRect().height,
        springHeight: spring?.getBoundingClientRect().height,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics.heroHeight).toBe(metrics.viewportHeight);
    expect(metrics.editorialTop).toBeGreaterThanOrEqual(metrics.viewportHeight);
    expect(metrics.springHeight).toBeGreaterThanOrEqual(80);
    expect(metrics.springHeight).toBeLessThanOrEqual(110);
    expect(metrics.documentWidth).toBe(metrics.viewportWidth);
    expect(metrics.footerDisplay).toBe("none");
  }
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
