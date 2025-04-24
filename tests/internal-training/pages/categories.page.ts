import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';
import { CategoriesListComponent } from '@training/components';

// Custom error for duplicate category
export class DuplicateCategoryError extends Error {
  constructor(categoryName: string) {
    super(`Category "${categoryName}" already exists`);
    this.name = 'DuplicateCategoryError';
  }
}

export class CategoriesPage extends BasePage {
  // Categories page specific elements
  override pageTitle(): Locator {
    return this.page.getByRole('heading', { name: 'Kategorie školení' }).locator('span');
  }
  readonly createButton = () => this.page.getByRole('link', { name: 'Přidat' });
  
  // Component instances
  private _categoriesList: CategoriesListComponent | null = null;

  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Get the categories list component
   * Lazy-loaded to ensure the component is only created when needed
   */
  get categoriesList(): CategoriesListComponent {
    if (!this._categoriesList) {
      this._categoriesList = new CategoriesListComponent(this.page);
    }
    return this._categoriesList;
  }

  /**
   * Verifies that the categories page is visible by checking the page header
   */
  async expectCategoriesPageVisible() {
    await this.expectPageHeaderVisible();
  }

  // create new category
  async createNewCategory(name: string): Promise<void> {
    await this.createButton().click();
    await this.page.getByLabel('Název kategorie školení:').fill(name);
    await this.page.getByRole('button', { name: 'Přidat' }).click();
    // Wait for the page to load after redirect
    await this.page.waitForLoadState('networkidle');

    // Check for duplicate category error message
    const duplicateCategory = this.page.getByText('Položka stejného jména již existuje');
    if (await duplicateCategory.isVisible()) {
      await this.page.getByRole('link', { name: 'Zpět na výpis' }).click();
      await this.expectPageHeaderVisible();
      throw new DuplicateCategoryError(name);
    }
  }
}
