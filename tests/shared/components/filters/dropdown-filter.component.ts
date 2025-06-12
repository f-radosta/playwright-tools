import {Locator} from '@playwright/test';
import {SingleFilterInterface} from '@shared-interfaces/single-filter.interface';

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
     * Waits for the spinner to disappear if it's visible
     * @param spinner The spinner locator
     */
    private async waitForSpinner(spinner: Locator): Promise<void> {
        if ((await spinner.count()) > 0 && (await spinner.isVisible())) {
            await spinner
                .waitFor({state: 'hidden', timeout: 5000})
                .catch(() => {
                    console.warn(
                        'Spinner did not disappear within timeout, proceeding anyway'
                    );
                });
        }
    }

    /**
     * Tries to find and select an exact match for the option text
     * @param options Locator for all options
     * @param spinner Spinner locator
     * @param optionText Text to search for
     * @returns true if an exact match was found and selected, false otherwise
     */
    private async trySelectExactMatch(
        options: Locator,
        spinner: Locator,
        optionText: string
    ): Promise<boolean> {
        const count = await options.count();
        const trimmedOptionText = optionText.trim();

        for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            const text = (await option.textContent()) || '';
            const trimmedText = text.trim();

            if (trimmedText.toLowerCase() === trimmedOptionText.toLowerCase()) {
                await this.waitForSpinner(spinner);
                await option.click();
                return true;
            }
        }
        return false;
    }

    /**
     * Selects the first partial match for the option text
     * @param optionText Text to search for
     * @param spinner Spinner locator
     */
    private async selectPartialMatch(
        optionText: string,
        spinner: Locator
    ): Promise<void> {
        const partialOption = this.dropdownLocator
            .locator(`div.option:has-text("${optionText}")`)
            .first();

        await partialOption.waitFor({state: 'visible'});
        await this.waitForSpinner(spinner);
        await partialOption.click();
    }

    /**
     * Selects an option from a TomSelect dropdown
     * @param optionText The text of the option to select
     */
    protected async selectTomSelectOption(optionText: string): Promise<void> {
        await this.controlLocator.click();

        await this.controlLocator.fill(optionText);

        await this.dropdownLocator.waitFor({state: 'visible'});

        // Get spinner and wait for it to disappear if present
        const spinner = this.dropdownLocator.locator('.spinner');
        await this.waitForSpinner(spinner);

        const options = this.dropdownLocator.locator('div.option');

        const exactMatchFound = await this.trySelectExactMatch(
            options,
            spinner,
            optionText
        );

        // If no exact match found, fall back to partial match
        if (!exactMatchFound) {
            await this.selectPartialMatch(optionText, spinner);
        }
    }
}
