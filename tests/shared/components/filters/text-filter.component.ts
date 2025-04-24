import { Locator, Page } from "@playwright/test";
import { FilterComponent } from "@shared/components/filter.component";

/**
 * TextFilterComponent provides a specialized interface for text input filters
 */
export class TextFilterComponent extends FilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param locator The locator for the text input field
   */
  constructor(
    root: Locator | Page,
    private readonly locator: Locator
  ) {
    super(root);
  }

  /**
   * Fills the text filter with the specified value
   * @param text Text to filter by
   */
  async filterBy(text: string): Promise<void> {
    await this.filterByText(text, this.locator);
  }

  /**
   * Clears the text filter
   */
  async clear(): Promise<void> {
    await this.locator.clear();
  }
}
