import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should display the landing page with correct content', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.getByRole('heading', { name: /Turn financial chaos into clarity/i })).toBeVisible()

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Start for free/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /See how it works/i })).toBeVisible()

    // Check navigation
    await expect(page.getByRole('link', { name: /Sign in/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Get started/i })).toBeVisible()
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /Get started/i }).first().click()

    await expect(page).toHaveURL(/sign-up/)
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /Sign in/i }).click()

    await expect(page).toHaveURL(/sign-in/)
  })
})
