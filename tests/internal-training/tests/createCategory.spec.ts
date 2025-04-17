import { userTest } from '@shared/fixtures/auth.fixture';
import { TrainingApp } from '@training/pages/training-app.factory';
import { expect } from '@playwright/test';

// Test with user authentication
userTest('View and filter categories as user', async ({ trainingApp }: { trainingApp: TrainingApp }) => {
  // Navigate to categories page
  const categoriesPage = await trainingApp.gotoCategories();
  
  // Filter categories by type
  //await categoriesPage.categoriesList.categoriesFilter.filter('Technical');
});
