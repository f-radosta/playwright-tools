import { Locator, Page } from "@playwright/test";
import { SingleFilterComponent } from "../filter.component";

/**
 * Component for text filter controls
 */
export class TextFilterComponent extends SingleFilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param locator The locator for the text input field
   */
  constructor(
    root: Locator | Page,
    locator: Locator
  ) {
    super(root, locator);
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
