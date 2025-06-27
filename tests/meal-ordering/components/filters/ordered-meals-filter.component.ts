import {Locator} from '@playwright/test';
import {
    DropdownFilterComponent,
    DropdownType,
    DateFilterComponent
} from '@shared-components/index';
import {CompositeFilterInterface} from '@shared-interfaces/index';
import {BaseCompositeFilterComponent} from '@shared-components/index';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';

export class OrderedMealsCompositeFilter
    extends BaseCompositeFilterComponent<OrderedMealsFilterCriteriaDTO>
    implements CompositeFilterInterface<OrderedMealsFilterCriteriaDTO>
{
    public readonly restaurantFilter: DropdownFilterComponent;
    public readonly userFilter: DropdownFilterComponent;
    public readonly dateFilter: DateFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.restaurantFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FILTER.RESTAURANT
            ),
            DropdownType.TOMSELECT
        );

        this.userFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FILTER.USER
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
     * @param orderedMealsDTO Filter criteria
     */
    async filter(orderedMealsDTO: OrderedMealsFilterCriteriaDTO): Promise<void> {
        if (orderedMealsDTO.restaurantName) {
            await this.restaurantFilter.select(orderedMealsDTO.restaurantName);
        }

        if (orderedMealsDTO.userName) {
            await this.userFilter.select(orderedMealsDTO.userName);
        }

        if (orderedMealsDTO.date) {
            await this.dateFilter.setDate(orderedMealsDTO.date);
        }

        await this.applyFilter();
    }
}

/**
 * Data transfer object for menu filtering
 */
export type OrderedMealsFilterCriteriaDTO = {
    restaurantName?: string;
    userName?: string;
    date?: string;
};
