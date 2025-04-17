import { Locator } from "@playwright/test";
import { FilterComponent } from "@shared/components/filter.component";

/**
 * DateFilterComponent provides a specialized interface for date filters
 */
export class DateFilterComponent extends FilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param selector The selector for the date input field
   */
  constructor(
    root: Locator,
    private readonly selector: string
  ) {
    super(root);
  }

  /**
   * Sets the date filter value
   * @param date Date string in the format expected by the date input (YYYY-MM-DD)
   */
  async setDate(date: string): Promise<void> {
    await this.setDateFilter(date, this.selector);
  }

  /**
   * Clears the date filter
   */
  async clear(): Promise<void> {
    await this.root.locator(this.selector).clear();
  }
}
