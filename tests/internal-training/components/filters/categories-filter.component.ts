import { Locator } from "@playwright/test";
import { DropdownFilterComponent, DropdownOptions, DropdownType } from '@shared/components';
import { CompositeFilterInterface } from "@shared/components/interfaces/composite-filter.interface";
import { BaseCompositeFilterComponent } from "@shared/components/base-composite-filter.component";

/**
 * CategoriesFilterComponent provides a specialized interface for the categories filter panel
 * that focuses specifically on the category dropdown filter
 */
export class CategoriesFilterComponent extends BaseCompositeFilterComponent implements CompositeFilterInterface<CategoryDTO> {
  
  public readonly categoryFilter: DropdownFilterComponent;

  constructor(public readonly compositeFilterLocator: Locator) {
    super(compositeFilterLocator);
    
    // Configure dropdown options for TomSelect
    const dropdownOptions: DropdownOptions = {
      type: DropdownType.TOMSELECT,
      parentLocator: this.compositeFilterLocator
    };
    
    // Use ID selector to specifically target the input element
    this.categoryFilter = new DropdownFilterComponent(
      this.compositeFilterLocator.locator('#course_category_filter_courseCategories-ts-control'),
      dropdownOptions
    );
  }
  
  /**
   * Apply a filter with a specific category value
   * This method knows that this component only handles category filtering
   * @param categoryDTO The category value to filter by
   */
  async filter(categoryDTO: CategoryDTO): Promise<void> {
    await this.categoryFilter.select(categoryDTO.categoryName);
    await this.applyFilter();
  }
  
}

type CategoryDTO = {
  categoryName: string;
}
