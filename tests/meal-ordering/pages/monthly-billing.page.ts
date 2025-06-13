import {BasePage} from '@shared-pages/base-page';
import {Locator} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';

export class MonthlyBillingPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Měsíční vyúčtování restauracím'
        });
    }
}
