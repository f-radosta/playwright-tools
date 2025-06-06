import {DateFilterComponent} from '@shared/components/filters/date-filter.component';
import {MenuDTO} from '@meal/components/filters/menu-filter.component';

export interface MealOrderingTestCase {
    testName: string;
    filterCriteria: MenuDTO;
    mealSelectionIndex?: number; // Which meal to select, default 0
    orderQuantity: number;
    orderNote?: string;
    verifyCart?: boolean;
    verifyTodayMeal?: boolean;
}

export class MealTestDataProvider {
    /**
     * Complete filter with all three criteria
     * @param daysToInclude Number of days to include in range
     * @param startOffset Days to offset from today (0=today, 1=tomorrow)
     */
    static getDefaultFilterCriteria(daysToInclude: number = 4, startOffset: number = 0): MenuDTO {
        return {
            restaurantName: 'Interní restaurace',
            foodType: 'Hlavní chod',
            date: DateFilterComponent.generateDateRangeForDays(daysToInclude, startOffset)
        };
    }
    
    /**
     * Create a filter with specific criteria
     * @param includeRestaurant Include restaurant filter
     * @param includeFoodType Include food type filter
     * @param includeDateRange Include date range filter
     * @param daysToInclude Number of days to include in range
     * @param startOffset Days to offset from today (0=today, 1=tomorrow)
     * @returns A MenuDTO with requested filters
     */
    static getCustomFilterCriteria({
        includeRestaurant = false, 
        includeFoodType = false, 
        includeDateRange = false,
        daysToInclude = 4,
        startOffset = 0,
        restaurant = 'Interní restaurace',
        foodType = 'Hlavní chod'
    } = {}): MenuDTO {
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
    static getAlternateRestaurantFilter(): MenuDTO {
        return this.getCustomFilterCriteria({
            includeRestaurant: true,
            includeFoodType: true,
            includeDateRange: true,
            restaurant: 'eŠlichta'
        });
    }

    /**
     * Helper method - get dessert filter
     */
    static getDessertFilter(): MenuDTO {
        return this.getCustomFilterCriteria({
            includeRestaurant: true,
            includeFoodType: true,
            includeDateRange: true,
            foodType: 'Dezert'
        });
    }

    /**
     * Helper method - get soup filter
     */
    static getSoupFilter(): MenuDTO {
        return this.getCustomFilterCriteria({
            includeRestaurant: true,
            includeFoodType: true,
            includeDateRange: true,
            foodType: 'Polévka'
        });
    }

    /**
     * Helper method - get weekend filter
     */
    static getWeekendFilter(): MenuDTO {
        return this.getCustomFilterCriteria({
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
    static getTomorrowFilter(): MenuDTO {
        return this.getCustomFilterCriteria({
            includeRestaurant: true,
            includeFoodType: true,
            includeDateRange: true,
            daysToInclude: 1,
            startOffset: 1
        });
    }

    static getTestCases(): MealOrderingTestCase[] {
        return [
            // Scenario 1: No filters - browse all available meals
            {
                testName: 'Browse all available meals with no filters',
                filterCriteria: this.getCustomFilterCriteria(),  // Empty object = no filters
                mealSelectionIndex: 0,
                orderQuantity: 1,
                verifyCart: true
            },
            
            // Scenario 2: Single filter - only restaurant name
            {
                testName: 'Filter by restaurant name only',
                filterCriteria: this.getCustomFilterCriteria({ includeRestaurant: true }),
                mealSelectionIndex: 0,
                orderQuantity: 2,
                orderNote: 'Testing restaurant-only filter',
                verifyCart: true
            },
            
            // Scenario 3: Single filter - only food type
            {
                testName: 'Filter by food type only',
                filterCriteria: this.getCustomFilterCriteria({ includeFoodType: true }),
                mealSelectionIndex: 1,
                orderQuantity: 1,
                verifyCart: true
            },
            
            // Scenario 4: Single filter - only date range
            {
                testName: 'Filter by date range only',
                filterCriteria: this.getCustomFilterCriteria({ includeDateRange: true }),
                mealSelectionIndex: 0,
                orderQuantity: 3,
                orderNote: 'Date-filtered meals for team',
                verifyCart: true
            },
            
            // Scenario 5: Dual filters - restaurant and food type
            {
                testName: 'Filter by restaurant and food type (no date)',
                filterCriteria: this.getCustomFilterCriteria({ 
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
                filterCriteria: this.getTomorrowFilter(),
                mealSelectionIndex: 0,
                orderQuantity: 1,
                orderNote: 'Testing tomorrow filter',
                verifyCart: true
            },
            
            // Scenario 7: Order from a different restaurant
            {
                testName: 'Order from external restaurant',
                filterCriteria: this.getAlternateRestaurantFilter(),
                orderQuantity: 1,
                verifyCart: true
            },

            // Scenario 8: Order a dessert
            {
                testName: 'Order a dessert item',
                filterCriteria: this.getDessertFilter(),
                mealSelectionIndex: 0,
                orderQuantity: 3,
                orderNote: 'No sugar please',
                verifyCart: true
            },

            // Scenario 9: Weekend meal ordering
            {
                testName: 'Order for the weekend',
                filterCriteria: this.getWeekendFilter(),
                mealSelectionIndex: 0,
                orderQuantity: 4,
                orderNote: 'Weekend family gathering',
                verifyCart: true
            },
            
            // Scenario 10: Soup ordering with specific instructions
            {
                testName: 'Order soup with special instructions',
                filterCriteria: this.getSoupFilter(),
                mealSelectionIndex: 0,
                orderQuantity: 2,
                orderNote: 'Bez cibule prosím',
                verifyCart: true
            }
        ];
    }
}
