import { expect, test } from "@playwright/test";

test("selected garments is a static desktop composition", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  await expect(section.getByLabel("Shop selected garments")).toBeVisible();
  await expect(section.locator("article")).toHaveCount(4);
  await expect(section.getByRole("link", { name: "View all 6 →" })).toBeVisible();
  await expect(section.getByText("View product →")).toHaveCount(4);
  await expect(section.locator(".selected-rail")).toHaveCount(0);
});

test("selected garments uses a compact two-column mobile grid", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  await expect(section.getByLabel("Shop selected garments")).toBeHidden();
  await expect(section.locator("article")).toHaveCount(4);
  await expect(section.getByRole("link", { name: "Men", exact: true })).toBeVisible();
  await expect(section.getByRole("link", { name: "Women", exact: true })).toBeVisible();
  await expect(section.getByText("View product →").first()).toBeVisible();
});

test("material rows update the image, caption, and garment link", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(".material-form-section");
  const image = section.getByRole("img");

  await section.getByRole("button", { name: "Dry wool" }).click();
  await expect(image).toHaveAttribute("alt", "Dry wool material detail");
  await expect(section.getByText(/Dense warmth with a matte surface/)).toBeVisible();
  await expect(section.getByRole("link", { name: "View garments →" })).toHaveAttribute(
    "href",
    "/collections/women?material=wool",
  );

  await section.getByRole("button", { name: "Worn nylon" }).focus();
  await expect(image).toHaveAttribute("alt", "Worn nylon material detail");
});

test("catalog opens a product and preserves its return state", async ({
  page,
}) => {
  await page.goto("/collections/men");
  await page.getByLabel("Sort products").selectOption("popular");
  await page.getByLabel("Collection category").selectOption("Outerwear");
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.getByRole("link", { name: "Open Field Jacket" }).click();
  await expect(page).toHaveURL(/returnTo=.*sort%3Dpopular/);

  const back = page.getByRole("link", { name: "← Back to Men" });
  await expect(back).toHaveAttribute(
    "href",
    "/collections/men?type=Outerwear&sort=popular",
  );
  await back.click();
  await expect(page).toHaveURL(/type=Outerwear&sort=popular/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("catalog toolbar sorts, filters, switches categories, and persists view", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/collections/men");
  await page.evaluate(() => localStorage.removeItem("low-signal-catalog-view"));
  await page.reload();

  const products = page.locator(".catalog-products article");
  const productNames = () => products.locator("h2").allTextContents();

  await page.getByLabel("Sort products").selectOption("price-asc");
  await expect.poll(async () => (await productNames())[0]).toBe("Washed Longsleeve");

  await page.getByLabel("Sort products").selectOption("price-desc");
  await expect.poll(async () => (await productNames())[0]).toBe("Work Jacket");

  await page.getByLabel("Sort products").selectOption("popular");
  await expect(page).toHaveURL(/sort=popular/);

  for (const category of ["Outerwear", "Shirts", "Knitwear", "Trousers"]) {
    await page.getByLabel("Collection category").selectOption(category);
    await expect(products).toHaveCount(2);
  }
  await page.getByLabel("Collection category").selectOption("Outerwear");
  await expect(page).toHaveURL(/type=Outerwear/);

  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.getByRole("button", { name: "List view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".catalog-list-view")).toBeVisible();

  await page.goto("/collections/women");
  await expect(page.getByRole("button", { name: "List view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: /^Filters/ }).click();
  const panel = page.getByRole("dialog", { name: "Collection filters" });
  await panel.getByRole("button", { name: "S", exact: true }).click();
  await panel.getByRole("button", { name: "Charcoal" }).click();
  await panel.getByRole("button", { name: "Wool" }).click();
  await panel.getByRole("button", { name: "$150 – $199" }).click();
  await panel.getByRole("button", { name: /View \d+ pieces/ }).click();
  await expect(page).toHaveURL(
    /size=S&color=Charcoal&material=wool&price=150-199/,
  );
  await expect(page.locator(".catalog-products article")).toHaveCount(1);

  await page.getByRole("button", { name: "Grid view" }).click();
  await expect(page.locator(".catalog-list-view")).toBeHidden();
  await expect(page.locator(".catalog-products")).toHaveCSS("display", "grid");
});
