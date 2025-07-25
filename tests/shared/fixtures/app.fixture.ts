import {test as base} from '@playwright/test';
import {AppFactory} from '@shared-pages/app.factory';
import {BasePage} from '@shared-pages/base-page';

// Shared state between tests
const sharedState = {
    ordersToCheck: [] as any[]
};

// Extend the test fixtures with app
export type AppFixtures = {
    app: AppFactory;
    sharedData: { ordersToCheck: any[] };
};

// Create a fixture for the AppFactory
export const test = base.extend<AppFixtures>({
    sharedData: async ({}, use) => {
        // Use the shared state
        await use(sharedState);
    },
    app: async ({page}, use) => {
        // First navigate to the base URL to ensure the page is loaded
        await page.goto('/');

        // Create a BasePage instance
        const basePage = new BasePage(page);

        // Create an AppFactory instance
        const app = new AppFactory(basePage);

        // Use the AppFactory in the test
        await use(app);
    }
});

// Re-export the expect function
export {expect} from '@playwright/test';
