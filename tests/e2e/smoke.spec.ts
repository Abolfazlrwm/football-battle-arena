import { expect, test } from "@playwright/test";

/**
 * Smoke coverage for every route group — a handful of cheap checks that
 * catch a broken build, a missing dataset, or a crashed page boundary.
 * Deep interaction is deliberately left out; unit tests own the logic.
 */

test.describe("arena shell", () => {
  test("home renders the hero and the primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Football Battle Arena/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const primaryNav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Teams", "Leagues", "Battles", "Rankings", "Captains"]) {
      await expect(primaryNav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });
});

test.describe("directories", () => {
  test("teams lists the clubs and a club page renders", async ({ page }) => {
    await page.goto("/teams");
    await expect(page).toHaveTitle(/Teams/);
    await expect(page.getByText("Real Madrid").first()).toBeVisible();

    await page.goto("/teams/real-madrid");
    await expect(page).toHaveTitle(/Real Madrid/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Real Madrid/i);
    await expect(page.getByText("Santiago Bernabéu").first()).toBeVisible();
  });

  test("captains directory shows the captains and a captain page resolves", async ({ page }) => {
    await page.goto("/captains");
    await expect(page).toHaveTitle(/Captains/);
    await expect(page.getByText("Federico Valverde").first()).toBeVisible();

    await page.goto("/captains/federico-valverde");
    await expect(page).toHaveTitle(/Valverde/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Valverde/i);
  });

  test("leagues directory lists the six leagues", async ({ page }) => {
    await page.goto("/leagues");
    await expect(page).toHaveTitle(/Leagues/);
    await expect(page.getByText("La Liga").first()).toBeVisible();
    await expect(page.getByText("Premier League").first()).toBeVisible();
  });
});

test.describe("comparison surfaces", () => {
  test("battles page renders the featured matchups", async ({ page }) => {
    await page.goto("/battles");
    await expect(page).toHaveTitle(/Battles/);
    await expect(page.getByText("El Clásico").first()).toBeVisible();
    await expect(page.getByText("Der Klassiker").first()).toBeVisible();
  });

  test("rankings page shows the full 24-club table", async ({ page }) => {
    await page.goto("/rankings");
    await expect(page).toHaveTitle(/Rankings/);
    await expect(page.getByText("Real Madrid").first()).toBeVisible();
    await expect(page.getByText("Athletic Club").first()).toBeVisible();
  });

  test("the Arena Cup builds a bracket", async ({ page }) => {
    await page.goto("/tournament");
    await expect(page).toHaveTitle(/Arena Cup/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("error boundary", () => {
  test("unknown routes land on the themed 404", async ({ page }) => {
    await page.goto("/definitely-not-a-route");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Off the Pitch");
  });
});
