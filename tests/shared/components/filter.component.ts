import { Locator, Page } from "@playwright/test";
import { FilterCriteria, FilterCriterion } from "./filter-criteria";
import { filterSelectors } from "@shared/selectors/filter.selectors";

/**
 * FilterComponent provides a flexible interface for handling various filtering scenarios
 * in the application. It supports both simple text filtering and more complex filtering
 * with multiple criteria.
 */
export class FilterComponent {
  constructor(public readonly root: Locator | Page) {}

  /**
   * Fills a filter input field with the specified text
   * @param text Text to filter by
   * @param textFieldLocator The locator for the filter input
   */
  protected async filterByText(text: string, textFieldLocator: Locator) {
    await textFieldLocator.fill(text);
  }

  /**
   * Resets the current filter
   */
  async resetFilter() {
    await this.root.getByTitle(filterSelectors.titles.reset).click();
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

  /**
   * Apply a single filter criterion
   * @param criterion The filter criterion to apply
   */
  protected async applyCriterion(criterion: FilterCriterion): Promise<void> {
    switch (criterion.type) {
      case 'text':
        await this.filterByText(criterion.value, criterion.locator);
        break;
      case 'dropdown':
        await this.selectDropdownOption(criterion.value, criterion.locator);
        break;
      case 'date':
        await this.setDateFilter(criterion.value, criterion.locator);
        break;
      case 'checkbox':
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
