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
    "Account",
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

test("account navigation resolves once and reflects guest and profile states", async ({
  page,
}) => {
  let authenticated = true;
  let requestCount = 0;
  let releaseFirstRequest: () => void = () => {};
  const firstRequestGate = new Promise<void>((resolve) => {
    releaseFirstRequest = resolve;
  });

  await page.route("**/api/account/me", async (route) => {
    requestCount += 1;
    if (requestCount === 1) await firstRequestGate;
    await route.fulfill({
      body: JSON.stringify({ authenticated, ok: true, profile: {} }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.setViewportSize({ height: 900, width: 1440 });
  await page.goto("/");
  const pendingAccount = page.locator(".account-header-link");
  await expect(pendingAccount).toBeHidden();
  await expect(pendingAccount).toHaveAttribute("aria-hidden", "true");

  releaseFirstRequest();
  const profile = page.getByLabel("Open profile");
  await expect(profile).toBeVisible();
  await expect(profile).toHaveText("Profile");
  await expect(profile).toHaveAttribute("href", "/account");
  expect(requestCount).toBe(1);

  await page.setViewportSize({ height: 844, width: 390 });
  await page.getByRole("button", { name: "Menu" }).click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  await expect(menu.getByLabel("Open profile")).toHaveText("Profile");
  await expect(menu.getByLabel("Open profile")).toHaveAttribute(
    "href",
    "/account",
  );
  expect(requestCount).toBe(1);

  authenticated = false;
  await page.reload();
  const account = page.getByLabel("Sign in to account");
  await expect(account).toBeVisible();
  await expect(account).toHaveText("Account");
  await expect(account).toHaveAttribute("href", "/account/login");
  expect(requestCount).toBe(2);
});

test("mobile home keeps the first screen exact and removes the large footer", async ({
  page,
}) => {
  test.setTimeout(60_000);

  for (const viewport of [
    { height: 667, width: 375 },
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
      const compactFooter =
        document.querySelector<HTMLElement>(".mobile-compact-footer");
      const actions =
        document.querySelector<HTMLElement>(".mobile-hero-actions");
      const brandCopy = actions?.querySelector<HTMLElement>("p");
      const cta = actions?.querySelector<HTMLElement>(".mobile-hero-cta");
      const primaryCta = cta?.querySelector<HTMLElement>(
        ".mobile-hero-cta-primary",
      );
      const secondaryCta = cta?.querySelector<HTMLElement>(
        ".mobile-hero-cta-secondary",
      );
      const image =
        document.querySelector<HTMLElement>(".mobile-home-hero > div:nth-child(2)");
      const season =
        document.querySelector<HTMLElement>(".mobile-hero-season");
      const title =
        document.querySelector<HTMLElement>(".hero-printed-title");

      return {
        actionsBottom: actions?.getBoundingClientRect().bottom,
        actionsTop: actions?.getBoundingClientRect().top,
        brandRight: brandCopy?.getBoundingClientRect().right,
        compactFooterDisplay: compactFooter
          ? getComputedStyle(compactFooter).display
          : null,
        ctaLeft: cta?.getBoundingClientRect().left,
        ctaRight: cta?.getBoundingClientRect().right,
        ctaWidth: cta?.getBoundingClientRect().width,
        documentWidth: document.documentElement.scrollWidth,
        editorialTop: editorial?.getBoundingClientRect().top,
        footerDisplay: footer ? getComputedStyle(footer).display : null,
        heroHeight: hero?.getBoundingClientRect().height,
        imageLeft: image?.getBoundingClientRect().left,
        primaryCtaFontSize: primaryCta
          ? Number.parseFloat(getComputedStyle(primaryCta).fontSize)
          : 0,
        primaryCtaClientWidth: primaryCta?.clientWidth,
        primaryCtaRight: primaryCta?.getBoundingClientRect().right,
        primaryCtaScrollWidth: primaryCta?.scrollWidth,
        primaryCtaWidth: primaryCta?.getBoundingClientRect().width,
        secondaryCtaFontSize: secondaryCta
          ? Number.parseFloat(getComputedStyle(secondaryCta).fontSize)
          : 0,
        secondaryCtaGap:
          primaryCta && secondaryCta
            ? secondaryCta.getBoundingClientRect().top -
              primaryCta.getBoundingClientRect().bottom
            : 0,
        seasonRight: season?.getBoundingClientRect().right,
        springHeight: spring?.getBoundingClientRect().height,
        titleBottom: title?.getBoundingClientRect().bottom,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });

    expect(metrics.heroHeight).toBe(metrics.viewportHeight);
    expect(metrics.editorialTop).toBeGreaterThanOrEqual(metrics.viewportHeight);
    expect(metrics.springHeight).toBeGreaterThanOrEqual(135);
    expect(metrics.springHeight).toBeLessThanOrEqual(145);
    expect(metrics.documentWidth).toBe(metrics.viewportWidth);
    expect(metrics.brandRight).toBeLessThanOrEqual(metrics.imageLeft ?? 0);
    expect((metrics.ctaLeft ?? 0) - (metrics.imageLeft ?? 0)).toBeGreaterThanOrEqual(19);
    expect((metrics.ctaLeft ?? 0) - (metrics.brandRight ?? 0)).toBeGreaterThanOrEqual(19);
    expect(metrics.ctaRight).toBeLessThanOrEqual(metrics.viewportWidth - 16);
    expect(metrics.primaryCtaFontSize).toBeGreaterThanOrEqual(15);
    expect(metrics.primaryCtaFontSize).toBeLessThanOrEqual(17);
    expect(metrics.primaryCtaWidth).toBe(metrics.ctaWidth);
    expect(metrics.primaryCtaRight).toBe(metrics.ctaRight);
    expect(metrics.primaryCtaScrollWidth).toBeLessThanOrEqual(
      metrics.primaryCtaClientWidth ?? 0,
    );
    expect(metrics.secondaryCtaFontSize).toBeLessThanOrEqual(11);
    expect(metrics.secondaryCtaGap).toBeGreaterThanOrEqual(15);
    expect(metrics.seasonRight).toBeLessThan(metrics.imageLeft ?? 0);
    expect(metrics.actionsBottom).toBeLessThanOrEqual(metrics.viewportHeight - 55);
    expect(metrics.actionsTop).toBeGreaterThan(metrics.titleBottom ?? 0);
    expect(metrics.footerDisplay).toBe("none");
    expect(metrics.compactFooterDisplay).not.toBe("none");
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
