// Forward declarations to avoid circular dependencies
export interface CurrentMenuPage {}
export interface MealOrderHPPage {}
export interface CompositeMenuList {}

/**
 * Represents the structure of a daily menu list
 */
export interface DailyMenuList {
    getMeals(): Promise<MenuMeal[]>;
    getAvailableMeals(): Promise<MenuMeal[]>;
    getDate(): Promise<Date>;
    isToday(): Promise<boolean>;
    isTomorrow(): Promise<boolean>;
}

/**
 * Represents a meal item in the menu
 */
export interface BaseMeal {
    getMealName(): Promise<string | null>;
    getRestaurantName(): Promise<string | null>;
    getPricePerUnit(): Promise<string | null>;
    getMealType(): Promise<string | null>;
    getMealQuantity(): Promise<number | null>;
    getMealTime(): Promise<string | null>;
    hasNote(): Promise<boolean>;
    getNote(): Promise<string | null>;
}

/**
 * Represents a meal item in the menu
 */
export interface MenuMeal extends BaseMeal {
    getAvailableTimeSlots(): Promise<{value: string}[]>;
    orderMeal(
        quantity: number,
        timeSlot?: string,
        note?: string
    ): Promise<void>;
}

/**
 * Represents a cart item
 */
export interface OrderListItem extends BaseMeal {
    getMealDate(): Promise<Date | null>;
    getTotalPrice(): Promise<string | null>;
}

/**
 * Data transfer object representing meal information extracted from components
 * This is used for simplified data transfer, not as a component interface
 */
export type TodayMealInfo = {
    name: string;
    quantity: number;
    type: string;
};
