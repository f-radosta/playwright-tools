import {BasePage} from '@shared-pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';
import {OrderedMealsList} from '@meal-components/index';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {OrderedMealAddFormPage} from '@meal/pages/ordered-meal-add-form';

export class OrderedMealsPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Položka objednávky - Výpis položek objednávky'
        });
    }
    readonly createButton = () => this.page.getByRole('link', {name: 'Přidat'});

    private _orderedMealsList: OrderedMealsList | null = null;

    constructor(page: Page) {
        super(page);
    }

    get orderedMealsList(): OrderedMealsList {
        if (!this._orderedMealsList) {
            this._orderedMealsList = new OrderedMealsList(
                this.page.getByTestId(
                    SHARED_SELECTORS.LIST.LIST_AND_FILTER_WRAPPER
                )
            );
        }
        return this._orderedMealsList;
    }

    async goToAddForm(): Promise<OrderedMealAddFormPage> {
        await this.createButton().click();
        return new OrderedMealAddFormPage(this.page);
    }
}
