import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');

    const heading = page.getByRole('heading', {
      name: /find the next big sports card investment/i
    });
    await expect(heading).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');

    const playerAnalysisCard = page.getByRole('heading', { name: /player analysis/i });
    const priceTrackingCard = page.getByRole('heading', { name: /price tracking/i });
    const aiInsightsCard = page.getByRole('heading', { name: /ai insights/i });

    await expect(playerAnalysisCard).toBeVisible();
    await expect(priceTrackingCard).toBeVisible();
    await expect(aiInsightsCard).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    const playersLink = page.getByRole('link', { name: /players/i });
    const cardsLink = page.getByRole('link', { name: /cards/i });
    const portfolioLink = page.getByRole('link', { name: /portfolio/i });

    await expect(playersLink).toBeVisible();
    await expect(cardsLink).toBeVisible();
    await expect(portfolioLink).toBeVisible();
  });

  test('should display sign in button when not authenticated', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});
