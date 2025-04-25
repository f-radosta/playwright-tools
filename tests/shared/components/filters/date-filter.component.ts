import { Locator, Page } from "@playwright/test";
import { SingleFilterComponent } from "../filter.component";

/**
 * Component for date filter controls
 */
export class DateFilterComponent extends SingleFilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param locator The locator for the date input field
   */
  constructor(
    root: Locator | Page,
    locator: Locator
  ) {
    super(root, locator);
  }

  /**
   * Sets the date filter value
   * @param date Date string in the format expected by the date input (YYYY-MM-DD)
   */
  async setDate(date: string): Promise<void> {
    await this.setDateFilter(date, this.locator);
  }

  /**
   * Clears the date filter
   */
  async clear(): Promise<void> {
    await this.locator.clear();
  }
}
