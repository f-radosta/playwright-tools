import {Locator} from '@playwright/test';
import {SingleFilterInterface} from '@shared-interfaces/single-filter.interface';

/**
 * Component for text filter controls
 */
export class TextFilterComponent implements SingleFilterInterface {
    /**
     * @param locator The locator for the text input field
     */
    constructor(readonly locator: Locator) {}

    /**
     * Fills the text filter with the specified value
     * @param text Text to filter by
     */
    async filterBy(text: string): Promise<void> {
        await this.filterByText(text, this.locator);
    }

    /**
     * Fills a filter input field with the specified text
     * @param text Text to filter by
     * @param textFieldLocator The locator for the filter input
     */
    protected async filterByText(text: string, textFieldLocator: Locator) {
        await textFieldLocator.fill(text);
    }
}
