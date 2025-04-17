import { Locator } from "@playwright/test";
import { ListComponent } from "@shared/components/list.component";
import { CategoryListItemComponent, CategoriesFilterComponent } from "@training/components";

/**
 * Specialized list component for training categories
 */
export class CategoriesListComponent extends ListComponent<CategoryListItemComponent> {
  public readonly categoriesFilter: CategoriesFilterComponent;
  
  constructor(root: Locator) {
    super(root);
    // Override the default filter with our specialized categories filter
    this.categoriesFilter = new CategoriesFilterComponent(root.locator('.filter-panel'));
  }

  /**
   * Override the createListItem method to return CategoryListItemComponent instances
   */
  protected createListItem(locator: Locator): CategoryListItemComponent {
    return new CategoryListItemComponent(locator);
  }

  /**
   * Get all active categories
   */
  async getActiveCategories(): Promise<CategoryListItemComponent[]> {
    const allItems = await this.getItems();
    const activeItems: CategoryListItemComponent[] = [];
    
    for (const item of allItems) {
      if (await item.isActive()) {
        activeItems.push(item);
      }
    }
    
    return activeItems;
  }

  /**
   * Find a category by name
   */
  async findCategoryByName(name: string): Promise<CategoryListItemComponent | null> {
    const allItems = await this.getItems();
    
    for (const item of allItems) {
      const itemName = await item.getName();
      if (itemName?.toLowerCase() === name.toLowerCase()) {
        return item;
      }
    }
    
    return null;
  }

  /**
   * Click the add new category button
   */
  async clickAddNewCategory(): Promise<void> {
    await this.root.locator('.add-category-button').click();
  }

}
