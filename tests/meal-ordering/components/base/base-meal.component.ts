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
