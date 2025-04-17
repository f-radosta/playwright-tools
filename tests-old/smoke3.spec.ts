import { test as authTest } from './fixtures/auth.fixture';
import { LayoutTemplatesList } from './pages/layout-templates-list.page';
import { ContentTemplatesList } from './pages/content-templates-list.page';
import { HeaderTemplatesList } from './pages/header-templates-list.page';
import { FormTemplatesList } from './pages/form-templates-list.page';
import { PageCreationError } from './helpers/basic';

authTest.setTimeout(100000);

// @group: layout-templates
authTest.describe('Layout Templates', () => {
    authTest('create and delete layout template', async ({ page, login, baseUrl }) => {
        await login();
        const layoutTemplatesList = new LayoutTemplatesList(page, baseUrl);
        let layoutTemplate;
        const maxRetries = 3;
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await layoutTemplatesList.goto();
                    layoutTemplate = await layoutTemplatesList.createLayoutTemplate({
                        name: 'smoke3-'+Date.now()
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
});

// @group: content-templates
authTest.describe('Content Templates', () => {
    authTest('create and delete content template', async ({ page, login, baseUrl }) => {
        await login();
        const contentTemplatesList = new ContentTemplatesList(page, baseUrl);
        let contentTemplate;
        const maxRetries = 3;
        //let lastError;
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await contentTemplatesList.goto();
                    contentTemplate = await contentTemplatesList.createContentTemplate({
                        name: 'smoke3-'+Date.now()
                    });
                    break;
                } catch (error) {
                    //lastError = error;
                    if (error instanceof PageCreationError && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed, retrying template creation...`);
                        await page.waitForTimeout(1000);
                        continue;
                    }
                    throw error;
                }
            }
        
            await contentTemplate.publishAndSave();
        } catch (error) {
            if (contentTemplate) {
                console.log(`Test failed but cleaning up page: ${contentTemplate.name}`);
                await contentTemplatesList.deleteTemplate(contentTemplate.name);
            }
            throw error;
        }
        if (contentTemplate) {
            await contentTemplatesList.deleteTemplate(contentTemplate.name);
        }
    });
});

// @group: header-templates
authTest.describe('Header Templates', () => {
    authTest('create and delete header template', async ({ page, login, baseUrl }) => {
        await login();
        const headerTemplatesList = new HeaderTemplatesList(page, baseUrl);
        let headerTemplate;
        const maxRetries = 3;
        // let lastError;
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await headerTemplatesList.goto();
                    headerTemplate = await headerTemplatesList.createHeaderTemplate({
                        name: 'smoke3-'+Date.now()
                    });
                    break;
                } catch (error) {
                    //lastError = error;
                    if (error instanceof PageCreationError && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed, retrying template creation...`);
                        await page.waitForTimeout(1000);
                        continue;
                    }
                    throw error;
                }
            }
        
            await headerTemplate.publishAndSave();
        } catch (error) {
            if (headerTemplate) {
                console.log(`Test failed but cleaning up page: ${headerTemplate.name}`);
                await headerTemplatesList.deleteTemplate(headerTemplate.name);
            }
            throw error;
        }
        if (headerTemplate) {
            await headerTemplatesList.deleteTemplate(headerTemplate.name);
        }
    });
});

// @group: form-templates
authTest.describe('Form Templates', () => {
    authTest('create and delete form template', async ({ page, login, baseUrl }) => {
        await login();
        const formTemplatesList = new FormTemplatesList(page, baseUrl);
        let formTemplate;
        try {
            const maxRetries = 3;
            // let lastError;
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    await formTemplatesList.goto();
                    formTemplate = await formTemplatesList.createFormTemplate({
                        name: 'smoke3-'+Date.now()
                    });
                    break;
                } catch (error) {
                    //lastError = error;
                    if (error instanceof PageCreationError && attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed, retrying template creation...`);
                        await page.waitForTimeout(1000);
                        continue;
                    }
                    throw error;
                }
            }

            await formTemplate.publishAndSave();
        } catch (error) {
            if (formTemplate) {
                console.log(`Test failed but cleaning up page: ${formTemplate.name}`);
                await formTemplatesList.deleteTemplate(formTemplate.name);
            }
            throw error;
        }
        if (formTemplate) {
            await formTemplatesList.deleteTemplate(formTemplate.name);
        }
    });
});
