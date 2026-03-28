import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/LexaChile/);
  });

  test("hero section displays LexaChile branding", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();

    // The hero contains the main heading
    const heading = page.locator("h1");
    await expect(heading.first()).toContainText("Plataforma Jurídica");
    await expect(heading.first()).toContainText("Más Completa");
  });

  test("features section is visible with all 8 features", async ({ page }) => {
    const featuresSection = page.locator("#caracteristicas");
    await expect(featuresSection).toBeVisible();

    // Section heading
    await expect(featuresSection.locator("h2")).toContainText(
      "Todo lo que necesitas"
    );

    // All 8 feature cards
    const featureCards = featuresSection.locator(
      ".grid > div"
    );
    await expect(featureCards).toHaveCount(8);

    // Verify some feature titles
    await expect(featuresSection).toContainText("Gestión de Causas");
    await expect(featuresSection).toContainText("CRM de Clientes");
    await expect(featuresSection).toContainText("Calendario Jurídico");
    await expect(featuresSection).toContainText("IA Legal Avanzada");
  });

  test("comparison table is visible with correct columns", async ({ page }) => {
    const comparisonSection = page.locator("#comparacion");
    await expect(comparisonSection).toBeVisible();

    const table = comparisonSection.locator("table");
    await expect(table).toBeVisible();

    // Check column headers
    await expect(table).toContainText("LexaChile");
    await expect(table).toContainText("JusticeNow");
    await expect(table).toContainText("Lemontech");

    // Check some row features
    await expect(table).toContainText("IA Legal Integrada");
    await expect(table).toContainText("Consulta PJUD");
    await expect(table).toContainText("Conservador CBR");
  });

  test("'Comenzar Gratis' button links to /register", async ({ page }) => {
    const ctaButton = page.locator('a:has-text("Comenzar Gratis")').first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute("href", "/register");
  });

  test("navigation links are present and work", async ({ page }) => {
    const nav = page.locator("nav");

    // Desktop nav links
    const caracteristicasLink = nav.locator('a[href="#caracteristicas"]');
    await expect(caracteristicasLink).toBeVisible();

    const preciosLink = nav.locator('a[href="#comparacion"]');
    await expect(preciosLink).toBeVisible();

    const contactoLink = nav.locator('a[href="#contacto"]');
    await expect(contactoLink).toBeVisible();

    // Auth links in navbar
    const loginLink = nav.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toContainText("Iniciar Sesión");

    const registerLink = nav.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText("Comenzar Gratis");
  });

  test("footer is visible with branding", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("LexaChile");
    await expect(footer).toContainText("Todos los derechos reservados");
  });
});
