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
    static getDefaultFilterCriteria(): MenuDTO {
        return {
            restaurantName: 'Interní restaurace',
            foodType: 'Hlavní chod',
            date: DateFilterComponent.generateDateRangeForDays(4) // Today and next 3 days
        };
    }

    static getTestCases(): MealOrderingTestCase[] {
        return [
            {
                testName: 'Order a meal as user',
                filterCriteria: this.getDefaultFilterCriteria(),
                orderQuantity: 2,
                orderNote: 'Please pack one portion for takeaway',
                verifyCart: false
            },
            {
                testName: 'Order a meal and verify it appears in the cart',
                filterCriteria: this.getDefaultFilterCriteria(),
                orderQuantity: 2,
                orderNote: 'Please pack one portion for takeaway',
                verifyCart: true
            },
            {
                testName: 'Verify Your Meal Today card and its elements',
                filterCriteria: {
                    ...this.getDefaultFilterCriteria(),
                    date: DateFilterComponent.generateDateRangeForDays(1) // Just today
                },
                orderQuantity: 1,
                verifyCart: false,
                verifyTodayMeal: true
            }
        ];
    }
}
