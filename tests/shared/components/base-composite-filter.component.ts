import {Locator} from '@playwright/test';
import {CompositeFilterInterface} from '@shared/components/interfaces/composite-filter.interface';

export abstract class BaseCompositeFilterComponent<T>
    implements CompositeFilterInterface<T>
{
    public readonly locator: Locator;

    constructor(locator: Locator) {
        this.locator = locator;
    }

    abstract filter(DTO: T): Promise<void>;

    async resetFilter() {
        await this.locator.getByLabel('Resetovat filtr').click();
    }

    /**
     * Apply the filter and wait for the filtering operation to complete
     * This ensures that the filtered results are ready before proceeding
     */
    protected async applyFilter() {
        const page = this.locator.page();

        // Create a promise that will resolve when navigation/network is complete
        const navigationPromise = page.waitForLoadState('networkidle');

        // Click the filter button
        await this.locator.getByLabel('Filtrovat').click();

        // Wait for navigation to complete or network to become idle
        await navigationPromise;

        // Additional wait to ensure DOM is fully rendered
        await page.waitForTimeout(500);
    }
}
