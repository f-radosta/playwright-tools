import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Private getter for navigation tabs
  private get navTab() {
    return this.page.getByTestId('navtab');
  }

  // Navigation elements
  readonly homeLink = () => this.navTab.filter({ hasText: 'Úvodní stránka' });
  readonly trainingLink = () => this.navTab.filter({ hasText: 'Interní školení' });
  readonly trainingListLink = () => this.navTab.filter({ hasText: 'Seznam školení' });
  readonly trainingCategoriesLink = () => this.navTab.filter({ hasText: 'Kategorie školení' });
  readonly lunchOrderLink = () => this.navTab.filter({ hasText: 'Objednání obědů' });
  readonly currentMenuLink = () => this.navTab.filter({ hasText: 'Aktuální menu' });
  readonly monthlyBillingLink = () => this.navTab.filter({ hasText: 'Měsíční vyúčtování' });

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