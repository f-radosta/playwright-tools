import { Locator } from "@playwright/test";
import { FilterCriteria, FilterCriterion } from "./filter-criteria";
import { listSelectors } from "@shared/selectors/list.selectors";
import { filterSelectors } from "@shared/selectors/filter.selectors";

/**
 * FilterComponent provides a flexible interface for handling various filtering scenarios
 * in the application. It supports both simple text filtering and more complex filtering
 * with multiple criteria.
 */
export class FilterComponent {
  constructor(public readonly root: Locator) {}

  /**
   * Fills a filter input field with the specified text
   * @param text Text to filter by
   * @param textFieldSelector The selector for the filter input
   */
  protected async filterByText(text: string, textFieldSelector: string) {
    await this.root.locator(textFieldSelector).fill(text);
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
   * @param dropdownSelector The selector for the dropdown element
   */
  protected async selectDropdownOption(optionText: string, dropdownSelector: string) {
    await this.root.locator(dropdownSelector).click();
    await this.root.locator(`text=${optionText}`).click();
  }

  /**
   * Sets a date filter value
   * @param date Date string in the format expected by the date input
   * @param dateInputSelector The selector for the date input
   */
  protected async setDateFilter(date: string, dateInputSelector: string) {
    await this.root.locator(dateInputSelector).fill(date);
  }

  /**
   * Toggles a checkbox filter
   * @param checkboxSelector The selector for the checkbox
   * @param state Optional desired state (checked/unchecked), toggles current state if not specified
   */
  protected async toggleCheckbox(checkboxSelector: string, state?: boolean) {
    const checkbox = this.root.locator(checkboxSelector);
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
        await this.filterByText(criterion.value, criterion.selector);
        break;
      case 'dropdown':
        await this.selectDropdownOption(criterion.value, criterion.selector);
        break;
      case 'date':
        await this.setDateFilter(criterion.value, criterion.selector);
        break;
      case 'checkbox':
        await this.toggleCheckbox(criterion.selector, criterion.state);
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
