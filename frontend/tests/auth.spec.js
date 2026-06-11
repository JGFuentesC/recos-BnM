import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Authentication and Protected Routes', () => {
  test('should redirect from root to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should redirect from /feed to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/feed`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should redirect from /onboarding to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should redirect from /library to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/library`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('should allow access to /login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
    // Check for some login text to ensure it's not just a blank page or error
    await expect(page.locator('text=/Match&Read/i')).toBeVisible();
    await expect(page.locator('text=/Iniciar sesion/i')).toBeVisible();
  });

  test('should allow access to /register', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page).toHaveURL(`${BASE_URL}/register`);
    await expect(page.locator('text=/Crear cuenta/i')).toBeVisible();
    await expect(page.locator('text=/Registrarse/i').first()).toBeVisible();
  });

  test('should allow access to /mock-feed', async ({ page }) => {
    await page.goto(`${BASE_URL}/mock-feed`);
    await expect(page).toHaveURL(`${BASE_URL}/mock-feed`);
  });
});
