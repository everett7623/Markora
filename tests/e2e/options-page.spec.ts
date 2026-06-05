import { expect, test } from '@playwright/test';

test('renders all foundation navigation routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.getByRole('link', { name: 'Scanner' }).click();
  await expect(page.getByRole('heading', { name: 'Scanner' })).toBeVisible();

  await page.getByRole('link', { name: 'Bookmark Manager' }).click();
  await expect(page.getByRole('heading', { name: 'Bookmark Manager' })).toBeVisible();
});
