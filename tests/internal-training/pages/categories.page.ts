import { Page } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';
import { CategoriesListComponent } from '@training/components';
import { expect } from '@playwright/test';

// Custom error for duplicate category
export class DuplicateCategoryError extends Error {
  constructor(categoryName: string) {
    super(`Category "${categoryName}" already exists`);
    this.name = 'DuplicateCategoryError';
  }
}

export class CategoriesPage extends BasePage {
  // Categories page specific elements
  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Číselník kategorie školení' });
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
  
  // /**
  //  * Filter categories by category type
  //  */
  // async filterByCategory(categoryValue: string): Promise<void> {
  //   await this.categoriesList.categoriesFilter.filter(categoryValue);
  // }
  
  // /**
  //  * Click the create button to add a new category
  //  */
  // async clickCreate(): Promise<void> {
  //   await this.createButton().click();
  // }
  
  // /**
  //  * Find a category by name
  //  */
  // async findCategoryByName(name: string) {
  //   return this.categoriesList.findCategoryByName(name);
  // }

  // wait until page title is visible, use expect
  async waitForPageLoad() {
    await expect(this.pageTitle()).toBeVisible();
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
      await this.waitForPageLoad();
      throw new DuplicateCategoryError(name);
    }
  }
}