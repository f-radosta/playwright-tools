import {expect, Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class BasePage implements PageInterface {
    readonly page: Page;

    // Navigation elements using data-test attributes
    readonly homeLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Úvodní stránka'});
    readonly trainingLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Interní školení'});
    readonly lunchOrderLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Objednání obědů'});

    // Training submenu elements
    readonly trainingListLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Seznam školení'});
    readonly trainingCategoriesLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Kategorie školení'});
    readonly departmentsLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Číselník oddělení'});

    // Lunch ordering submenu elements
    readonly currentMenuLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Aktuální menu'});
    readonly monthlyBillingLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Měsíční vyúčtování'});
    readonly orderedMealsLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Objednaná jídla'});
    readonly restaurantOffersLink = () =>
        this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.NAVTAB).filter({hasText: 'Nabídky restaurací'});

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Gets the page title locator - to be overridden by subclasses
     * @returns Locator for the page title
     */
    pageTitle(): Locator {
        throw new Error(' pageTitle() must be implemented by subclasses');
    }

    /**
     * Verifies that the page is visible by checking the page title in the header
     * This is a common method for all pages except home page
     */
    async expectPageHeaderVisible(): Promise<void> {
        await expect(this.pageTitle()).toBeVisible();
    }

    /**
     * Performs navigation and waits for the page to be ready
     * This captures the URL before navigation and ensures proper waiting after navigation
     * @param navigationFn Function that performs the actual navigation action
     * @param requireRedirect If true, will throw an error if the URL doesn't change after navigation
     */
    async navigateAndWait(
        navigationFn: () => Promise<void>,
        requireRedirect = true
    ): Promise<void> {
        // Capture the current URL before navigation
        const startUrl = this.page.url();
        //console.log(`XXX Starting navigation from URL: ${startUrl}`);

        // Perform the navigation action
        await navigationFn();

        // Wait for network to be idle
        await this.page.waitForLoadState('networkidle');

        // Check if URL has changed
        let currentUrl = this.page.url();
        if (currentUrl !== startUrl) {
            //console.log(`XXX URL changed to: ${currentUrl}`);
        } else {
            //console.log(`XXX URL remained the same: ${currentUrl}`);

            // If redirect is required but URL didn't change, wait a bit more and check again
            if (requireRedirect) {
                //console.log('XXX Waiting for potential delayed redirect...');

                // Try waiting for URL changes for up to 5 seconds
                const maxWaitTime = 5000;
                const startWaitTime = Date.now();

                while (Date.now() - startWaitTime < maxWaitTime) {
                    // Wait a bit
                    await this.page.waitForTimeout(300);

                    // Check URL again
                    currentUrl = this.page.url();
                    if (currentUrl !== startUrl) {
                        //console.log(`XXX URL changed after waiting to: ${currentUrl}`);
                        break;
                    }

                    // Also check for network activity
                    await this.page
                        .waitForLoadState('networkidle', {timeout: 500})
                        .catch(() => {});
                }

                // If URL still hasn't changed after waiting, throw error
                if (currentUrl === startUrl) {
                    throw new Error(
                        `Navigation failed: URL did not change from ${startUrl} after waiting`
                    );
                }
            }
        }

        // Wait for content to be visible
        //console.log('XXX Waiting for content to be visible...');
        await this.page
            .waitForSelector('.wrapper--content', {
                state: 'visible',
                timeout: 5000
            })
            .catch(() => {
                //console.log('XXX No content found after timeout, continuing anyway');
            });

        // Additional wait for any animations to complete
        await this.page.waitForTimeout(300);

        //console.log('XXX Page is ready for interaction');
    }

    /**
     * Navigate to Training Categories page through the menu
     */
    async navigateToTrainingCategories(): Promise<void> {
        // Check if the categories link is already visible
        const isVisible = await this.trainingCategoriesLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_TRAINING).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the categories link
        await this.trainingCategoriesLink().click();
    }

    /**
     * Navigate to Training List page through the menu
     */
    async navigateToTrainingList(): Promise<void> {
        // Check if the training list link is already visible
        const isVisible = await this.trainingListLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_TRAINING).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the training list link
        await this.trainingListLink().click();
    }

    /**
     * Navigate to Current Menu page through the menu
     */
    async navigateToCurrentMenu(): Promise<void> {
        // Check if the current menu link is already visible
        const isVisible = await this.currentMenuLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_LUNCH).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the current menu link
        await this.currentMenuLink().click({ timeout: 10000 });
    }

    /**
     * Navigate to Monthly Billing page through the menu
     */
    async navigateToMonthlyBilling(): Promise<void> {
        // Check if the monthly billing link is already visible
        const isVisible = await this.monthlyBillingLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_LUNCH).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the monthly billing link
        await this.monthlyBillingLink().click();
    }

    /**
     * Navigate to Ordered Meals page through the menu
     */
    async navigateToOrderedMeals(): Promise<void> {
        // Check if the ordered meals link is already visible
        const isVisible = await this.orderedMealsLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_LUNCH).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the ordered meals link
        await this.orderedMealsLink().click();
    }

    /**
     * Navigate to Restaurant Offers page through the menu
     */
    async navigateToRestaurantOffers(): Promise<void> {
        // Check if the restaurant offers link is already visible
        const isVisible = await this.restaurantOffersLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_LUNCH).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the restaurant offers link
        await this.restaurantOffersLink().click();
    }

    /**
     * Reloads the current page
     */
    async reloadPage(): Promise<void> {
        await this.page.reload();
    }

    /**
     * Waits for a specified amount of time
     * @param timeout The amount of time to wait in milliseconds
     */
    async waitForTimeout(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Navigate to Departments page through the menu
     */
    async navigateToDepartments(): Promise<void> {
        // Check if the departments link is already visible
        const isVisible = await this.departmentsLink().isVisible()
            .catch(() => false);
        
        // Only toggle if the link isn't already visible
        if (!isVisible) {
            await this.page.getByTestId(SHARED_SELECTORS.NAVIGATION.TOGGLE_TRAINING).click();
            // Small wait to allow menu to expand
            await this.page.waitForTimeout(100);
        }
        
        // Click on the departments link
        await this.departmentsLink().click();
    }
}
