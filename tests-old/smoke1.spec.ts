import { test as authTest } from './fixtures/auth.fixture';
import { WebPagesList } from './pages/web-pages-list.page';
import { getComponentBatches, getBatchNumber } from './utils/component-batches';
import { ALL_CUBE_IDS } from './data/cubeIds';
import { PageCreationError } from './helpers/basic';

const batches = getComponentBatches(ALL_CUBE_IDS, 4);
authTest.setTimeout(240000);
for (const [batchIndex, componentBatch] of batches.entries()) {
    authTest(`smoke1-${getBatchNumber(batchIndex)}`, async ({ page, login, baseUrl }) => {
        const webPagesList = new WebPagesList(page, baseUrl);
        let webPage;
        const maxRetries = 3;
        
        await login();
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await webPagesList.goto();
                    await page.waitForTimeout(batchIndex * 1500);
                    webPage = await webPagesList.createWebPage({
                        name: `smoke1-${getBatchNumber(batchIndex)}-${Date.now()}`,
                        contentTemplate: 'Stránka - prázdná',
                        layoutTemplate: 'Jednosloupec'
                    });
                    break;
                } catch (error) {
                    if (error instanceof PageCreationError && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed, retrying template creation...`);
                        await page.waitForTimeout(1000);
                        continue;
                    }
                    throw error;
                }
            }

            // Add components from this batch
            for (const cubeId of componentBatch) {
                await webPage.addAndFillCube(cubeId);
            }

            // Publish page
            await webPage.publishAndSave();
        } catch (error) {
            // If page was created but something failed during component adding
            if (webPage) {
                console.log(`Test failed but cleaning up page: ${webPage.name}`);
                await webPagesList.deletePage(webPage.name);
            }
            throw error; // Re-throw the error to mark the test as failed
        }

        // Delete page if everything succeeded
        if (webPage) {
            await webPagesList.deletePage(webPage.name);
        }
    });
}
