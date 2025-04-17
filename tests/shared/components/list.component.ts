import { Locator } from "@playwright/test";
import { FilterComponent, ListItemComponent } from "@shared/components";
import { listSelectors } from "@shared/selectors/list.selectors";

export class ListComponent<T extends ListItemComponent = ListItemComponent> {
  public readonly filter: FilterComponent;
  protected readonly itemSelector: string = listSelectors.item;

  constructor(public readonly root: Locator) {
    this.filter = new FilterComponent(root);
  }

  /**
   * Create a list item component from a locator
   * This method can be overridden by subclasses to return specialized list item components
   */
  protected createListItem(locator: Locator): T {
    return new ListItemComponent(locator) as T;
  }

  /**
   * Get all list items as locators
   */
  async getItemLocators(): Promise<Locator[]> {
    return this.root.locator(this.itemSelector).all();
  }

  /**
   * Get all list items as ListItemComponent instances
   */
  async getItems(): Promise<T[]> {
    const locators = await this.getItemLocators();
    return locators.map(locator => this.createListItem(locator));
  }

  /**
   * Get a specific list item by index
   */
  async getItem(index: number): Promise<T> {
    return this.createListItem(this.root.locator(this.itemSelector).nth(index));
  }

  /**
   * Get the text of a specific list item by index
   */
  async getItemText(index: number): Promise<string | null> {
    const item = await this.getItem(index);
    return item.getText();
  }

  /**
   * Click on a specific list item by index
   */
  async clickItem(index: number): Promise<void> {
    const item = await this.getItem(index);
    await item.click();
  }

  /**
   * Click the edit button on a specific list item by index
   */
  async clickEdit(index: number): Promise<void> {
    const item = await this.getItem(index);
    await item.clickEdit();
  }

  /**
   * Click the delete button on a specific list item by index
   */
  async clickDelete(index: number): Promise<void> {
    const item = await this.getItem(index);
    await item.clickDelete();
  }

  /**
   * Get the count of items in the list
   */
  async getItemCount(): Promise<number> {
    const items = await this.getItemLocators();
    return items.length;
  }

}
