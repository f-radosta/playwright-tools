import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared-components/base-list.component';
import {ListInterface} from '@shared-interfaces/list.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {RestaurantOfferListItem} from '@meal-components/index';
import {RestaurantOfferCompositeFilter} from '@meal-components/index';
import {findItemByName} from '@shared-helpers/shared-helper';

export class RestaurantOffersList
    extends BaseListComponent<RestaurantOfferListItem>
    implements ListInterface
{
    public readonly restaurantOffersFilter: RestaurantOfferCompositeFilter;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        this.restaurantOffersFilter = new RestaurantOfferCompositeFilter(
            this.listLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
        );
    }

    /**
     * Create a new RestaurantOfferListItem from a locator
     * Required implementation of abstract method from BaseListComponent
     */
    protected createListItem(locator: Locator): RestaurantOfferListItem {
        return new RestaurantOfferListItem(locator);
    }

    // find restaurant offer by name
    public async findRestaurantOfferByName(
        name: string
    ): Promise<RestaurantOfferListItem | null> {
        return findItemByName<RestaurantOfferListItem>(this, name);
    }

}
