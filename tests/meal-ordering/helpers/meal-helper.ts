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

    await app.page.reloadPage(); // prevents filters unexpected behavior

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
 * Orders meals that match the provided order details
 * @param availableMeals Array of MenuMeal objects to order from
 * @param orderDTO The order details including quantity, time slot, and note
 * @throws Will throw an error if the order cannot be placed
 */
export async function selectAndOrderMeals(
    availableMeals: MenuMeal[],
    orderDTO: OrderDTO
): Promise<OrderDTO> {
    // Validate inputs
    expect(
        availableMeals.length,
        'At least one meal should be available for ordering'
    ).toBeGreaterThan(0);
    expect(
        orderDTO.mealRows.length,
        'At least one meal row should be provided'
    ).toBeGreaterThan(0);
    
    // Process each meal row in the order
    for (const orderRow of orderDTO.mealRows) {
        // Get meal info for all available meals
        const mealInfoPromises = availableMeals.map(async meal => {
            const [name, restaurant, price, type] = await Promise.all([
                meal.getMealName(),
                meal.getRestaurantName(),
                meal.getPricePerUnit(),
                meal.getMealType()
            ]);
            return { meal, name, restaurant, price, type };
        });

        const mealInfoArray = await Promise.all(mealInfoPromises);
        
        // Try to find a meal that matches the orderRow
        console.log(`Looking for meal from ${orderRow.restaurantName} of type ${orderRow.mealType}`);
        
        // Log available meals for debugging
        console.log(`Found ${mealInfoArray.length} available meals:`);
        mealInfoArray.forEach((info, idx) => {
            console.log(`Meal ${idx + 1}: ${info.name} from ${info.restaurant} (${info.type})`);
        });
        
        // Find meals that match the required properties from MealRowDTO
        const matchingMeals = mealInfoArray.filter(info => {
            // Restaurant is required to match
            const restaurantMatches = info.restaurant === orderRow.restaurantName;
            
            // Match meal type if possible
            let mealTypeMatches = true;
            if (orderRow.mealType && info.type) {
                mealTypeMatches = info.type.includes(orderRow.mealType.toString());
            }
            
            const matches = restaurantMatches && mealTypeMatches;
            console.log(`Meal ${info.name}: restaurant match: ${restaurantMatches}, type match: ${mealTypeMatches}, overall: ${matches}`);
            return matches;
        });
        
        // Get the first matching meal (if multiple match our criteria)
        const matchingMeal = matchingMeals.length > 0 ? matchingMeals[0] : null;
        console.log(`Found ${matchingMeals.length} matching meals in total`);
        
        if (!matchingMeal) {
            throw new Error(
                `Could not find a matching meal from ${orderRow.restaurantName} of type ${orderRow.mealType}. ` +
                `Available meals: ${mealInfoArray.map(m => `${m.name} (${m.restaurant}, ${m.type})`).join(', ')}`
            );
        }
        
        // Update the meal name and price information in the orderRow
        orderRow.name = matchingMeal.name || orderRow.name;
        orderRow.pricePerUnit = matchingMeal.price || undefined;
        
        // Calculate and update total row price
        if (orderRow.pricePerUnit && orderRow.quantity) {
            // Parse number from price string (e.g., "20 Kč")
            const priceValue = parseFloat(orderRow.pricePerUnit);
            const totalValue = priceValue * orderRow.quantity;
            
            // Format total price with the same format (assuming "XX Kč" format)
            const currencySuffix = orderRow.pricePerUnit.replace(/^[0-9.,\s]+/, '');
            orderRow.totalRowPrice = `${totalValue} ${currencySuffix.trim()}`;
        }
        
        console.log(`Found matching meal: ${matchingMeal.name} from ${matchingMeal.restaurant}`);
        console.log(`Ordering meal: ${matchingMeal.name} (${matchingMeal.type}) for ${matchingMeal.price}`);
        
        // Place the order
        await matchingMeal.meal.orderMeal(
            orderRow.quantity,
            orderRow.mealTime ? orderRow.mealTime.toString() : undefined,
            orderRow.note
        );
        
        // Verify the order was placed correctly
        const orderedQuantity = await matchingMeal.meal.getMealQuantity();
        expect(
            orderedQuantity !== null,
            `Ordered quantity should be available for ${matchingMeal.name}`
        ).toBeTruthy();
        
        if (orderedQuantity !== null) {
            expect(
                orderedQuantity,
                `Ordered quantity should match the requested quantity for ${matchingMeal.name}`
            ).toBe(orderRow.quantity);
        }
    }

    // Calculate total order price based on all meal rows
    let totalPrice = 0;
    let currencySuffix = '';

    // Sum up all row prices
    orderDTO.mealRows.forEach(row => {
        if (row.totalRowPrice) {
            // Extract numeric value for calculation 
            const rowPrice = parseFloat(row.totalRowPrice);
            totalPrice += rowPrice;
            
            // Get currency suffix from first available row
            if (!currencySuffix) {
                currencySuffix = row.totalRowPrice.replace(/^[0-9.,\s]+/, '').trim();
            }
        }
    });

    // Format total order price
    if (totalPrice > 0) {
        orderDTO.totalOrderPrice = `${totalPrice} ${currencySuffix}`;
        console.log(`Total order price calculated: ${orderDTO.totalOrderPrice}`);
    }

    //detailed log of orderDTO
    console.log('OrderDTO:', JSON.stringify(orderDTO, null, 2));

    // All meal data has been updated
    return orderDTO;
}
