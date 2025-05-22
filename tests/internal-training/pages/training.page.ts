import { Locator, Page } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';

export class TrainingPage extends BasePage {

    override pageTitle(): Locator {
        return this.page.getByRole('heading', { name: 'Detail školení' }).locator('span');
    }

    constructor(page: Page) {
        super(page);
    }

}
