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
    getRestaurantName(): Promise<Restaurant | null>;
    getPricePerUnit(): Promise<string | null>;
    getMealType(): Promise<MealType | null>;
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
    type: MealType;
};

export enum Restaurant {
    Internal = 'Interní restaurace',
    Internal2 = 'eŠlichta',
    Tommys = "Tommy's"
}

export enum MealType {
    MainCourse = 'Hlavní chod',
    Dessert = 'Dezert',
    Soup = 'Polévka',
    Breakfast = 'Snídaně',
    Snack = 'Svačina',
    Salad = 'Salát'
}

export enum MealTime {
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30',
    '12:30 - 13:00'
}

export type MealRowDTO = {
    name?: string;
    quantity: number;
    restaurantName: Restaurant;
    pricePerUnit?: string;
    totalRowPrice?: string;
    mealType: MealType;
    mealTime?: MealTime;
    note?: string;
    date: Date;
};

export type OrderDTO = {
    mealRows: MealRowDTO[];
    totalOrderPrice?: string;
};

export type FilterCriteriaCombinationDTO = {
    includeRestaurant: boolean;
    includeFoodType: boolean;
    includeDateRange: boolean;
    restaurant?: Restaurant;
    foodType?: MealType;
    daysToInclude?: number;
    startOffset?: number;
};

/**
 * Represents an order with its corresponding filter criteria
 * The key is the meal row identifier (can be a simple index or a unique identifier)
 * The value is an object containing both the meal row and its filter criteria
 */
export type OrdersWithFilterCriteriaDTO = {
    [key: string]: {
        mealRow: MealRowDTO;
        filterCriteria: FilterCriteriaCombinationDTO;
    };
};

export type OrderedMealsDTO = {
    date: string;
    userName: string;
    mealName: string;
    restaurantName: string;
    quantity: number;
};

export enum OrderDispatchFrequency {
    OneTime = 'Odeslání jednorázově',
    Daily = 'Odeslání každý den',
    Weekly = 'Odeslání týdně',
    EbranaCanteen = 'eBRÁNA jídelna'
}

export type DayOfWeek = 
    | 'Pondělí'
    | 'Úterý'
    | 'Středa'
    | 'Čtvrtek'
    | 'Pátek'
    | 'Sobota'
    | 'Neděle';

export interface MealEntryDTO {
    mealName: string;
    mealType: string;
    price: number;
    dailyLimit?: number;
}

export interface RestaurantOfferFormDTO {
    restaurantName: string;
    menuValidity: string;
    includeWeekend: boolean;
    includeHoliday: boolean;
    name: string;
    orderDispatchFrequency: OrderDispatchFrequency;
    oneTimeOrderDispatchDate?: string; // YYYY-MM-DD format
    orderDispatchDay?: DayOfWeek; // Required when frequency is 'Odeslání týdně'
    orderDispatchTime: string; // HH:MM AM/PM format
    meals: MealEntryDTO[];
}
