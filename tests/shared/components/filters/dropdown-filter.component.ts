import {Locator} from '@playwright/test';
import {SingleFilterInterface} from '../interfaces/single-filter.interface';

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
    private readonly controlLocator: Locator;
    private readonly dropdownLocator: Locator;

    /**
     * @param locator The locator for the dropdown element
     * @param dropdownType The type of dropdown
     */
    constructor(
        readonly locator: Locator,
        private readonly dropdownType: DropdownType = DropdownType.STANDARD
    ) {
        this.controlLocator = this.locator
            .locator('..')
            .locator('//*[contains(@id, "ts-control")]');
        this.dropdownLocator = this.locator
            .locator('..')
            .locator('//*[contains(@id, "ts-dropdown")]');
    }

    /**
     * Selects an option from the dropdown filter
     * @param optionText The text of the option to select
     */
    async select(optionText: string): Promise<void> {
        if (this.dropdownType === DropdownType.TOMSELECT) {
            await this.selectTomSelectOption(optionText);
        } else {
            await this.selectDropdownOption(optionText);
        }
    }

    /**
     * Selects an option from a standard dropdown filter
     * @param optionText The text of the option to select
     */
    protected async selectDropdownOption(optionText: string) {
        await this.controlLocator.click();
        await this.dropdownLocator.locator(`text=${optionText}`).click();
    }

    /**
     * Selects an option from a TomSelect dropdown
     * @param optionText The text of the option to select
     */
    protected async selectTomSelectOption(optionText: string): Promise<void> {
        // Click on the input to open the dropdown
        await this.controlLocator.click();

        // Type the search term in the input field
        await this.controlLocator.fill(optionText);

        // Wait for the dropdown to be visible
        await this.dropdownLocator.waitFor({state: 'visible'});

        // Wait for any spinner to disappear before proceeding
        const spinner = this.dropdownLocator.locator('.spinner');
        if ((await spinner.count()) > 0) {
            try {
                // Wait for spinner to disappear with a reasonable timeout
                await spinner.waitFor({state: 'hidden', timeout: 5000});
            } catch (error) {
                console.warn(
                    'Spinner did not disappear within timeout, proceeding anyway'
                );
            }
        }

        // Get all available options
        const options = this.dropdownLocator.locator('div.option');
        const count = await options.count();

        // First try to find an exact match (case-insensitive and trimmed)
        let found = false;
        const trimmedOptionText = optionText.trim();

        for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            const text = (await option.textContent()) || '';
            const trimmedText = text.trim();

            // Check for exact match (case-insensitive)
            if (trimmedText.toLowerCase() === trimmedOptionText.toLowerCase()) {
                // Check again for spinner before clicking
                if (
                    (await spinner.count()) > 0 &&
                    (await spinner.isVisible())
                ) {
                    await spinner
                        .waitFor({state: 'hidden', timeout: 5000})
                        .catch(() => {});
                }
                await option.click();
                found = true;
                break;
            }
        }

        // If no exact match found, fall back to the first partial match
        if (!found) {
            const partialOption = this.dropdownLocator
                .locator(`div.option:has-text("${optionText}")`)
                .first();
            await partialOption.waitFor({state: 'visible'});

            // Check again for spinner before clicking
            if ((await spinner.count()) > 0 && (await spinner.isVisible())) {
                await spinner
                    .waitFor({state: 'hidden', timeout: 5000})
                    .catch(() => {});
            }
            await partialOption.click();
        }
    }
}
