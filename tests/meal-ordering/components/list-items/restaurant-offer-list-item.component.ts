import {Locator, Page} from '@playwright/test';
import {ListItemInterface} from '@shared-components/interfaces/list-item.interface';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import {RestaurantOfferFormPage} from '@meal/pages/restaurant-offers-form';

export class RestaurantOfferListItem
    extends BaseListItemComponent
    implements ListItemInterface
{
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    // TODO getters

    /**
     * Gets the name of the restaurant offer
     * @returns A promise that resolves to the name of the restaurant offer
     */
    async getName(): Promise<string | null> {
        return await this.getTextOfItemContentByIndex(0);
    }

    /**
     * Clicks the edit button and returns the edit meal order form page
     * @returns A promise that resolves when the edit button is clicked and the page is loaded
     */
    async goToEditForm(page: Page): Promise<RestaurantOfferFormPage> {
        await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.EDIT)
            .click();
        return new RestaurantOfferFormPage(page);
    }
}
