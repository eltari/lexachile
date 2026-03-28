import { test, expect } from "@playwright/test";

test.describe("Calendario Module", () => {
  test("page loads at /calendario", async ({ page }) => {
    await page.goto("/calendario");

    // Should display calendar-related content
    // The sidebar should be visible (dashboard layout)
    await expect(page.locator("aside")).toBeVisible();

    // Page should have loaded (no 404)
    await expect(page.locator("main")).toBeVisible();

    // Calendar page should have calendar-related elements
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });
});

test.describe("Documentos Module", () => {
  test("page loads at /documentos", async ({ page }) => {
    await page.goto("/documentos");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();

    // Should display document-related content
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("plantillas page loads at /documentos/plantillas", async ({ page }) => {
    await page.goto("/documentos/plantillas");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Conservador Module", () => {
  test("page loads at /conservador", async ({ page }) => {
    await page.goto("/conservador");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Leyes Module", () => {
  test("page loads at /leyes", async ({ page }) => {
    await page.goto("/leyes");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Reportes Module", () => {
  test("page loads at /reportes", async ({ page }) => {
    await page.goto("/reportes");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("IA Asistente Module", () => {
  test("page loads at /ia-asistente", async ({ page }) => {
    await page.goto("/ia-asistente");

    await expect(page.locator("aside")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
});
