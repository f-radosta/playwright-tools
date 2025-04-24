import { userTest } from '@shared/fixtures/auth.fixture';
import { TrainingApp } from '@training/pages/training-app.factory';
import { expect } from '@playwright/test';

userTest('Test Homepage navigation cards', async ({ trainingApp }: { trainingApp: TrainingApp }) => {
  const homePage = await trainingApp.gotoDashboard();
  await homePage.expectHomePageVisible();

  // go to internal training by clicking nav card
  await homePage.internalTrainingLink().click();
  await expect(homePage.page.getByRole('heading', { name: 'Interní školení' }).locator('span')).toBeVisible();

  await trainingApp.gotoDashboard();
  await homePage.expectHomePageVisible();

  // go to lunch order by clicking nav card
  await homePage.lunchOrderLink().click();
  await expect(homePage.page.getByRole('heading', { name: 'Objednání obědů' }).locator('span')).toBeVisible();

});
