import {Locator} from '@playwright/test';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {ListItemInterface} from '@shared-interfaces/list-item.interface';
import {withConfirmationDialog} from '@shared-utils/dialog-utils';

/**
 * Base class for list item components
 * Can be extended for specific types of list items
 */
export abstract class BaseListItemComponent implements ListItemInterface {
    constructor(public readonly itemLocator: Locator) {}

    /**
     * Get the text content of the list item
     */
    async getAllText(): Promise<string | null> {
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
        await this.itemLocator.getByTitle(SHARED_SELECTORS.LIST.TITLES.EDIT).click();
    }

    /**
     * Click the delete button on the list item
     */
    async clickDelete(): Promise<void> {
        await this.itemLocator.getByTestId(SHARED_SELECTORS.ACTIONS.TRASH).click();
    }

    /**
     * Check if the list item is visible
     */
    async isVisible(): Promise<boolean> {
        return this.itemLocator.isVisible();
    }

    /**
     * Delete the list item
     */
    async deleteItself(): Promise<void> {
        await withConfirmationDialog(
            this.itemLocator.page(),
            async () => {
                await this.itemLocator.getByTestId(SHARED_SELECTORS.ACTIONS.TRASH).click();
            },
            true,
            'Opravdu chcete smazat záznam?'
        );
    }

    async getTextOfElementByTestId(testId: string): Promise<string | null> {
        return this.itemLocator.getByTestId(testId).textContent();
    }

    async clickOnElementByTestId(testId: string): Promise<void> {
        await this.itemLocator.getByTestId(testId).click();
    }

    // get text of i elemnt of list-item-content
    async getTextOfItemContentByIndex(
        indexOfContent: number
    ): Promise<string | null> {
        return this.itemLocator
            .getByTestId(SHARED_SELECTORS.LIST.ITEM.CONTENT)
            .nth(indexOfContent)
            .textContent();
    }
    // click on i elemnt of list-item-content
    async clickOnItemContentByIndex(indexOfContent: number): Promise<void> {
        await this.itemLocator
            .getByTestId(SHARED_SELECTORS.LIST.ITEM.CONTENT)
            .nth(indexOfContent)
            .click();
    }
    // get text of i elemnt of list-item-text
    async getTextOfItemByIndex(indexOfText: number): Promise<string | null> {
        return this.itemLocator
            .getByTestId(SHARED_SELECTORS.LIST.ITEM.TEXT)
            .nth(indexOfText)
            .textContent();
    }
    // get text of i elemnt of list-item-label
    async getTextOfItemLabelByIndex(
        indexOfLabel: number
    ): Promise<string | null> {
        return this.itemLocator
            .getByTestId(SHARED_SELECTORS.LIST.ITEM.LABEL)
            .nth(indexOfLabel)
            .textContent();
    }

    /**
     * Get a specific element within the list item by selector
     */
    locator(selector: string): Locator {
        return this.itemLocator.locator(selector);
    }
}
