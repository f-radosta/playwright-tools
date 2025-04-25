import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';

export class TrainingHomePage extends BasePage {
  override pageTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Interní školení' }).locator('span');
  }

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifies that the training home page is visible by checking the page header
   */
  async expectTrainingPageVisible() {
    await this.expectPageHeaderVisible();
  }

}
