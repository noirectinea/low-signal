import { expect, test } from "@playwright/test";

test("selected garments loops in both directions without empty rail space", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  const counter = section.getByTestId("selected-counter");
  const previous = section.getByRole("button", {
    name: "Previous selected garment",
  });
  const next = section.getByRole("button", {
    name: "Next selected garment",
  });

  await expect(counter).toHaveText("01 / 06");
  await previous.click();
  await expect(counter).toHaveText("06 / 06");
  await next.click();
  await expect(counter).toHaveText("01 / 06");

  for (let index = 0; index < 8; index += 1) {
    await next.click();
    await page.waitForTimeout(260);
    const visibleCards = await section.locator(".selected-rail").evaluate((rail) => {
      const railRect = rail.getBoundingClientRect();
      return Array.from(
        rail.querySelectorAll<HTMLElement>("[data-rail-position]"),
      ).filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.right > railRect.left && rect.left < railRect.right;
      }).length;
    });
    expect(visibleCards).toBeGreaterThanOrEqual(3);
  }

  await section.locator(".selected-rail").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(counter).toHaveText(/\d{2} \/ 06/);
});

test("selected garments wraps after a mobile swipe-sized scroll", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  const section = page.locator("#selected-pieces");
  const rail = section.locator(".selected-rail");
  const counter = section.getByTestId("selected-counter");
  await expect(counter).toHaveText("01 / 06");
  await rail.scrollIntoViewIfNeeded();

  await rail.evaluate((element) => {
    const card = element.querySelector<HTMLElement>("[data-rail-position]");
    element.scrollBy({
      behavior: "auto",
      left: -(card?.offsetWidth ?? 280) - 14,
    });
  });

  await expect(counter).toHaveText("06 / 06");
  const visibleCards = await rail.evaluate((element) => {
    const railRect = element.getBoundingClientRect();
    return Array.from(
      element.querySelectorAll<HTMLElement>("[data-rail-position]"),
    ).filter((card) => {
      const rect = card.getBoundingClientRect();
      return rect.right > railRect.left && rect.left < railRect.right;
    }).length;
  });
  expect(visibleCards).toBeGreaterThanOrEqual(2);
});

test("material rows update the image, caption, and garment link", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator(".material-form-section");
  const image = section.getByRole("img");

  await section.getByRole("button", { name: "Dry wool" }).click();
  await expect(image).toHaveAttribute("alt", "Dry wool garment detail");
  await expect(section.getByText(/Dense warmth with a matte surface/)).toBeVisible();
  await expect(section.getByRole("link", { name: "View garments →" })).toHaveAttribute(
    "href",
    "/collections/women?material=wool",
  );

  await section.getByRole("button", { name: "Worn nylon" }).focus();
  await expect(image).toHaveAttribute("alt", "Worn nylon garment detail");
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
