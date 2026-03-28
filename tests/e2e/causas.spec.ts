import { test, expect } from "@playwright/test";

test.describe("Causas Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/causas");
  });

  test("loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Gestión de Causas");
  });

  test("causas table has mock data", async ({ page }) => {
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Check table headers
    await expect(table).toContainText("ROL");
    await expect(table).toContainText("Caratulado");
    await expect(table).toContainText("Estado");

    // Check mock data is displayed
    await expect(table).toContainText("C-1234-2024");
    await expect(table).toContainText("González con Pérez");
    await expect(table).toContainText("Muñoz con Banco Estado");
  });

  test("filter controls are visible", async ({ page }) => {
    // Search input
    const searchInput = page.locator(
      'input[placeholder*="Buscar por ROL"]'
    );
    await expect(searchInput).toBeVisible();

    // Filter button
    const filterBtn = page.locator("button:has-text('Filtros')");
    await expect(filterBtn).toBeVisible();
  });

  test("filter panel opens and shows selects", async ({ page }) => {
    // Click the Filtros button
    await page.locator("button:has-text('Filtros')").click();

    // Verify filter selects appear
    const selects = page.locator("select");
    // 3 selects: materia, estado, tribunal
    await expect(selects).toHaveCount(3);

    // Check materia options
    await expect(selects.nth(0)).toContainText("Todas las materias");
    await expect(selects.nth(0)).toContainText("Civil");
    await expect(selects.nth(0)).toContainText("Penal");
    await expect(selects.nth(0)).toContainText("Laboral");

    // Check estado options
    await expect(selects.nth(1)).toContainText("Todos los estados");
    await expect(selects.nth(1)).toContainText("Ingresada");
    await expect(selects.nth(1)).toContainText("En Tramitación");
  });

  test("search filters results correctly", async ({ page }) => {
    const searchInput = page.locator(
      'input[placeholder*="Buscar por ROL"]'
    );
    await searchInput.fill("González");

    // Should show only the matching causa
    const table = page.locator("table");
    await expect(table).toContainText("González con Pérez");

    // Other causas should not be visible
    await expect(table).not.toContainText("Muñoz con Banco Estado");
  });

  test("'Nueva Causa' button exists and links correctly", async ({ page }) => {
    const newButton = page.locator('a:has-text("Nueva Causa")');
    await expect(newButton).toBeVisible();
    await expect(newButton).toHaveAttribute("href", "/causas/nueva");
  });

  test("nueva causa form loads at /causas/nueva", async ({ page }) => {
    await page.goto("/causas/nueva");

    // Check the form heading or form elements
    await expect(page.locator("text=Nueva Causa").first()).toBeVisible();

    // Check form fields exist
    const inputs = page.locator("input, select, textarea");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(3);
  });

  test("displays causa count", async ({ page }) => {
    // Shows "X causas encontradas"
    await expect(page.locator("text=encontrada")).toBeVisible();
  });

  test("pagination is visible when needed", async ({ page }) => {
    // With 8 mock items and 5 per page, pagination should appear
    await expect(page.locator("text=Mostrando")).toBeVisible();
  });
});
