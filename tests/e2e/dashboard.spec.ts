import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("loads with welcome message", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toContainText("Bienvenido");
  });

  test("sidebar is visible with all navigation links", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();

    // Check sidebar branding
    await expect(sidebar).toContainText("LexaChile");

    // Verify all nav links are present
    const navLinks = [
      "Dashboard",
      "Causas",
      "Clientes",
      "Calendario",
      "Documentos",
      "Conservador CBR",
      "Leyes",
      "IA Asistente",
      "Reportes",
    ];

    for (const label of navLinks) {
      const link = sidebar.locator(`text=${label}`);
      await expect(link).toBeVisible();
    }
  });

  test("stat cards are visible with correct data", async ({ page }) => {
    // There are 4 stat cards
    await expect(page.locator("text=Causas Activas")).toBeVisible();
    await expect(page.locator("text=Clientes")).toBeVisible();
    await expect(page.locator("text=Audiencias Pendientes")).toBeVisible();
    await expect(page.locator("text=Documentos")).toBeVisible();

    // Check stat values
    await expect(page.locator("text=24")).toBeVisible();
    await expect(page.locator("text=156")).toBeVisible();
    await expect(page.locator("text=342")).toBeVisible();
  });

  test("recent causas table is visible with data", async ({ page }) => {
    await expect(page.locator("text=Causas Recientes")).toBeVisible();

    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Check table headers
    await expect(table).toContainText("ROL");
    await expect(table).toContainText("Caratulado");
    await expect(table).toContainText("Estado");

    // Check some mock data rows
    await expect(table).toContainText("C-1234-2026");
    await expect(table).toContainText("González con Muñoz");
    await expect(table).toContainText("Pérez con Inversiones SpA");
  });

  test("upcoming events section is visible", async ({ page }) => {
    await expect(page.locator("text=Próximas Audiencias")).toBeVisible();
    await expect(page.locator("text=Audiencia Preparatoria")).toBeVisible();
    await expect(page.locator("text=Audiencia de Juicio")).toBeVisible();
    await expect(page.locator("text=Mediación Familiar")).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    // Click on Causas link in sidebar
    const sidebar = page.locator("aside");
    await sidebar.locator('a[href="/causas"]').click();
    await expect(page).toHaveURL(/\/causas/);

    // Navigate back to dashboard
    await sidebar.locator('a[href="/dashboard"]').click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
