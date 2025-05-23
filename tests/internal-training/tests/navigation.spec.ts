import { userTest } from '@auth/app-auth.fixture';
import { AppFactory } from '@shared/pages/app.factory';
import { expect } from '@playwright/test';

userTest('Test Homepage navigation cards', async ({ app }: { app: AppFactory }) => {
  const homePage = await app.gotoDashboard();

  // go to internal training by clicking nav card
  await homePage.internalTrainingLink().click();
  await expect(homePage.page.getByRole('heading', { name: 'Interní školení' }).locator('span')).toBeVisible();

  await app.gotoDashboard();

  // go to lunch order by clicking nav card
  await homePage.lunchOrderLink().click();
  await expect(homePage.page.getByRole('heading', { name: 'Objednání obědů' }).locator('span')).toBeVisible();

});
