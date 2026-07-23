import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { height: 667, width: 375 },
  { height: 844, width: 390 },
  { height: 844, width: 430 },
  { height: 1024, width: 768 },
  { height: 900, width: 1440 },
] as const;

const routes = [
  { heading: /LOW\s*SIGNAL/i, path: "/" },
  { heading: /MATERIAL\s*FIRST\.\s*WORN\s*OFTEN\./i, path: "/about" },
  { heading: /SPRING\s*2026/i, path: "/collections" },
  { heading: /FIELD\s*JACKET/i, path: "/products/field-jacket" },
] as const;

test.describe.configure({ timeout: 90_000 });

for (const viewport of viewports) {
  test(`pre-release pages remain composed at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    const runtimeErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.setViewportSize(viewport);

    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        route.heading,
      );
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${route.path} horizontal overflow`).toBeLessThanOrEqual(
        1,
      );
      await expect(page.locator("footer:visible")).toBeVisible();
    }

    await page.goto("/");
    const selected = page.locator("#selected-pieces");
    await selected.scrollIntoViewIfNeeded();
    await expect(
      selected.getByRole("link", { name: "Men", exact: true }),
    ).toHaveAttribute("href", "/collections/men");
    await expect(
      selected.getByRole("link", { name: "Women", exact: true }),
    ).toHaveAttribute("href", "/collections/women");
    await expect(selected.locator("article h3").nth(6)).toHaveText(
      "Field Jacket",
    );
    await expect(selected.locator("article h3").nth(11)).toHaveText(
      "Double Pleat Trouser",
    );
    await selected.screenshot({
      path: testInfo.outputPath(`selected-${viewport.width}.png`),
    });

    await page.goto("/about");
    await page.screenshot({
      fullPage: true,
      path: testInfo.outputPath(`about-${viewport.width}.png`),
    });

    if (viewport.width < 1024) {
      const footer = page.getByRole("navigation", {
        name: "Essential footer navigation",
      });
      await expect(footer.getByText("Shipping & returns")).toBeVisible();
      await expect(footer.locator("a")).toHaveCount(4);
    }

    expect(runtimeErrors).toEqual([]);
  });
}

test("public metadata and critical accessibility checks are release-ready", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });

  for (const route of ["/", "/about", "/collections", "/lookbook"]) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://low-signal-nine.vercel.app${route === "/" ? "" : route}`,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /og-preview\.jpg$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  }

  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .exclude(".mobile-site-header")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const seriousViolations = results.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  );
  expect(seriousViolations).toEqual([]);
});

test("About uses five readable editorial chapters with a valid heading hierarchy", async ({
  page,
}) => {
  for (const viewport of [
    { height: 667, width: 375 },
    { height: 900, width: 1440 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /MATERIAL\s*FIRST\.\s*WORN\s*OFTEN\./i,
    );
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(5);
    await expect(page.getByRole("heading", { level: 3 })).toHaveCount(7);

    const typography = await page.evaluate(() => {
      const sectionHeading = document.querySelector<HTMLElement>(
        ".editorial-section-title",
      );
      const body = document.querySelector<HTMLElement>(".editorial-body");
      return {
        body: body ? Number.parseFloat(getComputedStyle(body).fontSize) : 0,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        sectionHeading: sectionHeading
          ? Number.parseFloat(getComputedStyle(sectionHeading).fontSize)
          : 0,
      };
    });
    expect(typography.body).toBeGreaterThanOrEqual(15);
    expect(typography.sectionHeading).toBeGreaterThanOrEqual(28);
    expect(typography.overflow).toBeLessThanOrEqual(1);
  }

  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/about");
  const results = await new AxeBuilder({ page })
    .exclude(".mobile-site-header")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const seriousViolations = results.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  );
  expect(seriousViolations).toEqual([]);
});
