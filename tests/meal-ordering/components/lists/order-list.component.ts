import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared/components/base-list.component';
import {ListInterface} from '@shared/components/interfaces/list.interface';
import {OrderListItem} from '../list-items/order-list-item.component';

export class OrderList
    extends BaseListComponent<OrderListItem>
    implements ListInterface
{
    public readonly itemLocators: Locator;
    
    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        // Override the default itemLocators to use our new data-test attribute
        this.itemLocators = this.listLocator
            .getByTestId('list')
            .getByTestId('list-item-date-row');
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
            .getByTestId('list')
            .getByTestId('list-item-date-row')
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
     * Get the total price of all items in the order list
     */
    public async getTotalPrice(): Promise<string> {
        const totalPriceLocator = this.listLocator.getByTestId('order-summary-total-price');
        return (await totalPriceLocator.textContent()) || '';
    }

    /**
     * Check if the order list is empty
     */
    public async isEmpty(): Promise<boolean> {
        const items = await this.getOrderItems();
        return items.length === 0;
    }
}
