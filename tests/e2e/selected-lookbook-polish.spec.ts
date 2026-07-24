import { expect, test } from "@playwright/test";

const requestedViewports = [
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 854, width: 400 },
  { height: 844, width: 430 },
  { height: 1024, width: 768 },
  { height: 800, width: 1280 },
  { height: 900, width: 1440 },
  { height: 900, width: 1600 },
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
      const lookbookComposition = document.querySelector<HTMLElement>(
        ".mobile-journal-composition",
      );
      const lookbookDetails = document.querySelector<HTMLElement>(
        ".mobile-journal-details",
      );
      const lookbookLead = document.querySelector<HTMLElement>(
        ".mobile-journal-lead",
      );
      const material = document.querySelector<HTMLElement>(
        ".material-form-section",
      );
      const materialTitle = material?.querySelector<HTMLElement>(
        ".editorial-section-title",
      );
      const campaign = document.querySelector<HTMLElement>(
        ".selected-campaign-card",
      );
      const campaignTitle = document.querySelector<HTMLElement>(
        ".selected-campaign-title",
      );
      const selectedLayout = document.querySelector<HTMLElement>(
        ".selected-garments-layout",
      );
      const heroNote = document.querySelector<HTMLElement>(
        ".home-hero-image-note",
      );
      const desktopPromoTitles = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".desktop-home-editorial .home-section-title",
        ),
      );
      const visibleSectionTitle = Array.from(
        document.querySelectorAll<HTMLElement>(".home-section-title"),
      ).find((element) => element.getBoundingClientRect().width > 0);
      const visibleEditorialBody = Array.from(
        document.querySelectorAll<HTMLElement>(".home-editorial-body"),
      ).find((element) => element.getBoundingClientRect().width > 0);
      const productTitle = card?.querySelector<HTMLElement>(
        ".selected-product-title",
      );
      const rect = (element?: Element | null) =>
        element?.getBoundingClientRect() ?? null;
      const imageRect = rect(image);
      const cardRect = rect(card);
      const campaignRect = rect(campaign);
      const campaignTitleRect = rect(campaignTitle);
      const selectedLayoutRect = rect(selectedLayout);
      const leadRect = rect(lookbookLead);
      const railRect = rect(rail);
      const fullyVisibleProducts = Array.from(cards ?? []).filter((element) => {
        const itemRect = rect(element);
        return (
          itemRect &&
          railRect &&
          itemRect.left >= railRect.left - 1 &&
          itemRect.right <= railRect.right + 1
        );
      }).length;

      return {
        campaignRatio: campaignRect
          ? campaignRect.width / campaignRect.height
          : 0,
        campaignShare: campaignRect && selectedLayoutRect
          ? campaignRect.width / selectedLayoutRect.width
          : 0,
        campaignHeight: campaignRect?.height ?? 0,
        campaignTitleLines: campaignTitle
          ? Math.round(
              (campaignTitleRect?.height ?? 0) /
                Number.parseFloat(getComputedStyle(campaignTitle).lineHeight),
            )
          : 0,
        campaignTitleRightGap: campaignRect && campaignTitleRect
          ? campaignRect.right - campaignTitleRect.right
          : 0,
        cardHeight: cardRect?.height ?? 0,
        desktopPromoSizes: desktopPromoTitles.map((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
        desktopPromoWeights: desktopPromoTitles.map((element) =>
          Number.parseInt(getComputedStyle(element).fontWeight, 10),
        ),
        editorialBodySize: visibleEditorialBody
          ? Number.parseFloat(getComputedStyle(visibleEditorialBody).fontSize)
          : 0,
        editorialBodyWeight: visibleEditorialBody
          ? Number.parseInt(getComputedStyle(visibleEditorialBody).fontWeight, 10)
          : 0,
        fullyVisibleProducts,
        heroNoteSize: heroNote
          ? Number.parseFloat(getComputedStyle(heroNote).fontSize)
          : 0,
        heroNoteWeight: heroNote
          ? Number.parseInt(getComputedStyle(heroNote).fontWeight, 10)
          : 0,
        imageRatio: imageRect
          ? imageRect.width / imageRect.height
          : 0,
        imageHeight: imageRect?.height ?? 0,
        lookbookCompositionPosition: lookbookComposition
          ? getComputedStyle(lookbookComposition).position
          : "",
        lookbookDetailsDisplay: lookbookDetails
          ? getComputedStyle(lookbookDetails).display
          : "",
        lookbookHeight: rect(lookbook)?.height ?? 0,
        lookbookLeadRatio: leadRect
          ? leadRect.width / leadRect.height
          : 0,
        materialHeight: rect(material)?.height ?? 0,
        materialTitleSize: materialTitle
          ? Number.parseFloat(getComputedStyle(materialTitle).fontSize)
          : 0,
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
        sectionTitleSize: visibleSectionTitle
          ? Number.parseFloat(getComputedStyle(visibleSectionTitle).fontSize)
          : 0,
        sectionTitleWeight: visibleSectionTitle
          ? Number.parseInt(getComputedStyle(visibleSectionTitle).fontWeight, 10)
          : 0,
        selectedProductTitleSize: productTitle
          ? Number.parseFloat(getComputedStyle(productTitle).fontSize)
          : 0,
        selectedProductTitleWeight: productTitle
          ? Number.parseInt(getComputedStyle(productTitle).fontWeight, 10)
          : 0,
      };
    });

    expect(measurements.overflow).toBeLessThanOrEqual(1);
    expect(measurements.nextCardStartsInsideRail).toBe(true);
    expect(measurements.selectedTitleWeight).toBeGreaterThanOrEqual(520);
    expect(measurements.selectedTitleWeight).toBeLessThanOrEqual(560);
    expect(measurements.sectionTitleWeight).toBeGreaterThanOrEqual(520);
    expect(measurements.sectionTitleWeight).toBeLessThanOrEqual(560);
    expect(measurements.selectedProductTitleSize).toBeGreaterThanOrEqual(15);
    expect(measurements.selectedProductTitleSize).toBeLessThanOrEqual(17);
    expect(measurements.selectedProductTitleWeight).toBeGreaterThanOrEqual(500);

    if (viewport.width < 768) {
      expect(measurements.sectionTitleSize).toBeGreaterThanOrEqual(22);
      expect(measurements.lookbookCompositionPosition).toBe("static");
      expect(measurements.lookbookDetailsDisplay).toBe("none");
      expect(measurements.materialHeight).toBeGreaterThanOrEqual(
        viewport.height,
      );
      expect(measurements.materialTitleSize).toBeGreaterThanOrEqual(27);
      expect(measurements.lookbookHeight).toBeGreaterThanOrEqual(
        viewport.height * 0.85,
      );
      expect(measurements.lookbookHeight).toBeLessThanOrEqual(
        viewport.height * 1.02,
      );
      expect(measurements.lookbookLeadRatio).toBeGreaterThan(0.85);
      expect(measurements.lookbookLeadRatio).toBeLessThan(1.1);
    }
    if (viewport.width >= 1024) {
      expect(measurements.campaignHeight).toBeLessThan(
        measurements.cardHeight - 35,
      );
      expect(measurements.campaignHeight).toBeLessThanOrEqual(620);
      expect(measurements.desktopPromoSizes).toEqual(
        expect.arrayContaining([
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ]),
      );
      for (const size of measurements.desktopPromoSizes) {
        expect(size).toBeGreaterThanOrEqual(18);
        expect(size).toBeLessThanOrEqual(20);
      }
      for (const weight of measurements.desktopPromoWeights) {
        expect(weight).toBeGreaterThanOrEqual(520);
        expect(weight).toBeLessThanOrEqual(540);
      }
      expect(measurements.editorialBodySize).toBeGreaterThanOrEqual(12);
      expect(measurements.editorialBodySize).toBeLessThanOrEqual(14);
      expect(measurements.editorialBodyWeight).toBe(400);
      expect(measurements.heroNoteSize).toBeGreaterThanOrEqual(10);
      expect(measurements.heroNoteSize).toBeLessThanOrEqual(11);
      expect(measurements.heroNoteWeight).toBe(400);
      expect(measurements.imageRatio).toBeGreaterThan(0.68);
      expect(measurements.imageRatio).toBeLessThan(0.76);
    }
    if (viewport.width >= 1280) {
      expect(measurements.fullyVisibleProducts).toBe(3);
      expect(measurements.campaignShare).toBeGreaterThanOrEqual(0.23);
      expect(measurements.campaignShare).toBeLessThanOrEqual(0.24);
      expect(measurements.campaignRatio).toBeGreaterThan(0.79);
      expect(measurements.campaignRatio).toBeLessThan(0.81);
      expect(measurements.campaignTitleRightGap).toBeGreaterThanOrEqual(20);
      const heightRange =
        viewport.width === 1280
          ? [400, 430]
          : viewport.width === 1440
            ? [430, 460]
            : viewport.width === 1600
              ? [470, 500]
              : [500, 540];
      expect(measurements.imageHeight).toBeGreaterThanOrEqual(heightRange[0]);
      expect(measurements.imageHeight).toBeLessThanOrEqual(heightRange[1]);
    }
    if (viewport.width >= 1440) {
      expect(measurements.campaignTitleLines).toBe(1);
    }
  }

  expect(runtimeErrors).toEqual([]);
});

test("homepage tones descend quietly, joins its footer, and clears the header", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/#selected-pieces");
  await page.locator("#selected-pieces").waitFor();
  await page.waitForTimeout(250);

  const measurements = await page.evaluate(() => {
    const selectors = [
      ".home-promo-section",
      ".selected-garments-section",
      ".material-form-section",
      ".mobile-journal",
    ];
    const lightness = (value: string) => {
      const channels = value.match(/\d+/g)?.slice(0, 3).map(Number) ?? [];
      return channels.reduce((sum, channel) => sum + channel, 0);
    };
    const tones = selectors.map((selector) =>
      getComputedStyle(document.querySelector(selector)!).backgroundColor,
    );
    const selectedTop = document
      .querySelector("#selected-pieces")!
      .getBoundingClientRect().top;
    const finalSurface = getComputedStyle(
      document.querySelector(".mobile-journal")!,
    ).backgroundColor;
    const footerSurface = getComputedStyle(
      document.querySelector(".site-footer")!,
    ).backgroundColor;

    return {
      finalSurface,
      footerSurface,
      selectedTop,
      toneLightness: tones.map(lightness),
    };
  });

  expect(measurements.selectedTop).toBeGreaterThanOrEqual(80);
  expect(measurements.footerSurface).toBe(measurements.finalSurface);
  expect(measurements.toneLightness).toEqual(
    [...measurements.toneLightness].sort((a, b) => b - a),
  );

  await page.goto("/about");
  await expect(page.locator(".site-footer")).not.toHaveCSS(
    "background-color",
    measurements.finalSurface,
  );
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
