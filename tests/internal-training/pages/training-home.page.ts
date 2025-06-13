import {Locator, Page} from '@playwright/test';
import {BasePage} from '@shared-pages/base-page';
import {PageInterface} from '@shared-pages/page.interface';

export class TrainingHomePage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page
            .getByRole('heading', {name: 'Interní školení'})
            .locator('span');
    }

    constructor(page: Page) {
        super(page);
    }
}
