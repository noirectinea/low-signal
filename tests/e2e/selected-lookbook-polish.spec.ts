import { expect, test } from "@playwright/test";

const requestedViewports = [
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 854, width: 400 },
  { height: 844, width: 430 },
  { height: 1024, width: 768 },
  { height: 800, width: 1280 },
  { height: 900, width: 1440 },
  { height: 1080, width: 1920 },
] as const;

test.setTimeout(90_000);

test("Selected Garments and Lookbook remain composed at every requested viewport", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("/");
  await page.locator("#selected-pieces").waitFor();

  for (const viewport of requestedViewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(180);

    const measurements = await page.evaluate(() => {
      const rail = document.querySelector<HTMLElement>(".selected-rail");
      const cards = rail?.querySelectorAll<HTMLElement>(
        "[data-selected-card]",
      );
      const card = cards?.[6];
      const nextCard = cards?.[7];
      const image = card?.querySelector<HTMLElement>(":scope > div");
      const lookbook = document.querySelector<HTMLElement>(".mobile-journal");
      const rect = (element?: Element | null) =>
        element?.getBoundingClientRect() ?? null;
      const imageRect = rect(image);

      return {
        imageRatio: imageRect
          ? imageRect.width / imageRect.height
          : 0,
        lookbookHeight: rect(lookbook)?.height ?? 0,
        nextCardStartsInsideRail:
          (rect(nextCard)?.left ?? Number.POSITIVE_INFINITY) <
          (rect(rail)?.right ?? 0),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        selectedTitleWeight: Number.parseInt(
          getComputedStyle(
            document.querySelector(
              ".mobile-selected-editorial .selected-campaign-copy > p:first-child",
            )!,
          ).fontWeight,
          10,
        ),
      };
    });

    expect(measurements.overflow).toBeLessThanOrEqual(1);
    expect(measurements.nextCardStartsInsideRail).toBe(true);
    expect(measurements.selectedTitleWeight).toBeGreaterThanOrEqual(520);

    if (viewport.width < 768) {
      expect(measurements.lookbookHeight).toBeLessThanOrEqual(700);
    }
    if (viewport.width >= 1024) {
      expect(measurements.imageRatio).toBeGreaterThan(0.77);
      expect(measurements.imageRatio).toBeLessThan(0.83);
    }

  }

  expect(runtimeErrors).toEqual([]);
});

test("desktop autoplay pauses for hover and never opens Collections", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const section = page.locator("#selected-pieces");
  const rail = section.locator(".selected-rail");
  const index = section.locator(".selected-rail-index");
  await section.scrollIntoViewIfNeeded();
  await expect(index).toHaveText("01 / 06");

  await expect(index).toHaveText("02 / 06", { timeout: 4_200 });
  await rail.hover();
  const pausedIndex = await index.textContent();
  await page.waitForTimeout(3_300);
  await expect(index).toHaveText(pausedIndex ?? "");

  await page.mouse.move(0, 0);
  await expect(index).not.toHaveText(pausedIndex ?? "", { timeout: 7_500 });

  await section.locator("[data-selected-card] a").nth(6).focus();
  await page.waitForTimeout(500);
  const focusedIndex = await index.textContent();
  await page.waitForTimeout(3_300);
  await expect(index).toHaveText(focusedIndex ?? "");
  await expect(page).toHaveURL("/");
});

test("autoplay loops from 06 to 01 without opening Collections", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const section = page.locator("#selected-pieces");
  const rail = section.locator(".selected-rail");
  const index = section.locator(".selected-rail-index");
  await section.scrollIntoViewIfNeeded();

  await rail.evaluate((element) => {
    const railElement = element as HTMLElement;
    const card = element.querySelectorAll<HTMLElement>(
      "[data-selected-card]",
    )[11];
    railElement.scrollTo({
      behavior: "auto",
      left: card.offsetLeft - railElement.offsetLeft,
    });
  });
  await expect(index).toHaveText("06 / 06");
  await expect(index).toHaveText("01 / 06", { timeout: 4_200 });
  await expect(page).toHaveURL("/");
});

test("manual pull after 06 uses a deliberate threshold", async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const section = page.locator("#selected-pieces");
  const rail = section.locator(".selected-rail");
  const index = section.locator(".selected-rail-index");
  const next = section.getByRole("button", {
    name: "Next selected garment",
  });
  await section.scrollIntoViewIfNeeded();

  for (let step = 0; step < 5; step += 1) {
    await next.click();
    await expect(index).toHaveText(
      `${String(step + 2).padStart(2, "0")} / 06`,
    );
  }

  const railBox = await rail.boundingBox();
  const cardBox = await section
    .locator("[data-selected-card]")
    .nth(11)
    .boundingBox();
  expect(railBox).not.toBeNull();
  expect(cardBox).not.toBeNull();

  const startX = railBox!.x + railBox!.width * 0.68;
  const y = railBox!.y + railBox!.height * 0.45;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX - cardBox!.width * 0.15, y, { steps: 4 });
  await page.mouse.up();
  await expect(page).toHaveURL("/");

  await expect(index).toHaveText("06 / 06");
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(startX - cardBox!.width * 0.3, y, { steps: 6 });
  await page.mouse.up();
  await expect(page).toHaveURL("/collections");
});

test("reduced motion disables Selected Garments autoplay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const section = page.locator("#selected-pieces");
  const index = section.locator(".selected-rail-index");
  await section.scrollIntoViewIfNeeded();
  await expect(index).toHaveText("01 / 06");
  await page.waitForTimeout(3_400);
  await expect(index).toHaveText("01 / 06");
});

test("Collections remains keyboard-accessible after card 06", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const section = page.locator("#selected-pieces");
  const index = section.locator(".selected-rail-index");
  const next = section.getByRole("button", {
    name: "Next selected garment",
  });
  await section.scrollIntoViewIfNeeded();

  for (let step = 0; step < 5; step += 1) {
    await next.click();
    await expect(index).toHaveText(
      `${String(step + 2).padStart(2, "0")} / 06`,
    );
  }

  const collectionsLink = section.getByRole("link", {
    name: "View all collections",
  });
  await collectionsLink.focus();
  await expect(collectionsLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/collections");
});
