import {expect} from '@playwright/test';
import {AppFactory} from '@shared-pages/app.factory';
import {OrderDTO, OrdersWithFiltersDTO} from '@meal-models/meal-ordering.types';
import {
    navigateAndFilterMeals,
    convertToMenuDTO,
    selectAndOrderMeal
} from '@meal-helpers/meal-helper';

/**
 * Processes meal orders using the provided OrdersWithFiltersDTO which contains meal rows and their associated filter criteria
 * @param app The AppFactory instance
 * @param ordersWithFilters Container with order details and their associated filter criteria
 * @returns Promise that resolves when all orders are complete
 * @throws Will throw an error if any order cannot be processed
 */
export async function processMealOrder(
    app: AppFactory,
    ordersWithFilters: OrdersWithFiltersDTO
): Promise<void> {
    // Process each order with its associated filter criteria
    for (const key in ordersWithFilters.ordersWithFilters) {
        const orderWithFilter = ordersWithFilters.ordersWithFilters[key];
        const {mealRow, filterCriteria} = orderWithFilter;

        // Convert FilterCriteriaCombination to MenuDTO
        const menuFilter = convertToMenuDTO(filterCriteria);

        // Create a minimal OrderDTO from the meal row
        const order: OrderDTO = {
            mealRows: [mealRow],
            totalOrderPrice: mealRow.totalRowPrice
        };

        // Navigate and filter meals using the helper function
        const {availableMeals, success: filterSuccess} =
            await navigateAndFilterMeals(app, menuFilter);

        expect(
            filterSuccess && availableMeals.length > 0,
            `Should find available meals for ${mealRow.name} after applying filters`
        ).toBeTruthy();

        // Order the meal using the helper function (will throw on failure)
        await selectAndOrderMeal(availableMeals, order);

        console.log(
            `Successfully processed order for ${mealRow.name} with filter criteria`
        );
    }
}

// Re-export the OrderDTO type for convenience
export type {OrderDTO} from '@meal-models/meal-ordering.types';
