import {Locator} from '@playwright/test';
import {ListItemInterface} from '@shared-components/interfaces/list-item.interface';
import {MealType, OrderListItem as OrderListItemInterface, Restaurant} from '@meal-models/meal-ordering.types';
import { getEnumValueByDisplayText } from '@shared/helpers/shared-helper';
import {BaseMealComponent} from '@meal-base/base-meal.component';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';

export class OrderListItem
    extends BaseMealComponent
    implements ListItemInterface, OrderListItemInterface
{
    private dataRowLocator: Locator;
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
        // The itemLocator is the date row (with data-test="list-item-date-row")
        // Find the corresponding meal row that immediately follows this date row
        this.dataRowLocator = itemLocator.locator(
            '+ tr[data-test="list-item-meal-row"]'
        );
    }

    /**
     * Get all text from the list item
     */
    public async getAllText(): Promise<string> {
        const text = (await this.itemLocator.textContent()) || '';
        return this.normalizeText(text);
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
        const dateLocator = this.itemLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.DATE);
        const text = (await dateLocator.textContent()) || '';
        return this.normalizeText(text);
    }

    public async isToday(): Promise<boolean> {
        const todayIndicator = this.itemLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.TODAY_INDICATOR
        );
        return await todayIndicator.isVisible();
    }

    public async getMealTypeIcon(): Promise<Locator> {
        return this.itemLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.MEAL_TYPE_ICON);
    }

    public async getMealQuantity(): Promise<number> {
        const quantityLocator = this.dataRowLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.QUANTITY
        );
        const quantityText = (await quantityLocator.textContent()) || '';
        // Extract the number from text like "2x"
        const match = quantityText.match(/(\d+)x/);
        return match ? parseInt(match[1], 10) : 0;
    }

    public async getMealName(): Promise<string> {
        const nameLocator = this.dataRowLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.MEAL_NAME);
        const text = (await nameLocator.textContent()) || '';
        return this.normalizeText(text);
    }

    public async getRestaurantName(): Promise<Restaurant | null> {
        const text = await this.dataRowLocator
            .getByTestId(MEAL_SELECTORS.ORDER_ITEM.RESTAURANT_NAME)
            .textContent();

        return getEnumValueByDisplayText(Restaurant, text);
    }

    /**
     * Get the meal time
     * @returns Time string or null
     */
    public async getMealTime(): Promise<string | null> {
        const timeLocator = this.dataRowLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.TIME);
        const text = (await timeLocator.textContent()) || '';
        const normalizedText = this.normalizeText(text);
        return normalizedText || null;
    }

    public async hasNote(): Promise<boolean> {
        const noteContainer = this.dataRowLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.NOTE.CONTAINER
        );
        return await noteContainer.isVisible();
    }

    public async getNote(): Promise<string | null> {
        if (!(await this.hasNote())) {
            return null;
        }
        const noteContainer = this.dataRowLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.NOTE.CONTAINER
        );
        // Get the value of data-bs-original-title attribute
        const note = await noteContainer.getAttribute('data-bs-original-title');
        return note || null;

        const noteLocator = this.dataRowLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.NOTE.TEXT);
        const text = (await noteLocator.textContent()) || '';
        return this.normalizeText(text);
    }

    public async getPricePerUnit(): Promise<string> {
        const priceLocator = this.dataRowLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.PRICE_PER_UNIT
        );
        const text = (await priceLocator.textContent()) || '';
        return this.normalizeText(text);
    }

    public async getTotalPrice(): Promise<string | null> {
        const totalPriceLocator =
            this.dataRowLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.TOTAL_PRICE);
        const text = (await totalPriceLocator.textContent()) || '';
        const normalizedText = this.normalizeText(text);
        return normalizedText || null;
    }

    public async getMealType(): Promise<MealType | null> {
        const foodIcon = this.dataRowLocator.getByTestId(
            MEAL_SELECTORS.ORDER_ITEM.MEAL_TYPE_ICON
        );
        const text = await foodIcon.getAttribute('aria-label');
        return getEnumValueByDisplayText(MealType, text);
    }

    /**
     * Get the meal date
     * @returns Date object or null if date cannot be parsed
     */
    public async getMealDate(): Promise<Date | null> {
        const dateLocator = this.itemLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.DATE);
        const text = (await dateLocator.textContent()) || '';
        const normalizedText = this.normalizeText(text);

        try {
            // Attempt to parse the date from the text
            // Assuming the format is something that can be parsed by Date constructor
            return new Date(normalizedText);
        } catch (error) {
            console.error(
                `Failed to parse date from: ${normalizedText}`,
                error
            );
            return null;
        }
    }
}
