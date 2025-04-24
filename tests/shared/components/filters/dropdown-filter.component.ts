import { Locator, Page } from "@playwright/test";
import { FilterComponent } from "@shared/components/filter.component";

/**
 * DropdownFilterComponent provides a specialized interface for dropdown filters
 */
export class DropdownFilterComponent extends FilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param locator The locator for the dropdown element
   */
  constructor(
    root: Locator | Page,
    private readonly locator: Locator
  ) {
    super(root);
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
}
