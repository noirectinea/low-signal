import { expect, test } from "@playwright/test";

test("service routes and journal preserve their legacy entry points", async ({
  page,
}) => {
  const redirects = [
    ["/shipping", "/info#shipping"],
    ["/returns", "/info#returns"],
    ["/contact", "/info#contact"],
    ["/privacy", "/info#privacy"],
    ["/terms", "/info#terms"],
    ["/cookies", "/info#cookies"],
    ["/journal", "/lookbook"],
  ];

  for (const [source, destination] of redirects) {
    await page.goto(source);
    await expect(page).toHaveURL(new RegExp(`${destination.replace("/", "\\/")}$`));
  }
});

test("information and home campaign links expose the consolidated structure", async ({
  page,
}) => {
  await page.goto("/info");
  await expect(page.getByRole("heading", { name: "Service & Information" })).toBeVisible();
  await expect(page.locator(".info-section")).toHaveCount(6);

  await page.goto("/");
  const continuation = page.locator("#lookbook-continuation");
  await expect(
    continuation.getByRole("heading", { name: "Lookbook", exact: true }),
  ).toBeVisible();
  await expect(continuation.getByText("06", { exact: true })).toBeVisible();
  await expect(continuation.locator("a[href='/lookbook']")).not.toHaveCount(0);
  await expect(page.locator("a[href='/journal']")).toHaveCount(0);
});

test("search reports results and supports empty and clear states", async ({
  page,
}) => {
  await page.goto("/search");
  const search = page.getByRole("searchbox");

  await expect(page.getByText("16 / All garments", { exact: true })).toBeVisible();
  await search.fill("not-a-low-signal-garment");
  await expect(page.getByText("No garments found", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByText("16 / All garments", { exact: true })).toBeVisible();
});
