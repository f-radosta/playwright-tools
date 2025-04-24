import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  // Home page specific elements
  readonly internalTrainingLink = () => this.page.getByRole('link', { name: 'Interní školení' }).nth(2);
  readonly lunchOrderLink = () => this.page.getByRole('link', { name: 'Objednávání obědů' });

  constructor(page: Page) {
    super(page);
  }

  // Home page specific methods
  async navigateToHomePage() {
    await this.page.goto('/');
  }

  // expect Home page specific elements visible
  async expectHomePageVisible() {
    await expect(this.internalTrainingLink()).toBeVisible();
    await expect(this.lunchOrderLink()).toBeVisible();
  }

}