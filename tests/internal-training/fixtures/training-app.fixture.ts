import { test as base } from '@playwright/test';
import { TrainingApp } from '@training/pages/training-app.factory';
import { BasePage } from '@shared/pages/base-page';

// Extend the test fixtures with trainingApp
type TrainingAppFixtures = {
  trainingApp: TrainingApp;
};

// Create a fixture for the TrainingApp
export const test = base.extend<TrainingAppFixtures>({
  trainingApp: async ({ page }, use) => {
    // First navigate to the base URL to ensure the page is loaded
    await page.goto('/');
    
    // Create a BasePage instance
    const basePage = new BasePage(page);
    
    // Create a TrainingApp instance
    const trainingApp = new TrainingApp(basePage);
    
    // Use the TrainingApp in the test
    await use(trainingApp);
  }
});

// Re-export the expect function
export { expect } from '@playwright/test';
