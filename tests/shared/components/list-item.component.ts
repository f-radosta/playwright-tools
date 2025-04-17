import { Locator } from "@playwright/test";
import { listSelectors } from "@shared/selectors/list.selectors";

/**
 * Base class for list item components
 * Can be extended for specific types of list items
 */
export class ListItemComponent {
  constructor(public readonly root: Locator) {}

  /**
   * Get the text content of the list item
   */
  async getText(): Promise<string | null> {
    return this.root.textContent();
  }

  /**
   * Click on the list item
   */
  async click(): Promise<void> {
    await this.root.click();
  }

  /**
   * Click the edit button on the list item
   */
  async clickEdit(): Promise<void> {
    await this.root.getByTitle(listSelectors.titles.edit).click();
  }

  /**
   * Click the delete button on the list item
   */
  async clickDelete(): Promise<void> {
    await this.root.locator(listSelectors.deleteButton).click();
  }

  /**
   * Check if the list item is visible
   */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /**
   * Get a specific element within the list item by selector
   */
  locator(selector: string): Locator {
    return this.root.locator(selector);
  }
}
