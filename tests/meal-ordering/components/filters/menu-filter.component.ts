import {Locator} from '@playwright/test';
import {
    DropdownFilterComponent,
    DropdownType,
    DateFilterComponent
} from '@shared-components/index';
import {CompositeFilterInterface} from '@shared-interfaces/index';
import {BaseCompositeFilterComponent} from '@shared-components/index';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';

export class MenuCompositeFilter
    extends BaseCompositeFilterComponent<MenuDTO>
    implements CompositeFilterInterface<MenuDTO>
{
    public readonly restaurantFilter: DropdownFilterComponent;
    public readonly foodTypeFilter: DropdownFilterComponent;
    public readonly dateFilter: DateFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.restaurantFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FILTER.RESTAURANT
            ),
            DropdownType.TOMSELECT
        );

        this.foodTypeFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(MEAL_SELECTORS.XPATH_SELECTOR.FILTER.FOOD_TYPE),
            DropdownType.STANDARD
        );

        this.dateFilter = new DateFilterComponent(
            this.compositeFilterLocator.locator(MEAL_SELECTORS.XPATH_SELECTOR.FILTER.DATE)
        );
    }

    /**
     * Apply filters based on the provided criteria
     * @param menuDTO Filter criteria
     */
    async filter(menuDTO: MenuDTO): Promise<void> {
        if (menuDTO.restaurantName) {
            await this.restaurantFilter.select(menuDTO.restaurantName);
        }

        if (menuDTO.foodType) {
            await this.foodTypeFilter.select(menuDTO.foodType);
        }

        if (menuDTO.date) {
            await this.dateFilter.setDate(menuDTO.date);
        }

        await this.applyFilter();
    }
}

/**
 * Data transfer object for menu filtering
 */
export type MenuDTO = {
    restaurantName?: string;
    foodType?: string;
    date?: string;
};
