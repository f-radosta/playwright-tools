import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Navigation elements
  readonly homeLink = () => this.page.getByRole('link', { name: 'Úvodní stránka' });
  readonly trainingLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Interní školení' });
  readonly trainingListLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Seznam školení' });
  readonly trainingCategoriesLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Kategorie školení' });
  readonly lunchOrderLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Objednání obědů' });
  readonly currentMenuLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Aktuální menu' });
  readonly monthlyBillingLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Měsíční vyúčtování' });

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Gets the page title locator - to be overridden by subclasses
   * @returns Locator for the page title
   */
  pageTitle(): Locator {
    throw new Error('pageTitle() method must be implemented by subclass');
  }

  /**
   * Verifies that the page is visible by checking the page title in the header
   * This is a common method for all pages except home page
   */
  async expectPageHeaderVisible(): Promise<void> {
    await expect(this.pageTitle()).toBeVisible();
  }
}