import {BasePage} from '@shared-pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';
import {RestaurantOffersList} from '@meal-components/index';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {RestaurantOfferFormPage} from '@meal-pages/restaurant-offers-form';

export class RestaurantOffersPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Nabídky restaurací'
        });
    }
    readonly createButton = () => this.page.getByRole('link', {name: 'Přidat'});

    private _restaurantOffersList: RestaurantOffersList | null = null;

    constructor(page: Page) {
        super(page);
    }

    get restaurantOffersList(): RestaurantOffersList {
        if (!this._restaurantOffersList) {
            this._restaurantOffersList = new RestaurantOffersList(
                this.page.getByTestId(
                    SHARED_SELECTORS.LIST.LIST_AND_FILTER_WRAPPER
                )
            );
        }
        return this._restaurantOffersList;
    }

    async goToAddForm(): Promise<RestaurantOfferFormPage> {
        await this.createButton().click();
        return new RestaurantOfferFormPage(this.page);
    }
}
