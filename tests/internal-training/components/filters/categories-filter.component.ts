import { Locator, Page } from "@playwright/test";
import { CompositeFilterComponent, DropdownFilterComponent, FilterCriteria } from '@shared/components';

/**
 * CategoriesFilterComponent provides a specialized interface for the categories filter panel
 * that focuses specifically on the category dropdown filter
 */
export class CategoriesFilterComponent extends CompositeFilterComponent {
  
  public readonly categoryFilter: DropdownFilterComponent;
  readonly categoryFilterLocator = () => this.root.getByRole('combobox', { name: 'Kategorie školení' });

  constructor(root: Locator | Page) {
    super(root);
    
    // Initialize the category dropdown filter with its specific selector
    this.categoryFilter = new DropdownFilterComponent(root, this.categoryFilterLocator());
  }
  
  /**
   * Apply a filter with a specific category value
   * This method knows that this component only handles category filtering
   * @param categoryValue The category value to filter by
   */
  async filter(categoryValue: string): Promise<void> {
    const criteria = new FilterCriteria();
    criteria.addDropdown(categoryValue, this.categoryFilterLocator());
    await this.applyFilter(criteria);
  }
  
}
