import { Locator, Page } from "@playwright/test";
import { FilterCriteria, FilterCriterion, FILTER_TYPES } from "./filter-criteria";
import { filterSelectors } from "@shared/selectors/filter.selectors";

// Re-export to ensure they're available to importers of this file
export { FilterCriteria, FilterCriterion, FILTER_TYPES };

/**
 * Interface for all filter components
 */
export interface IFilter {
  /**
   * Resets the current filter
   */
  resetFilter(): Promise<void>;
}

/**
 * Base component for all filters
 */
export abstract class BaseFilterComponent implements IFilter {
  constructor(public readonly root: Locator | Page) {}

  /**
   * Resets the current filter
   */
  async resetFilter() {
    await this.root.getByTitle(filterSelectors.titles.reset).click();
  }

  /**
   * Fills a filter input field with the specified text
   * @param text Text to filter by
   * @param textFieldLocator The locator for the filter input
   */
  protected async filterByText(text: string, textFieldLocator: Locator) {
    await textFieldLocator.fill(text);
  }

  /**
   * Selects an option from a dropdown filter
   * @param optionText The text of the option to select
   * @param dropdownLocator The locator for the dropdown element
   */
  protected async selectDropdownOption(optionText: string, dropdownLocator: Locator) {
    await dropdownLocator.click();
    await this.root.locator(`text=${optionText}`).click();
  }

  /**
   * Sets a date filter value
   * @param date Date string in the format expected by the date input
   * @param dateInputLocator The locator for the date input
   */
  protected async setDateFilter(date: string, dateInputLocator: Locator) {
    await dateInputLocator.fill(date);
  }

  /**
   * Toggles a checkbox filter
   * @param checkboxLocator The locator for the checkbox
   * @param state Optional desired state (checked/unchecked), toggles current state if not specified
   */
  protected async toggleCheckbox(checkboxLocator: Locator, state?: boolean) {
    const checkbox = checkboxLocator;
    if (state !== undefined) {
      const isChecked = await checkbox.isChecked();
      if (isChecked !== state) {
        await checkbox.click();
      }
    } else {
      await checkbox.click();
    }
  }
}

/**
 * Base component for single filter controls (like dropdown, text input, etc.)
 * These are the small, specialized filter components
 */
export class SingleFilterComponent extends BaseFilterComponent {
  constructor(
    root: Locator | Page,
    protected readonly locator: Locator
  ) {
    super(root);
  }
}

/**
 * Component for composite filters that can apply multiple criteria
 * These are the "big" filter components that may contain multiple smaller filters
 */
export class CompositeFilterComponent extends BaseFilterComponent {
  constructor(root: Locator | Page) {
    super(root);
  }

  /**
   * Apply a single filter criterion
   * @param criterion The filter criterion to apply
   */
  protected async applyCriterion(criterion: FilterCriterion): Promise<void> {
    switch (criterion.type) {
      case FILTER_TYPES.TEXT:
        await this.filterByText(criterion.value, criterion.locator);
        break;
      case FILTER_TYPES.DROPDOWN:
        await this.selectDropdownOption(criterion.value, criterion.locator);
        break;
      case FILTER_TYPES.DATE:
        await this.setDateFilter(criterion.value, criterion.locator);
        break;
      case FILTER_TYPES.CHECKBOX:
        await this.toggleCheckbox(criterion.locator, criterion.state);
        break;
    }
  }

  /**
   * Apply multiple filter criteria at once
   * @param criteria The filter criteria to apply
   */
  protected async applyFilter(criteria: FilterCriteria): Promise<void> {
    for (const criterion of criteria.getCriteria()) {
      await this.applyCriterion(criterion);
    }
  }
}

/**
 * @deprecated Use BaseFilterComponent, SingleFilterComponent, or CompositeFilterComponent instead
 */
export class FilterComponent extends CompositeFilterComponent {
  constructor(root: Locator | Page) {
    super(root);
  }
}
