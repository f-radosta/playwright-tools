import { Locator } from "@playwright/test";
import { BaseListComponent } from "@shared/components/base-list.component";
import { CategoryListItemComponent, CategoriesFilterComponent } from "@training/components";
import { ListInterface } from "@shared/components/interfaces/list.interface";

/**
 * Specialized list component for training categories
 */
export class CategoriesListComponent extends BaseListComponent<CategoryListItemComponent> implements ListInterface {
  public readonly categoriesFilter: CategoriesFilterComponent;
  readonly categoryFilterLocator = () => this.listLocator.getByTestId('filter');

  constructor(listLocator: Locator) {
    super(listLocator);
    this.categoriesFilter = new CategoriesFilterComponent(this.categoryFilterLocator());
  }

  /**
   * @override
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
    const trimmedName = name.trim();

    // Search from last to first for faster search in most cases
    for (let i = allItems.length - 1; i >= 0; i--) {
      const item = allItems[i];
      const itemName = await item.getName();

      if (itemName && itemName.trim().localeCompare(trimmedName) === 0) {
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
