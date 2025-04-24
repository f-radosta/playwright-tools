import { Locator, Page } from "@playwright/test";
import { ListComponent } from "@shared/components/list.component";
import { CategoryListItemComponent, CategoriesFilterComponent } from "@training/components";

/**
 * Specialized list component for training categories
 */
export class CategoriesListComponent extends ListComponent<CategoryListItemComponent> {
  public readonly categoriesFilter: CategoriesFilterComponent;
  
  constructor(root: Locator | Page) {
    super(root);
    // Override the default filter with our specialized categories filter
    this.categoriesFilter = new CategoriesFilterComponent(root);
  }

  /**
   * Override the createListItem method to return CategoryListItemComponent instances
   */
  protected createListItem(locator: Locator): CategoryListItemComponent {
    return new CategoryListItemComponent(locator);
  }

  /**
   * Find a category by name
   */
  async findCategoryByName(name: string): Promise<CategoryListItemComponent | null> {
    const allItems = await this.getItems();
    
    // Search from last to first (reversed order)
    for (let i = allItems.length - 1; i >= 0; i--) {
      const item = allItems[i];
      const itemName = await item.getName();
      if (itemName?.toLowerCase().trim() === name.toLowerCase().trim()) {
        console.log(`Found category "${name}" at index ${i}`);
        return item;
      }
    }
    
    return null;
  }

  /**
   * Delete a category by name
   */
  async deleteCategoryByName(name: string): Promise<void> {
    const category = await this.findCategoryByName(name);
    if (!category) {
      throw new Error(`Category "${name}" not found`);
    }
    await category.deleteItself();
  }

}
