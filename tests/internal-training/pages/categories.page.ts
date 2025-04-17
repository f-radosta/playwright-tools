import { Page } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';
import { CategoriesListComponent } from '@training/components';

export class CategoriesPage extends BasePage {
  // Categories page specific elements
  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Číselník kategorie školení' });
  readonly createButton = () => this.page.getByRole('button', { name: 'Přidat' });
  readonly categoriesListLocator = () => this.page.getByRole('list');
  
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
      this._categoriesList = new CategoriesListComponent(this.categoriesListLocator());
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
}