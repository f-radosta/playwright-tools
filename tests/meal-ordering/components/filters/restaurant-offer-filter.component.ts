import {Locator} from '@playwright/test';
import {
    DropdownFilterComponent,
    DropdownType,
    DateFilterComponent
} from '@shared-components/index';
import {CompositeFilterInterface} from '@shared-interfaces/index';
import {BaseCompositeFilterComponent} from '@shared-components/index';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';

export class RestaurantOfferCompositeFilter
    extends BaseCompositeFilterComponent<RestaurantOfferFilterCriteriaDTO>
    implements CompositeFilterInterface<RestaurantOfferFilterCriteriaDTO>
{
    public readonly restaurantFilter: DropdownFilterComponent;
    public readonly dateFilter: DateFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.restaurantFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FILTER.RESTAURANT
            ),
            DropdownType.TOMSELECT
        );

        this.dateFilter = new DateFilterComponent(
            this.compositeFilterLocator.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FILTER.DATE
            )
        );
    }

    /**
     * Apply filters based on the provided criteria
     * @param restaurantOfferDTO Filter criteria
     */
    async filter(restaurantOfferDTO: RestaurantOfferFilterCriteriaDTO): Promise<void> {
        if (restaurantOfferDTO.restaurantName) {
            await this.restaurantFilter.select(restaurantOfferDTO.restaurantName);
        }

        if (restaurantOfferDTO.menuDateRange) {
            await this.dateFilter.setDate(restaurantOfferDTO.menuDateRange);
        }

        await this.applyFilter();
    }
}

/**
 * Data transfer object for menu filtering
 */
export type RestaurantOfferFilterCriteriaDTO = {
    restaurantName?: string;
    menuDateRange?: string;
};
