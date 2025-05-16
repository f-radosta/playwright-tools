import { Locator } from "@playwright/test";
import { listSelectors } from "@shared/selectors/list.selectors";

/**
 * Base class for list item components
 * Can be extended for specific types of list items
 */
export class BaseListItemComponent {
  constructor(public readonly itemLocator: Locator) { }

  /**
   * Get the text content of the list item
   */
  async getText(): Promise<string | null> {
    return this.itemLocator.textContent();
  }

  /**
   * Click on the list item
   */
  async click(): Promise<void> {
    await this.itemLocator.click();
  }

  /**
   * Click the edit button on the list item
   */
  async clickEdit(): Promise<void> {
    await this.itemLocator.getByTitle(listSelectors.titles.edit).click();
  }

  /**
   * Click the delete button on the list item
   */
  async clickDelete(): Promise<void> {
    await this.itemLocator.getByTestId('trash').click();
  }

  /**
   * Check if the list item is visible
   */
  async isVisible(): Promise<boolean> {
    return this.itemLocator.isVisible();
  }

  /**
   * Get a specific element within the list item by selector
   */
  locator(selector: string): Locator {
    return this.itemLocator.locator(selector);
  }
}
