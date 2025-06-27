import {BasePage} from '@shared-pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';

export class OrderedMealEditFormPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Položka objednávky - Upravit záznam'
        });
    }

    constructor(page: Page) {
        super(page);
    }

}
