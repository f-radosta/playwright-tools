import { test as authTest } from './fixtures/auth.fixture';
import { LayoutTemplatesList } from './pages/layout-templates-list.page';
import { getComponentBatches, getBatchNumber } from './utils/component-batches';
import { LayoutCubeIdsProvider } from './data/cubeIds';
import { PageCreationError } from './helpers/basic';

const batches = getComponentBatches(LayoutCubeIdsProvider, 4);
authTest.setTimeout(200000);
for (const [batchIndex, componentBatch] of batches.entries()) {
    authTest(`smoke2-${getBatchNumber(batchIndex)}`, async ({ page, login, baseUrl }) => {
        const layoutTemplatesList = new LayoutTemplatesList(page, baseUrl);
        let layoutTemplate;
        const maxRetries = 3;
        let lastError;
        
        await login();
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await layoutTemplatesList.goto();
                    layoutTemplate = await layoutTemplatesList.createLayoutTemplate({
                        name: `smoke2-${getBatchNumber(batchIndex)}-${Date.now()}`,
                    });
                    break;
                } catch (error) {
                    lastError = error;
                    if (error instanceof PageCreationError && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed, retrying template creation...`);
                        await page.waitForTimeout(1000);
                        continue;
                    }
                    throw error;
                }
            }

            for (const cubeId of componentBatch) {
                await layoutTemplate.addAndFillLayoutCube(cubeId);
            }
            await layoutTemplate.publishAndSave();
        } catch (error) {
            if (layoutTemplate) {
                console.log(`Test failed but cleaning up page: ${layoutTemplate.name}`);
                await layoutTemplatesList.deleteTemplate(layoutTemplate.name);
            }
            throw error;
        }
        if (layoutTemplate) {
            await layoutTemplatesList.deleteTemplate(layoutTemplate.name);
        }
    });
}
