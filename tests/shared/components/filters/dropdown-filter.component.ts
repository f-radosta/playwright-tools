import { Locator } from "@playwright/test";
import { SingleFilterInterface } from "../interfaces/single-filter.interface";

/**
 * DropdownFilterComponent provides a specialized interface for dropdown filters
 */
export class DropdownFilterComponent implements SingleFilterInterface {
  /**
   * @param locator The locator for the dropdown element
   */
  constructor(
    readonly locator: Locator
  ) {
  }

  /**
   * Selects an option from the dropdown filter
   * @param optionText The text of the option to select
   */
  async select(optionText: string): Promise<void> {
    await this.selectDropdownOption(optionText, this.locator);
  }

  /**
   * Gets the currently selected option text
   */
  async getSelectedOption(): Promise<string | null> {
    return this.locator.textContent();
  }

  /**
   * Selects an option from a dropdown filter
   * @param optionText The text of the option to select
   * @param dropdownLocator The locator for the dropdown element
   */
  protected async selectDropdownOption(optionText: string, dropdownLocator: Locator) {
    await dropdownLocator.click();
    await dropdownLocator.locator(`text=${optionText}`).click();
  }
}
