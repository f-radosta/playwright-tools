import {Locator} from '@playwright/test';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {BaseListComponent} from '@shared-components/base-list.component';
import {ListInterface} from '@shared-interfaces/list.interface';
import {OrderListItem} from '@meal-components/index';
import {OrderMealListItem} from '@meal-components/list-items/order-meal-list-item.component';
import {normalizeText} from '@shared-helpers/shared-helper';

export class OrderList
    extends BaseListComponent<OrderListItem>
    implements ListInterface
{
    public readonly itemLocators: Locator;
    
    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        // Override the default itemLocators to use our new data-test attribute
        this.itemLocators = this.listLocator
            .getByTestId(SHARED_SELECTORS.LIST)
            .getByTestId(MEAL_SELECTORS.ORDER_ITEM.LIST_ITEM_DATE_ROW);
    }

    /**
     * Create a new OrderListItem from a locator
     * Required implementation of abstract method from BaseListComponent
     */
    protected createListItem(locator: Locator): OrderListItem {
        return new OrderListItem(locator);
    }

    /**
     * Get all order items in this list
     */
    public async getOrderItems(): Promise<OrderListItem[]> {
        // Find all rows with date information using the specific data-test attribute
        const dateRows = await this.listLocator
            .getByTestId(SHARED_SELECTORS.LIST)
            .getByTestId(MEAL_SELECTORS.ORDER_ITEM.LIST_ITEM_DATE_ROW)
            .all();
        
        // Create OrderListItem instances from these date rows
        return dateRows.map(row => this.createListItem(row));
    }

    /**
     * Get a specific order item by index
     */
    public async getOrderItem(index: number): Promise<OrderListItem> {
        const items = await this.getOrderItems();
        if (index < 0 || index >= items.length) {
            throw new Error(`OrderListItem index out of range: ${index}`);
        }
        return items[index];
    }

    /**
     * Get all meal items in the cart (each <tr data-test="list-item-meal-row">)
     */
    public async getAllMealItems(): Promise<OrderMealListItem[]> {
        const mealRows = await this.listLocator
            .getByTestId(SHARED_SELECTORS.LIST)
            .getByTestId(MEAL_SELECTORS.ORDER_ITEM.LIST_ITEM_MEAL_ROW)
            .all();
        return mealRows.map(row => new OrderMealListItem(row));
    }

    /**
     * Get the total price of all items in the order list
     */
    public async getTotalPrice(): Promise<string> {
        const totalPriceLocator = this.listLocator.getByTestId(MEAL_SELECTORS.PAGE.ORDER_SUMMARY_TOTAL_PRICE);
        const text = (await totalPriceLocator.textContent()) || '';
        return normalizeText(text);
    }

    /**
     * Check if the order list is empty
     */
    public async isEmpty(): Promise<boolean> {
        const items = await this.getOrderItems();
        return items.length === 0;
    }
}
