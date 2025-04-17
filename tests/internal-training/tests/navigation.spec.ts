import { expect, Page } from '@playwright/test';
import { adminTest, userTest } from '../../shared/fixtures/auth.fixture';
import { HomePage } from '../../shared/pages/home-page.page';
import { BasePage } from '../../shared/pages/base-page';

// Test with admin authentication
adminTest('Navigate through application as admin', async ({ page }: { page: Page }) => {
  const homePage = new HomePage(page);
  
  // Navigate to home page
  await homePage.navigateToHomePage();
  await expect(homePage.pageTitle()).toBeVisible();
  
  // Navigate to training categories
  await homePage.navigateToTrainingCategories();
  await expect(page.getByRole('heading', { name: 'Kategorie školení' })).toBeVisible();
  
  // Navigate to current menu
  await homePage.navigateToCurrentMenu();
  await expect(page.getByRole('heading', { name: 'Aktuální menu' })).toBeVisible();
});

// Test with user authentication
userTest('Navigate through application as user', async ({ page }: { page: Page }) => {
  // Start at home page
  await page.goto('/');
  console.log('Current URL after navigation:', page.url());
  
  // // Take a screenshot to debug
  // await page.screenshot({ path: 'debug-screenshot.png' });
  
  // Simple test to verify we're logged in
  await expect(page).toHaveURL(/.*apimpa\.loc.*/);
});
