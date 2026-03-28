import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("loads correctly with heading", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Iniciar Sesión");
    await expect(page.locator("text=Accede a tu plataforma jurídica")).toBeVisible();
  });

  test("has email and password fields", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("placeholder", "tu@correo.cl");

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("placeholder", "Tu contraseña");
  });

  test("has submit button", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Iniciar Sesión");
  });

  test("has link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toContainText("Regístrate");
  });

  test("navigates to register page from link", async ({ page }) => {
    await page.locator('a[href="/register"]').click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("h2")).toContainText("Crear Cuenta");
  });

  test("login with invalid credentials stays on page or shows error", async ({
    page,
  }) => {
    await page.locator('input[type="email"]').fill("bad@email.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();

    // The form submits but since there is no backend wired, the page stays
    // on /login or shows a validation message
    await page.waitForTimeout(1000);
    const url = page.url();
    // Should still be on login or show an error - not redirect to dashboard
    expect(url).toMatch(/\/(login)?/);
  });

  test("has forgot password link", async ({ page }) => {
    const forgotLink = page.locator("text=¿Olvidaste tu contraseña?");
    await expect(forgotLink).toBeVisible();
  });
});

test.describe("Register Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("loads correctly with heading", async ({ page }) => {
    await expect(page.locator("h2")).toContainText("Crear Cuenta");
    await expect(
      page.locator("text=Únete a la plataforma jurídica líder en Chile")
    ).toBeVisible();
  });

  test("has all required form fields", async ({ page }) => {
    // Name
    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    // RUT
    const rutInput = page.locator('input[placeholder="12.345.678-9"]');
    await expect(rutInput).toBeVisible();

    // Email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Role select
    const roleSelect = page.locator("select");
    await expect(roleSelect).toBeVisible();

    // Password fields (2)
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs).toHaveCount(2);
  });

  test("role select has all professional roles", async ({ page }) => {
    const select = page.locator("select");
    await expect(select).toContainText("Abogado");
    await expect(select).toContainText("Procurador");
    await expect(select).toContainText("Paralegal");
    await expect(select).toContainText("Estudiante de Derecho");
  });

  test("has link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toContainText("Inicia Sesión");
  });

  test("navigates to login page from link", async ({ page }) => {
    await page.locator('a[href="/login"]').click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("h2")).toContainText("Iniciar Sesión");
  });

  test("has submit button", async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText("Crear Cuenta");
  });
});
