import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared-components/base-list.component';
import {ListInterface} from '@shared-interfaces/list.interface';
import {OrderedMealsListItem} from '@meal-components/index';
import {findItemByName} from '@shared-helpers/shared-helper';
import {OrderedMealsDTO} from '@meal-models/meal-ordering.types';
import {OrderedMealsCompositeFilter} from '@meal-components/index';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class OrderedMealsList
    extends BaseListComponent<OrderedMealsListItem>
    implements ListInterface
{
    public readonly orderedMealsFilter: OrderedMealsCompositeFilter;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        this.orderedMealsFilter = new OrderedMealsCompositeFilter(
            this.listLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
        );
    }

    /**
     * Create a new OrderListItem from a locator
     * Required implementation of abstract method from BaseListComponent
     */
    protected createListItem(locator: Locator): OrderedMealsListItem {
        return new OrderedMealsListItem(locator);
    }

    // find ordered meal by name
    public async findOrderedMealByName(
        name: string
    ): Promise<OrderedMealsListItem | null> {
        return findItemByName<OrderedMealsListItem>(this, name);
    }

    public async getAllOrderedMealsData(): Promise<OrderedMealsDTO[]> {
        const items = await this.getItems();
        const promises = items.map(async item => {
            try {
                const [date, userName, mealName, restaurantName, quantityStr] =
                    await Promise.all([
                        item.getDate(),
                        item.getName(),
                        item.getMealName(),
                        item.getRestaurant(),
                        item.getQuantity()
                    ]);

                // Check if any required field is missing
                if (
                    !date ||
                    !userName ||
                    !mealName ||
                    !restaurantName ||
                    quantityStr === undefined
                ) {
                    console.warn(
                        'Skipping item due to missing required fields'
                    );
                    return null;
                }

                // Convert quantity to number, default to 0 if conversion fails
                const quantity =
                    typeof quantityStr === 'number'
                        ? quantityStr
                        : parseInt(quantityStr || '0', 10) || 0;

                return {
                    date,
                    userName,
                    mealName,
                    restaurantName,
                    quantity
                } as OrderedMealsDTO;
            } catch (error) {
                console.warn('Error processing ordered meal item:', error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        return results.filter((item): item is OrderedMealsDTO => item !== null);
    }
}
