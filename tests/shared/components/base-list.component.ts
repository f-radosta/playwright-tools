import {Locator} from '@playwright/test';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import {ListInterface} from '@shared-interfaces/list.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export abstract class BaseListComponent<
    T extends BaseListItemComponent = BaseListItemComponent
> implements ListInterface
{
    public readonly itemLocators: Locator;

    constructor(public readonly listLocator: Locator) {
        this.itemLocators = this.listLocator
            .getByTestId(SHARED_SELECTORS.LIST)
            .getByTestId(SHARED_SELECTORS.LIST.ITEM);
    }

    /**
     * Get all list items as locators
     */
    async getItemLocators(): Promise<Locator[]> {
        return this.itemLocators.all();
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
        return this.createListItem(this.itemLocators.nth(index));
    }

    /**
     * Get the text of a specific list item by index
     */
    async getItemText(index: number): Promise<string | null> {
        const item = await this.getItem(index);
        return item.getAllText();
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
     * Delete all items in the list
     */
    async deleteAll(): Promise<void> {
        const items = await this.getItems();
        for (const item of items) {
            await item.clickDelete();
        }
    }

    /**
     * Get the count of items in the list
     */
    async getItemCount(): Promise<number> {
        const items = await this.getItemLocators();
        return items.length;
    }

    /**
     * Create a list item component from a locator
     * This method must be implemented by subclasses to return specialized list item components
     */
    protected abstract createListItem(locator: Locator): T;
}
