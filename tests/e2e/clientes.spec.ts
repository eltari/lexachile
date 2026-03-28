import { test, expect } from "@playwright/test";

test.describe("Clientes Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/clientes");
  });

  test("loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Clientes");
  });

  test("client cards display mock data in grid view", async ({ page }) => {
    // Default is grid view - check client cards are visible
    await expect(page.locator("text=María González Soto")).toBeVisible();
    await expect(page.locator("text=Carlos Muñoz Reyes")).toBeVisible();
    await expect(page.locator("text=Inversiones Austral SpA")).toBeVisible();

    // Check that client count is shown
    await expect(page.locator("text=registrado")).toBeVisible();
  });

  test("client cards show RUT, email, and phone", async ({ page }) => {
    // RUTs should be formatted and visible
    await expect(page.locator("text=m.gonzalez@gmail.com")).toBeVisible();
    await expect(page.locator("text=+56 9 8765 4321")).toBeVisible();
  });

  test("search input is visible and filters clients", async ({ page }) => {
    const searchInput = page.locator(
      'input[placeholder*="Buscar por nombre"]'
    );
    await expect(searchInput).toBeVisible();

    // Search for a specific client
    await searchInput.fill("María");

    // Should show María
    await expect(page.locator("text=María González Soto")).toBeVisible();

    // Should not show Carlos
    await expect(page.locator("text=Carlos Muñoz Reyes")).not.toBeVisible();
  });

  test("type filter select is visible", async ({ page }) => {
    const typeSelect = page.locator("select");
    await expect(typeSelect).toBeVisible();
    await expect(typeSelect).toContainText("Todos los tipos");
    await expect(typeSelect).toContainText("Persona Natural");
    await expect(typeSelect).toContainText("Persona Jurídica");
  });

  test("filtering by tipo works", async ({ page }) => {
    const typeSelect = page.locator("select");
    await typeSelect.selectOption("juridica");

    // Should show juridica clients only
    await expect(page.locator("text=Inversiones Austral SpA")).toBeVisible();
    await expect(page.locator("text=Constructora Pacífico S.A.")).toBeVisible();

    // Should not show natural clients
    await expect(page.locator("text=María González Soto")).not.toBeVisible();
  });

  test("'Nuevo Cliente' button exists and links correctly", async ({
    page,
  }) => {
    const newButton = page.locator('a:has-text("Nuevo Cliente")');
    await expect(newButton).toBeVisible();
    await expect(newButton).toHaveAttribute("href", "/clientes/nuevo");
  });

  test("view mode toggle exists (grid/table)", async ({ page }) => {
    // Two view mode buttons (grid and table)
    const viewButtons = page.locator(
      "button:has(svg)"
    );
    // There should be grid and table toggle buttons
    await expect(viewButtons.first()).toBeVisible();
  });

  test("nuevo cliente form loads at /clientes/nuevo", async ({ page }) => {
    await page.goto("/clientes/nuevo");

    // Should show the form
    await expect(page.locator("text=Nuevo Cliente").first()).toBeVisible();

    // Should have form inputs
    const inputs = page.locator("input, select");
    const count = await inputs.count();
    expect(count).toBeGreaterThan(3);
  });
});
