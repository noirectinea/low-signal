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
      const section = document.querySelector<HTMLElement>("#selected-pieces");
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
      const intersectingProducts = Array.from(cards ?? []).filter((element) => {
        const itemRect = rect(element);
        return (
          itemRect &&
          railRect &&
          itemRect.right > railRect.left + 1 &&
          itemRect.left < railRect.right - 1
        );
      });
      const fullyVisibleProductCards = intersectingProducts.filter(
        (element) => {
          const itemRect = rect(element);
          return (
            itemRect &&
            railRect &&
            itemRect.left >= railRect.left - 1 &&
            itemRect.right <= railRect.right + 1
          );
        },
      );
      const fullyVisibleProducts = fullyVisibleProductCards.length;
      const partiallyVisibleProducts =
        intersectingProducts.length - fullyVisibleProducts;
      const visibleProductImages = fullyVisibleProductCards.map((element) =>
        element.querySelector<HTMLElement>(":scope > div"),
      );
      const visibleProductInfo = fullyVisibleProductCards.map((element) =>
        element.querySelector<HTMLElement>(".mobile-selected-product-info"),
      );
      const visibleProductCtas = fullyVisibleProductCards.map((element) =>
        element.querySelector<HTMLElement>(".selected-product-cta"),
      );
      const footer = document.querySelector<HTMLElement>(
        ".selected-rail-footer",
      );
      const materialSection = document.querySelector<HTMLElement>(
        ".material-form-section",
      );
      const header = document.querySelector<HTMLElement>(
        ".selected-garments-header",
      );

      return {
        campaignRatio: campaignRect
          ? campaignRect.width / campaignRect.height
          : 0,
        campaignShare: campaignRect && selectedLayoutRect
          ? campaignRect.width / selectedLayoutRect.width
          : 0,
        campaignToCardWidth:
          campaignRect && cardRect ? campaignRect.width / cardRect.width : 0,
        campaignTop: campaignRect?.top ?? 0,
        campaignBottom: campaignRect?.bottom ?? 0,
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
        cardWidth: cardRect?.width ?? 0,
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
        partiallyVisibleProducts,
        productCtaBottoms: visibleProductCtas.map(
          (element) => rect(element)?.bottom ?? 0,
        ),
        productImageBottoms: visibleProductImages.map(
          (element) => rect(element)?.bottom ?? 0,
        ),
        productImageHeights: visibleProductImages.map(
          (element) => rect(element)?.height ?? 0,
        ),
        productImageTops: visibleProductImages.map(
          (element) => rect(element)?.top ?? 0,
        ),
        productInfoHeights: visibleProductInfo.map(
          (element) => rect(element)?.height ?? 0,
        ),
        railFooterGap:
          (rect(footer)?.top ?? 0) - (rect(rail)?.bottom ?? 0),
        footerHeight: rect(footer)?.height ?? 0,
        sectionBottomPadding:
          (rect(section)?.bottom ?? 0) - (rect(footer)?.bottom ?? 0),
        materialGap:
          (rect(materialSection)?.top ?? 0) - (rect(section)?.bottom ?? 0),
        headerToMediaGap:
          (rect(selectedLayout)?.top ?? 0) - (rect(header)?.bottom ?? 0),
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
    expect(measurements.selectedProductTitleWeight).toBeGreaterThanOrEqual(500);

    if (viewport.width < 768) {
      expect(measurements.selectedProductTitleSize).toBeGreaterThanOrEqual(15);
      expect(measurements.selectedProductTitleSize).toBeLessThanOrEqual(17);
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
      if (viewport.width < 1280) {
        expect(measurements.campaignHeight).toBeLessThan(
          measurements.cardHeight - 35,
        );
        expect(measurements.campaignHeight).toBeLessThanOrEqual(620);
      }
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
    }
    if (viewport.width >= 1280) {
      const expectedImageHeight = Math.min(
        620,
        Math.max(480, viewport.width * 0.31),
      );
      const imageEdges = measurements.productImageTops.map((top, index) => ({
        bottom: measurements.productImageBottoms[index],
        top,
      }));

      expect(measurements.selectedProductTitleSize).toBeGreaterThanOrEqual(17);
      expect(measurements.selectedProductTitleSize).toBeLessThanOrEqual(19);
      expect(measurements.fullyVisibleProducts).toBe(3);
      expect(measurements.partiallyVisibleProducts).toBe(0);
      expect(measurements.campaignHeight).toBeCloseTo(
        expectedImageHeight + 113,
        0,
      );
      expect(measurements.cardWidth).toBeGreaterThan(0);
      expect(measurements.campaignHeight).toBeCloseTo(
        measurements.cardHeight,
        0,
      );
      expect(measurements.campaignTitleRightGap).toBeGreaterThanOrEqual(24);
      expect(measurements.campaignTitleLines).toBe(1);
      expect(measurements.headerToMediaGap).toBeGreaterThanOrEqual(28);
      expect(measurements.headerToMediaGap).toBeLessThanOrEqual(32);
      expect(measurements.railFooterGap).toBeGreaterThanOrEqual(18);
      expect(measurements.railFooterGap).toBeLessThanOrEqual(24);
      expect(measurements.footerHeight).toBeGreaterThanOrEqual(42);
      expect(measurements.footerHeight).toBeLessThanOrEqual(48);
      expect(measurements.sectionBottomPadding).toBeGreaterThanOrEqual(30);
      expect(measurements.sectionBottomPadding).toBeLessThanOrEqual(40);
      expect(measurements.materialGap).toBe(0);
      expect(measurements.campaignToCardWidth).toBeGreaterThanOrEqual(0.93);
      expect(measurements.campaignToCardWidth).toBeLessThanOrEqual(0.99);
      expect(measurements.productImageHeights).toHaveLength(3);
      for (const height of measurements.productImageHeights) {
        expect(height).toBeCloseTo(expectedImageHeight, 0);
      }
      for (const infoHeight of measurements.productInfoHeights) {
        expect(infoHeight).toBeGreaterThanOrEqual(108);
        expect(infoHeight).toBeLessThanOrEqual(118);
      }
      expect(Math.max(...measurements.productCtaBottoms)).toBeCloseTo(
        Math.min(...measurements.productCtaBottoms),
        0,
      );
      expect(Math.max(...imageEdges.map((edge) => edge.top))).toBeCloseTo(
        Math.min(...imageEdges.map((edge) => edge.top)),
        0,
      );
      expect(measurements.campaignTop).toBeCloseTo(
        Math.min(...imageEdges.map((edge) => edge.top)),
        0,
      );
      expect(Math.max(...imageEdges.map((edge) => edge.bottom))).toBeCloseTo(
        Math.min(...imageEdges.map((edge) => edge.bottom)),
        0,
      );
    } else if (viewport.width >= 768) {
      expect(measurements.selectedProductTitleSize).toBeGreaterThanOrEqual(15);
      expect(measurements.selectedProductTitleSize).toBeLessThanOrEqual(17);
    } else {
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
