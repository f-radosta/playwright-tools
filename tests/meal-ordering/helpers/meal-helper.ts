import {
    FilterCriteriaCombinationDTO,
    MenuMeal,
    OrderDTO
} from '@meal-models/meal-ordering.types';
import {MenuDTO} from '@meal-filters/menu-filter.component';
import {generateDateRangeForDays} from '@shared-utils/date-utils';
import {expect} from '@playwright/test';
import {AppFactory} from '@shared-pages/app.factory';
import {DailyMenuList} from '@meal-models/meal-ordering.types';
import {MealListType} from '@meal-testers/meal-tester';

/**
 * Converts FilterCriteriaCombination to MenuDTO for filtering meals
 * @param filterCriteria The filter criteria to convert
 * @returns A MenuDTO object with the applied filters
 */
export function convertToMenuDTO(
    filterCriteria: FilterCriteriaCombinationDTO
): MenuDTO {
    const menuFilter: MenuDTO = {};

    if (filterCriteria.includeRestaurant && filterCriteria.restaurant) {
        menuFilter.restaurantName = filterCriteria.restaurant;
    }

    if (filterCriteria.includeFoodType && filterCriteria.foodType) {
        menuFilter.foodType = filterCriteria.foodType;
    }

    // Handle date filtering if enabled
    if (filterCriteria.includeDateRange) {
        // Generate date range string in format 'DD.MM.YYYY - DD.MM.YYYY'
        const daysToInclude = filterCriteria.daysToInclude || 1;
        const startOffset = filterCriteria.startOffset || 0;
        menuFilter.date = generateDateRangeForDays(daysToInclude, startOffset);
    }

    return menuFilter;
}

/**
 * Navigates to the current menu and applies filters to find all available meals
 * across all menu lists that match the filter criteria
 * @param app The AppFactory instance
 * @param filterCriteria The filter criteria to apply
 * @returns Object containing success status, current menu page, and array of filtered meals
 */
export async function navigateAndFilterMeals(
    app: AppFactory,
    filterCriteria: MenuDTO
) {
    const currentMenuPage = await app.gotoCurrentMenu();

    await currentMenuPage.menuList.menuFilter.filter(filterCriteria);

    const menuLists = await currentMenuPage.menuList.getDailyMenuLists();

    if (menuLists.length === 0) {
        console.warn('No menu lists found');
        return {success: false, currentMenuPage, availableMeals: []};
    }

    const allMeals: MenuMeal[] = [];

    for (const list of menuLists) {
        try {
            const meals = await list.getAvailableMeals();
            allMeals.push(...meals);
        } catch (error) {
            console.warn(`Error getting meals from menu list: ${error}`);
        }
    }

    return {
        success: allMeals.length > 0,
        currentMenuPage,
        availableMeals: allMeals
    };
}

/**
 * Orders a meal based on the provided order details
 * @param meals Array of MenuMeal objects to order from
 * @param orderDTO The order details including quantity, time slot, and note
 * @throws Will throw an error if the order cannot be placed
 */
export async function selectAndOrderMeal(
    meals: MenuMeal[],
    orderDTO: OrderDTO
): Promise<void> {
    // Validate inputs
    expect(
        meals.length,
        'At least one meal should be available for ordering'
    ).toBeGreaterThan(0);
    expect(
        orderDTO.mealRows.length,
        'At least one meal row should be provided'
    ).toBeGreaterThan(0);

    const meal = meals[0];
    const orderRow = orderDTO.mealRows[0];

    // Verify meal details before ordering
    const [mealName, restaurantName, price, foodType] = await Promise.all([
        meal.getMealName(),
        meal.getRestaurantName(),
        meal.getPricePerUnit(),
        meal.getMealType()
    ]);

    expect(mealName, 'Meal name should be available').toBeTruthy();
    expect(restaurantName, 'Restaurant name should be available').toBeTruthy();
    expect(price, 'Price should be available').toBeTruthy();
    expect(foodType, 'Food type should be available').toBeTruthy();

    console.log(
        `Ordering meal: ${mealName} from ${restaurantName} (${foodType}) for ${price}`
    );

    // Place the order
    await meal.orderMeal(
        orderRow.quantity,
        orderRow.mealTime?.toString(),
        orderRow.note
    );

    // Verify the order was placed correctly
    const orderedQuantity = await meal.getMealQuantity();
    expect(
        orderedQuantity,
        'Ordered quantity should match the requested quantity'
    ).toBe(orderRow.quantity);
}
