import {Locator, Page} from '@playwright/test';
import {BasePage} from '@shared/pages/base-page';
import {CategoriesList} from '@training/components';

// Custom error for duplicate category
export class DuplicateCategoryError extends Error {
    constructor(categoryName: string) {
        super(`Category "${categoryName}" already exists`);
        this.name = 'DuplicateCategoryError';
    }
}

export class CategoriesPage extends BasePage {
    // Categories page specific elements
    override pageTitle(): Locator {
        return this.page
            .getByRole('heading', {name: 'Kategorie školení'})
            .locator('span');
    }
    readonly createButton = () => this.page.getByRole('link', {name: 'Přidat'});

    // Component instances
    private _categoriesList: CategoriesList | null = null;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the categories list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get categoriesList(): CategoriesList {
        if (!this._categoriesList) {
            this._categoriesList = new CategoriesList(
                this.page.getByTestId('list-and-filter-wrapper')
            );
        }
        return this._categoriesList;
    }

    // create new category
    async createNewCategory(name: string): Promise<void> {
        await this.createButton().click();
        await this.page.getByLabel('Název kategorie školení:').fill(name);
        await this.page.getByRole('button', {name: 'Přidat'}).click();

        // After clicking submit, we need to wait for either:
        // 1. The duplicate error message to appear, or
        // 2. A successful redirect to complete

        // First, wait for navigation or network idle
        await this.page.waitForLoadState('networkidle');

        // Check for duplicate category error message with proper waiting
        const duplicateCategory = this.page.getByText(
            'Položka stejného jména již existuje'
        );

        // Wait for either the error to appear or for it to be clear we're on the categories page
        try {
            // Use a race between waiting for the error and the page header
            await Promise.race([
                duplicateCategory.waitFor({state: 'visible', timeout: 3000}),
                this.expectPageHeaderVisible().catch(() => {})
            ]);
        } catch (e) {
            // If timeout occurs, continue - we'll check visibility next
        }

        // Now check if the error is visible
        if (await duplicateCategory.isVisible()) {
            await this.page.getByRole('link', {name: 'Zpět na výpis'}).click();
            await this.expectPageHeaderVisible();
            throw new DuplicateCategoryError(name);
        }
    }
}
