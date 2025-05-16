import { Locator } from "@playwright/test";
import { SingleFilterInterface } from "../interfaces/single-filter.interface";

/**
 * Enum for dropdown types
 */
export enum DropdownType {
  STANDARD = 'standard',
  TOMSELECT = 'tomselect'
}

/**
 * DropdownFilterComponent provides a specialized interface for dropdown filters
 */
export class DropdownFilterComponent implements SingleFilterInterface {
  /**
   * @param locator The locator for the dropdown element
   * @param options Optional configuration for the dropdown
   */
  constructor(
    readonly locator: Locator,
    private readonly options: DropdownOptions = {}
  ) {
  }

  /**
   * Selects an option from the dropdown filter
   * @param optionText The text of the option to select
   */
  async select(optionText: string): Promise<void> {
    if (this.options.type === DropdownType.TOMSELECT) {
      await this.selectTomSelectOption(optionText);
    } else {
      await this.selectDropdownOption(optionText, this.locator);
    }
  }

  /**
   * Gets the currently selected option text
   */
  async getSelectedOption(): Promise<string | null> {
    return this.locator.textContent();
  }

  /**
   * Selects an option from a standard dropdown filter
   * @param optionText The text of the option to select
   * @param dropdownLocator The locator for the dropdown element
   */
  protected async selectDropdownOption(optionText: string, dropdownLocator: Locator) {
    await dropdownLocator.click();
    await dropdownLocator.locator(`text=${optionText}`).click();
  }

  /**
   * Selects an option from a TomSelect dropdown
   * @param optionText The text of the option to select
   */
  protected async selectTomSelectOption(optionText: string): Promise<void> {
    // Click on the input to open the dropdown
    await this.locator.click();
    
    // Type the search term in the input field
    await this.locator.fill(optionText);
    
    // Get the parent element that contains both the input and dropdown
    const parentLocator = this.options.parentLocator || this.locator.locator('..');
    
    // Wait for the dropdown to be visible
    const dropdownContent = parentLocator.locator('.ts-dropdown-content');
    await dropdownContent.waitFor({ state: 'visible' });
    
    // Find and click the option with the matching text
    const option = dropdownContent.locator(`div.option:has-text("${optionText}")`);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }
}

/**
 * Configuration options for the dropdown component
 */
export interface DropdownOptions {
  /**
   * The type of dropdown
   */
  type?: DropdownType;
  
  /**
   * Optional parent locator to use for finding dropdown elements
   * Useful when the dropdown options are not direct children of the input element
   */
  parentLocator?: Locator;
}
