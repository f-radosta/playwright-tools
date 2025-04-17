import { Locator } from "@playwright/test";
import { FilterComponent, DropdownFilterComponent, FilterCriteria } from '@shared/components';

/**
 * CategoriesFilterComponent provides a specialized interface for the categories filter panel
 * that focuses specifically on the category dropdown filter
 */
export class CategoriesFilterComponent extends FilterComponent {
  
  public readonly categoryFilter: DropdownFilterComponent;

  constructor(root: Locator) {
    super(root);
    
    // Initialize the category dropdown filter with its specific selector
    this.categoryFilter = new DropdownFilterComponent(root, 'select[aria-label="Kategorie školení"]');
  }
  
  /**
   * Apply a filter with a specific category value
   * This method knows that this component only handles category filtering
   * @param categoryValue The category value to filter by
   */
  async filter(categoryValue: string): Promise<void> {
    const criteria = new FilterCriteria();
    criteria.addDropdown(categoryValue, 'select[aria-label="Kategorie školení"]');
    await this.applyFilter(criteria);
  }
  
}
