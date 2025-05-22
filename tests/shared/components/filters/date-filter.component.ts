import { Locator } from "@playwright/test";
import { SingleFilterInterface } from "../interfaces/single-filter.interface";

/**
 * Component for date filter controls
 */
export class DateFilterComponent implements SingleFilterInterface {
  /**
   * @param locator The locator for the date input field
   */
  constructor(
    readonly locator: Locator
  ) {
  }

  /**
   * Sets the date filter value
   * @param date Date string in the format expected by the date input (YYYY-MM-DD)
   */
  async setDate(date: string): Promise<void> {
    await this.setDateFilter(date, this.locator);
  }

  /**
   * Sets a date filter value
   * @param date Date string in the format expected by the date input
   * @param dateInputLocator The locator for the date input
   */
  protected async setDateFilter(date: string, dateInputLocator: Locator) {
    // Remove the readonly attribute before filling
    await dateInputLocator.evaluate((element) => {
      element.removeAttribute('readonly');
    });
    
    // Fill the date input
    await dateInputLocator.fill(date);
  }
}
