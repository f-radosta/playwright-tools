import {BasePage} from '@shared-pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';

export class OrderedMealAddFormPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Položka objednávky - Přidat záznam'
        });
    }

    constructor(page: Page) {
        super(page);
    }

}
