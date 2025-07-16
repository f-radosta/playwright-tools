import {expect, Locator} from '@playwright/test';
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

                expect(date).toBeTruthy();
                expect(userName).toBeTruthy();
                expect(mealName).toBeTruthy();
                expect(restaurantName).toBeTruthy();
                expect(quantityStr).toBeTruthy();
                if (quantityStr === null) {
                    throw new Error('Quantity is null');
                }
                
                // Remove 'x' prefix if present and parse the quantity
                const quantityValue = quantityStr.replace(/^x\s*/, '');
                const quantity = parseInt(quantityValue, 10);
                
                if (isNaN(quantity)) {
                    throw new Error(`Failed to parse quantity from: ${quantityStr}`);
                }

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
