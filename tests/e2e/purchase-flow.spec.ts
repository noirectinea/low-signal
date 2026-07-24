import { expect, test } from "@playwright/test";

test.use({ viewport: { height: 844, width: 390 } });

test("product, cart persistence, quantity, and guest checkout", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.goto("/products/field-jacket");

  await expect(page.getByText(/01 \/ 03/).last()).toBeVisible();
  await page.getByRole("button", { name: /^Select a size/i }).click();
  await expect(page.getByText("Choose a size before adding this piece.")).toBeVisible();
  const mediumSize = page
    .locator("button[aria-pressed]")
    .filter({ hasText: /^M$/ })
    .last();
  await mediumSize.click();
  await expect(mediumSize).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Selected: M")).toBeVisible();
  await page.getByRole("button", { name: /^Add to cart/i }).click();
  await expect(page.getByLabel("Cart, 1 items").first()).toBeVisible();
  const stepper = page.getByLabel("Field Jacket quantity");
  await expect(stepper).toBeVisible();
  await expect(stepper.getByText("In cart", { exact: true })).toBeVisible();
  await expect(
    page.locator(".related-product-card").filter({ visible: true }),
  ).toHaveCount(2);
  await stepper.getByRole("button", { name: "Add one Field Jacket" }).click();
  await expect(stepper.getByText("2", { exact: true })).toBeVisible();

  await page.getByLabel("Cart, 2 items").first().click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Add one Field Jacket" }).click();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("3", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: /Proceed to checkout/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/continue as guest/)).toBeVisible();
  const orderSummary = page.locator(".checkout-order-summary-mobile");
  await expect(orderSummary).toBeVisible();
  await expect(orderSummary.locator("summary")).toHaveCount(0);
  await expect(orderSummary.locator("img")).toHaveCount(1);
  await expect(page.getByText("Field Jacket", { exact: true }).first()).toBeVisible();
  const email = page.getByRole("textbox", { name: "Email *" });
  await expect(email).toHaveAttribute("autocomplete", "email");
  await expect(
    page.getByRole("textbox", { name: "Phone" }),
  ).toHaveAttribute("autocomplete", "tel");
  await expect(
    page.getByRole("textbox", { name: "First name *" }),
  ).toHaveAttribute("autocomplete", "given-name");
  await expect(
    page.getByRole("textbox", { name: "Address line 1 *" }),
  ).toHaveAttribute("autocomplete", "street-address");

  const checkoutGeometry = await page.evaluate(() => {
    const fields = Array.from(
      document.querySelectorAll<HTMLElement>(".checkout-field"),
    );
    const steps = Array.from(
      document.querySelectorAll<HTMLElement>(".checkout-form-step"),
    );
    const rect = (element: HTMLElement) => element.getBoundingClientRect();

    return {
      fieldHeights: fields.map((field) => rect(field).height),
      formWidth:
        document.querySelector<HTMLElement>(".checkout-form")
          ?.getBoundingClientRect().width ?? 0,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      stepGaps: steps.slice(1).map((step, index) => {
        const previous = rect(steps[index]);
        return rect(step).top - previous.bottom;
      }),
    };
  });

  expect(checkoutGeometry.overflow).toBeLessThanOrEqual(1);
  expect(checkoutGeometry.formWidth).toBeLessThanOrEqual(350);
  for (const height of checkoutGeometry.fieldHeights) {
    expect(height).toBeGreaterThanOrEqual(56);
    expect(height).toBeLessThanOrEqual(76);
  }
  for (const gap of checkoutGeometry.stepGaps) {
    expect(gap).toBeGreaterThanOrEqual(15);
    expect(gap).toBeLessThanOrEqual(20);
  }

  await email.fill("guest@example.com");
  await page.reload();
  await expect(email).toHaveValue("guest@example.com");
  expect(pageErrors).toEqual([]);
});

test("desktop checkout gives the permanent order summary a full product rail", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 });
  await page.addInitScript(() => {
    localStorage.setItem(
      "low-signal-cart",
      JSON.stringify([
        {
          category: "Outerwear",
          color: "Washed Black",
          description: "Field Jacket",
          gender: "men",
          id: "field-jacket-m",
          image: "/images/low-signal/products/product-01.jpg",
          materials: "Cotton",
          name: "Field Jacket",
          price: 180,
          productId: "field-jacket",
          quantity: 1,
          size: "M",
          slug: "field-jacket",
        },
        {
          category: "Knitwear",
          color: "Black",
          description: "Rib Cardigan",
          gender: "women",
          id: "rib-cardigan-l",
          image: "/images/low-signal/products/product-07.jpg",
          materials: "Cotton wool",
          name: "Rib Cardigan",
          price: 165,
          productId: "rib-cardigan",
          quantity: 1,
          size: "L",
          slug: "rib-cardigan",
        },
      ]),
    );
  });

  await page.goto("/checkout");
  const summary = page.locator(".checkout-order-summary-desktop");
  await expect(summary).toBeVisible();
  await expect(summary.locator("summary")).toHaveCount(0);
  await expect(summary.locator("img")).toHaveCount(2);

  const geometry = await summary.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const form = document
      .querySelector(".checkout-form")
      ?.getBoundingClientRect();
    const image = element.querySelector("img")?.getBoundingClientRect();

    return {
      alignmentDelta: Math.abs(rect.top - (form?.top ?? 0)),
      imageWidth: image?.width ?? 0,
      position: getComputedStyle(element).position,
      rightGap: document.documentElement.clientWidth - rect.right,
      summaryWidth: rect.width,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    };
  });

  expect(geometry.summaryWidth).toBeGreaterThanOrEqual(598);
  expect(geometry.summaryWidth).toBeLessThanOrEqual(602);
  expect(geometry.alignmentDelta).toBeLessThanOrEqual(2);
  expect(geometry.imageWidth).toBeGreaterThanOrEqual(80);
  expect(geometry.position).toBe("static");
  expect(geometry.rightGap).toBeLessThanOrEqual(26);
  expect(geometry.overflow).toBeLessThanOrEqual(1);
});
