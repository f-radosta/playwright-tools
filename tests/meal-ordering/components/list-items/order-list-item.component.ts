import {Locator} from '@playwright/test';
import {BaseListItemComponent} from '@shared/components/base-list-item.component';
import {ListItemInterface} from '@shared/components/interfaces/list-item.interface';

export class OrderListItem extends BaseListItemComponent implements ListItemInterface {
    private dataRowLocator: Locator;
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
        // The itemLocator is the date row (with data-test="list-item-date-row")
        // Find the corresponding meal row that immediately follows this date row
        this.dataRowLocator = itemLocator.locator('+ tr[data-test="list-item-meal-row"]');
    }

    /**
     * Get all text from the list item
     */
    public async getAllText(): Promise<string> {
        const text = await this.itemLocator.textContent() || '';
        return this.normalizeText(text);
    }
    
    /**
     * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
     */
    private normalizeText(text: string): string {
        return text.trim().replace(/\s+/g, ' ');
    }

    /**
     * Click the list item
     */
    public async click(): Promise<void> {
        await this.itemLocator.click();
    }

    /**
     * Click the edit button (not implemented for cart items)
     */
    public async clickEdit(): Promise<void> {
        throw new Error('Edit action not available for cart items');
    }

    /**
     * Click the delete button (not implemented for cart items)
     */
    public async clickDelete(): Promise<void> {
        throw new Error('Delete action not available for cart items');
    }

    public async getDate(): Promise<string> {
        const dateLocator = this.itemLocator.getByTestId('order-date');
        const text = await dateLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async isToday(): Promise<boolean> {
        const todayIndicator = this.itemLocator.getByTestId('order-date-today-indicator');
        return await todayIndicator.isVisible();
    }

    public async getMealTypeIcon(): Promise<Locator> {
        return this.itemLocator.getByTestId('order-meal-type-icon');
    }

    public async getMealQuantity(): Promise<number> {
        const quantityLocator = this.dataRowLocator.getByTestId('order-meal-quantity');
        const quantityText = await quantityLocator.textContent() || '';
        // Extract the number from text like "2x"
        const match = quantityText.match(/(\d+)x/);
        return match ? parseInt(match[1], 10) : 0;
    }

    public async getMealName(): Promise<string> {
        const nameLocator = this.dataRowLocator.getByTestId('order-meal-name');
        const text = await nameLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async getRestaurantName(): Promise<string> {
        const restaurantLocator = this.dataRowLocator.getByTestId('order-restaurant-name');
        const text = await restaurantLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async getMealTime(): Promise<string> {
        const timeLocator = this.dataRowLocator.getByTestId('order-time');
        const text = await timeLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async hasNote(): Promise<boolean> {
        const noteContainer = this.dataRowLocator.getByTestId('order-note-container');
        return await noteContainer.isVisible();
    }

    public async getNote(): Promise<string | null> {
        if (!(await this.hasNote())) {
            return null;
        }
        
        const noteLocator = this.dataRowLocator.getByTestId('order-note-text');
        const text = await noteLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async getPricePerUnit(): Promise<string> {
        const priceLocator = this.dataRowLocator.getByTestId('order-price-per-unit');
        const text = await priceLocator.textContent() || '';
        return this.normalizeText(text);
    }

    public async getTotalPrice(): Promise<string> {
        const totalPriceLocator = this.dataRowLocator.getByTestId('order-total-price');
        const text = await totalPriceLocator.textContent() || '';
        return this.normalizeText(text);
    }
}
