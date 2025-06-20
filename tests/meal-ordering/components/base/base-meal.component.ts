import {Locator} from '@playwright/test';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import {BaseMeal, Restaurant, MealType} from '@meal-models/meal-ordering.types';

/**
 * Base component providing common meal functionality implementations
 * Implements the BaseMeal interface from meal-ordering.types
 */
export abstract class BaseMealComponent
    extends BaseListItemComponent
    implements BaseMeal
{
    /**
     * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
     */
    protected normalizeText(text: string | null): string {
        if (text === null) return '';
        return text.trim().replace(/\s+/g, ' ');
    }

    /**
     * Helper to safely extract text content and normalize it
     */
    protected async safeGetText(locator: Locator): Promise<string | null> {
        try {
            const text = await locator.textContent();
            if (text === null || text.trim() === '') return null;
            return this.normalizeText(text);
        } catch (error) {
            console.error('Failed to get text content:', error);
            return null;
        }
    }

    /**
     * Get the name of the meal
     */
    abstract getMealName(): Promise<string | null>;

    /**
     * Get the restaurant name for this meal
     */
    abstract getRestaurantName(): Promise<Restaurant | null>;

    /**
     * Get the price per unit
     */
    abstract getPricePerUnit(): Promise<string | null>;

    /**
     * Get the food type from the icon
     */
    abstract getMealType(): Promise<MealType | null>;

    /**
     * Get the quantity of the meal
     */
    abstract getMealQuantity(): Promise<number | null>;

    /**
     * Get the meal time
     */
    abstract getMealTime(): Promise<string | null>;

    /**
     * Check if the meal has a note
     */
    abstract hasNote(): Promise<boolean>;

    /**
     * Get the meal note
     */
    abstract getNote(): Promise<string | null>;
}
