import { Locator } from '@playwright/test';
import { BaseMealComponent } from '@meal-base/base-meal.component';
import { MEAL_SELECTORS } from '@meal-selectors/meals.selectors';
import { normalizeText } from '@shared/helpers/shared-helper';

/**
 * Represents a single meal row in the order list (cart)
 */
export class OrderMealListItem extends BaseMealComponent {
    constructor(public readonly mealRowLocator: Locator) {
        super(mealRowLocator);
    }

    /**
     * Get the name of the meal
     */
    public async getMealName(): Promise<string> {
        const nameLocator = this.mealRowLocator.getByTestId(MEAL_SELECTORS.ORDER_ITEM.MEAL_NAME);
        const text = (await nameLocator.textContent()) || '';
        return normalizeText(text);
    }

    // Stub implementations to satisfy BaseMealComponent
    public async getRestaurantName(): Promise<any> { return null; }
    public async getPricePerUnit(): Promise<string | null> { return null; }
    public async getMealType(): Promise<any> { return null; }
    public async getMealQuantity(): Promise<number | null> { return null; }
    public async getMealTime(): Promise<string | null> { return null; }
    public async hasNote(): Promise<boolean> { return false; }
    public async getNote(): Promise<string | null> { return null; }
    public async getTotalPrice(): Promise<string | null> { return null; }
}
