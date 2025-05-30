import {expect, Locator, Page} from '@playwright/test';
import {PageInterface} from './page.interface';

export abstract class BasePage implements PageInterface {
    readonly page: Page;

    // Navigation elements using data-test attributes
    readonly homeLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Úvodní stránka'});
    readonly trainingLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Interní školení'});
    readonly lunchOrderLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Objednání obědů'});

    // Training submenu elements
    readonly trainingListLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Seznam školení'});
    readonly trainingCategoriesLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Kategorie školení'});

    // Lunch ordering submenu elements
    readonly currentMenuLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Aktuální menu'});
    readonly monthlyBillingLink = () =>
        this.page.getByTestId('navtab').filter({hasText: 'Měsíční vyúčtování'});

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Gets the page title locator - to be overridden by subclasses
     * @returns Locator for the page title
     */
    abstract pageTitle(): Locator;

    /**
     * Verifies that the page is visible by checking the page title in the header
     * This is a common method for all pages except home page
     */
    async expectPageHeaderVisible(): Promise<void> {
        await expect(this.pageTitle()).toBeVisible();
    }

    /**
     * Waits for the page to be fully loaded and ready for interaction
     * This is a more robust approach than just checking for the page title
     */
    async waitForPageReady(): Promise<void> {
        // Wait for network to be idle first
        await this.page.waitForLoadState('networkidle');
        
        // Get the current page heading (if any)
        const headingSelector = '[data-test="module-heading"]';
        let initialHeading = null;
        
        try {
            // Try to get the current heading text
            initialHeading = await this.page.locator(headingSelector).first().textContent();
        } catch (e) {
            // No heading found, that's fine
        }
        
        if (initialHeading) {
            // If we have an initial heading, wait for it to change
            console.log(`Waiting for heading to change from: "${initialHeading}"`); 
            await this.page.evaluate(
                ([selector, text]) => {
                    return new Promise<void>((resolve) => {
                        // Check immediately
                        const checkHeading = () => {
                            const heading = document.querySelector(selector);
                            // Resolve if heading is gone or text has changed
                            if (!heading || heading.textContent !== text) {
                                resolve();
                                return true;
                            }
                            return false;
                        };
                        
                        // Check now and then set interval if not resolved
                        if (!checkHeading()) {
                            const interval = setInterval(() => {
                                if (checkHeading()) {
                                    clearInterval(interval);
                                }
                            }, 100);
                            
                            // Safety timeout after 10 seconds
                            setTimeout(() => {
                                clearInterval(interval);
                                resolve(); // Resolve anyway after timeout
                            }, 10000);
                        }
                    });
                },
                [headingSelector, initialHeading]
            );
        }
        
        // Finally, wait for any content to be visible
        await this.page.waitForSelector(
            '.wrapper--content, [data-test="module-heading"], h1, .container', 
            { state: 'visible', timeout: 5000 }
        ).catch(() => {
            console.log('No content found after timeout, continuing anyway');
        });
    }

    /**
     * Navigate to Training Categories page through the menu
     */
    async navigateToTrainingCategories(): Promise<void> {
        // Find the toggle button next to the training link
        await this.page.getByTestId('nav-toggle-training').click();
        // Click on the categories link
        await this.trainingCategoriesLink().click();
    }

    /**
     * Navigate to Training List page through the menu
     */
    async navigateToTrainingList(): Promise<void> {
        // Find the toggle button next to the training link
        await this.page.getByTestId('nav-toggle-training').click();
        // Click on the training list link
        await this.trainingListLink().click();
    }

    /**
     * Navigate to Current Menu page through the menu
     */
    async navigateToCurrentMenu(): Promise<void> {
        // Find the toggle button next to the lunch ordering link
        await this.page.getByTestId('nav-toggle-lunch').click();
        // Click on the current menu link
        await this.currentMenuLink().click();
    }

    /**
     * Navigate to Monthly Billing page through the menu
     */
    async navigateToMonthlyBilling(): Promise<void> {
        // Find the toggle button next to the lunch ordering link
        await this.page.getByTestId('nav-toggle-lunch').click();
        // Click on the monthly billing link
        await this.monthlyBillingLink().click();
    }
}
