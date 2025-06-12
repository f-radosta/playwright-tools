import {DateFilterComponent} from '@shared-filters/date-filter.component';
import {MenuDTO} from '@meal-filters/menu-filter.component';

export interface MealOrderingTestCase {
    testName: string;
    filterCriteria: MenuDTO;
    mealSelectionIndex?: number; // Which meal to select, default 0
    orderQuantity: number;
    orderNote?: string;
    verifyCart?: boolean;
    verifyTodayMeal?: boolean;
}

interface FilterCriteriaOptions {
    includeRestaurant?: boolean;
    includeFoodType?: boolean;
    includeDateRange?: boolean;
    daysToInclude?: number;
    startOffset?: number;
    restaurant?: string;
    foodType?: string;
}

/**
 * Complete filter with all three criteria
 * @param daysToInclude Number of days to include in range
 * @param startOffset Days to offset from today (0=today, 1=tomorrow)
 */
export function getDefaultFilterCriteria(daysToInclude: number = 4, startOffset: number = 0): MenuDTO {
    return {
        restaurantName: 'Interní restaurace',
        foodType: 'Hlavní chod',
        date: DateFilterComponent.generateDateRangeForDays(daysToInclude, startOffset)
    };
}

/**
 * Get custom filter criteria based on provided options
 * @param options Filter configuration options
 * @returns A MenuDTO with requested filters
 */
export function getCustomFilterCriteria({
    includeRestaurant = false, 
    includeFoodType = false, 
    includeDateRange = false,
    daysToInclude = 4,
    startOffset = 0,
    restaurant = 'Interní restaurace',
    foodType = 'Hlavní chod'
}: FilterCriteriaOptions = {}): MenuDTO {
    const filter: MenuDTO = {};
    
    if (includeRestaurant) {
        filter.restaurantName = restaurant;
    }
    
    if (includeFoodType) {
        filter.foodType = foodType;
    }
    
    if (includeDateRange) {
        filter.date = DateFilterComponent.generateDateRangeForDays(daysToInclude, startOffset);
    }
    
    return filter;
}

/**
 * Helper method - get alternative restaurant filter
 */
export function getAlternateRestaurantFilter(): MenuDTO {
    return getCustomFilterCriteria({
        includeRestaurant: true,
        includeFoodType: true,
        includeDateRange: true,
        restaurant: 'eŠlichta'
    });
}

/**
 * Helper method - get dessert filter
 */
export function getDessertFilter(): MenuDTO {
    return getCustomFilterCriteria({
        includeRestaurant: true,
        includeFoodType: true,
        includeDateRange: true,
        foodType: 'Dezert'
    });
}

/**
 * Helper method - get soup filter
 */
export function getSoupFilter(): MenuDTO {
    return getCustomFilterCriteria({
        includeRestaurant: true,
        includeFoodType: true,
        includeDateRange: true,
        foodType: 'Polévka'
    });
}

/**
 * Helper method - get weekend filter
 */
export function getWeekendFilter(): MenuDTO {
    return getCustomFilterCriteria({
        includeRestaurant: true,
        includeFoodType: true,
        includeDateRange: true,
        daysToInclude: 2, 
        startOffset: DateFilterComponent.getDaysToNextWeekend()
    });
}

/**
 * Helper method - get tomorrow filter
 */
export function getTomorrowFilter(): MenuDTO {
    return getCustomFilterCriteria({
        includeRestaurant: true,
        includeFoodType: true,
        includeDateRange: true,
        daysToInclude: 1,
        startOffset: 1
    });
}

export function getTestCases(): MealOrderingTestCase[] {
    return [
        // Scenario 1: No filters - browse all available meals
        {
            testName: 'Browse all available meals with no filters',
            filterCriteria: getCustomFilterCriteria(),
            mealSelectionIndex: 0,
            orderQuantity: 1,
            verifyCart: true
        },
        
        // Scenario 2: Single filter - only restaurant name
        {
            testName: 'Filter by restaurant name only',
            filterCriteria: getCustomFilterCriteria({ includeRestaurant: true }),
            mealSelectionIndex: 0,
            orderQuantity: 2,
            orderNote: 'Testing restaurant-only filter',
            verifyCart: true
        },
        
        // Scenario 3: Single filter - only food type
        {
            testName: 'Filter by food type only',
            filterCriteria: getCustomFilterCriteria({ includeFoodType: true }),
            mealSelectionIndex: 1,
            orderQuantity: 1,
            verifyCart: true
        },
        
        // Scenario 4: Single filter - only date range
        {
            testName: 'Filter by date range only',
            filterCriteria: getCustomFilterCriteria({ includeDateRange: true }),
            mealSelectionIndex: 0,
            orderQuantity: 3,
            orderNote: 'Date-filtered meals for team',
            verifyCart: true
        },
        
        // Scenario 5: Dual filters - restaurant and food type
        {
            testName: 'Filter by restaurant and food type (no date)',
            filterCriteria: getCustomFilterCriteria({ 
                includeRestaurant: true, 
                includeFoodType: true 
            }),
            mealSelectionIndex: 0,
            orderQuantity: 2,
            verifyCart: true
        },
        
        // Scenario 6: All filters for tomorrow only
        {
            testName: 'Order meal for tomorrow only',
            filterCriteria: getTomorrowFilter(),
            mealSelectionIndex: 0,
            orderQuantity: 1,
            orderNote: 'Testing tomorrow filter',
            verifyCart: true
        },
        
        // Scenario 7: Order from a different restaurant
        {
            testName: 'Order from external restaurant',
            filterCriteria: getAlternateRestaurantFilter(),
            orderQuantity: 1,
            verifyCart: true
        },

        // Scenario 8: Order a dessert
        {
            testName: 'Order a dessert item',
            filterCriteria: getDessertFilter(),
            mealSelectionIndex: 0,
            orderQuantity: 3,
            orderNote: 'No sugar please',
            verifyCart: true
        },

        // Scenario 9: Weekend meal ordering
        {
            testName: 'Order for the weekend',
            filterCriteria: getWeekendFilter(),
            mealSelectionIndex: 0,
            orderQuantity: 4,
            orderNote: 'Weekend family gathering',
            verifyCart: true
        },

        // Scenario 10: Soup ordering with specific instructions
        {
            testName: 'Order soup with special instructions',
            filterCriteria: getSoupFilter(),
            mealSelectionIndex: 0,
            orderQuantity: 2,
            orderNote: 'Bez cibule prosím',
            verifyCart: true
        }
    ];
}
