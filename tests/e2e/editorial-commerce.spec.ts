import { expect, test } from "@playwright/test";

test("selected garments uses a one-row cyclical desktop rail", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  await expect(section.getByLabel("Shop selected garments")).toBeVisible();
  await expect(
    section.getByAltText("Close-up of washed black cotton twill"),
  ).toBeVisible();
  await expect(section.locator("article")).toHaveCount(18);
  await expect(section.locator(".selected-rail")).toBeVisible();
  await expect(
    section.getByRole("button", { name: "Next selected garment" }),
  ).toBeVisible();
  await expect(section.locator(".selected-rail-footer > span")).toHaveText(
    "01 / 06",
  );

  for (let index = 0; index < 6; index += 1) {
    await section.getByRole("button", { name: "Next selected garment" }).click();
    await page.waitForTimeout(450);
  }
  await expect(section.locator(".selected-rail-footer > span")).toHaveText(
    "01 / 06",
  );
});

test("selected garments uses a light mobile campaign and swipe rail", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  const campaign = section.getByLabel("Shop selected garments");
  await expect(campaign).toBeVisible();
  await expect(
    section.getByAltText("Close-up of washed black cotton twill"),
  ).toBeHidden();
  await expect(campaign.getByText("Selected garments", { exact: true })).toBeVisible();
  await expect(campaign.getByText("06 pieces", { exact: true })).toBeVisible();
  await expect(campaign.getByText("Shop selection →", { exact: true })).toBeVisible();
  await expect(campaign).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(campaign).toHaveCSS("border-top-width", "0px");
  const campaignMetrics = await campaign.evaluate((element) => {
    const title = element.querySelector("p");
    const rect = element.getBoundingClientRect();
    return {
      fontSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0,
      height: rect.height,
      left: rect.left,
      width: rect.width,
    };
  });
  expect(campaignMetrics.left).toBe(0);
  expect(campaignMetrics.width).toBe(390);
  expect(campaignMetrics.fontSize).toBeGreaterThanOrEqual(28);
  expect(campaignMetrics.height).toBeLessThan(115);
  await expect(section.locator("article")).toHaveCount(18);
  await expect(section.getByRole("link", { name: "Men", exact: true })).toBeVisible();
  await expect(section.getByRole("link", { name: "Women", exact: true })).toBeVisible();
  await expect(section.getByText("View product →").first()).toBeHidden();
  await expect(
    section.getByRole("button", { name: "Next selected garment" }),
  ).toBeHidden();
  await expect(section.locator(".selected-rail-progress")).toBeVisible();
  await expect(section.locator("article h3")).toHaveText([
    "Field Jacket",
    "Work Jacket",
    "Cotton Shirt",
    "Storm Parka",
    "Double Face Coat",
    "Double Pleat Trouser",
    "Field Jacket",
    "Work Jacket",
    "Cotton Shirt",
    "Storm Parka",
    "Double Face Coat",
    "Double Pleat Trouser",
    "Field Jacket",
    "Work Jacket",
    "Cotton Shirt",
    "Storm Parka",
    "Double Face Coat",
    "Double Pleat Trouser",
  ]);
  await section.locator(".selected-rail").evaluate((rail) => {
    const railElement = rail as HTMLElement;
    const cards = rail.querySelectorAll<HTMLElement>("[data-selected-card]");
    const target = cards[7];
    railElement.scrollTo({
      behavior: "auto",
      left: target.offsetLeft - railElement.offsetLeft,
    });
  });
  await expect(section.locator(".selected-rail-footer > span")).toHaveText(
    "02 / 06",
  );
});

test("mobile selected garments autoplays, pauses after input, and respects reduced motion", async ({
  page,
}) => {
  test.setTimeout(35_000);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const index = page.locator("#selected-pieces .selected-rail-footer > span");
  await page.locator("#selected-pieces").scrollIntoViewIfNeeded();
  await expect(index).toHaveText("01 / 06");
  await expect(index).toHaveText("02 / 06", { timeout: 5_500 });

  await page.locator("#selected-pieces .selected-rail").dispatchEvent("pointerdown");
  await page.locator("#selected-pieces .selected-rail").evaluate((rail) => {
    const railElement = rail as HTMLElement;
    const cards = rail.querySelectorAll<HTMLElement>("[data-selected-card]");
    const target = cards[8];
    railElement.scrollTo({
      behavior: "auto",
      left: target.offsetLeft - railElement.offsetLeft,
    });
  });
  await expect(index).toHaveText("03 / 06");
  await page.waitForTimeout(8_200);
  await expect(index).toHaveText("03 / 06");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.locator("#selected-pieces").scrollIntoViewIfNeeded();
  await expect(index).toHaveText("01 / 06");
  await page.waitForTimeout(4_200);
  await expect(index).toHaveText("01 / 06");
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
