// Global counter for deterministic meal selection in selectAndOrderMeals
// Ensures we pick nth match for each meal type/restaurant combo
export const matchCounters: Record<string, number> = {};

import { log } from '@shared/utils/config';
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
    
    // Get all available meals for the current page
    const menuMeals = availableMeals;

    log(`DEBUG - Total meals found: ${menuMeals.length}`);
    
    // Process each meal row in the order
    for (const orderRow of orderDTO.mealRows) {
        let selectedMeal: MenuMeal | null = null;
        let mealInfo: { name: string; restaurant: string; type: string; price: string } = {
            name: '',
            restaurant: '',
            type: '',
            price: ''
        };
        
        if (!selectedMeal) {
            log('DEBUG - Position-based lookup failed, trying criteria matching');
            
            // Find by restaurant and meal type criteria
            const matchingMeals = await Promise.all(
                menuMeals.map(async meal => {
                    return {
                        meal,
                        name: await meal.getMealName() || '',
                        restaurant: await meal.getRestaurantName() || '',
                        type: await meal.getMealType() || '',
                        price: await meal.getPricePerUnit() || ''
                    };
                })
            );
            
            // Find all matches by criteria
            const matches = matchingMeals.filter(info => 
                (!orderRow.restaurantName || info.restaurant === orderRow.restaurantName) &&
                (info.type === orderRow.mealType)
            );

            // Pick the nth match, where n is the current order index
            log(`DEBUG - Found ${matches.length} matches for ${orderRow.restaurantName} ${orderRow.mealType}`);
            log(`DEBUG - Order index: ${orderDTO.mealRows.indexOf(orderRow)}`);
            
            const matchKey = `${orderRow.restaurantName}|${orderRow.mealType}`;
            if (!(matchKey in matchCounters)) {
                matchCounters[matchKey] = 0;
            }
            const matchIndex = matchCounters[matchKey];
            matchCounters[matchKey]++;

            const match = matches[matchIndex];
            if (match) {
                log(`DEBUG - Found meal by criteria: ${match.name} from ${match.restaurant} [index ${matchIndex}]`);
                selectedMeal = match.meal;
            }
        }
        
        // Get all meal information if we found a matching meal
        if (selectedMeal) {
            // Get detailed meal info
            mealInfo.name = await selectedMeal.getMealName() || '';
            mealInfo.restaurant = await selectedMeal.getRestaurantName() || '';
            mealInfo.type = await selectedMeal.getMealType() || '';
            mealInfo.price = await selectedMeal.getPricePerUnit() || '';
            
            log(`DEBUG - Selected meal: ${mealInfo.name} from ${mealInfo.restaurant} (${mealInfo.type})`);
            
            // Show locator for debugging
            const locator = selectedMeal.toString();
            log(`DEBUG - Selected meal locator: ${locator}`);
            
        }
        
        // Error if no meal was found
        if (!selectedMeal) {
            throw new Error(
                `Could not find a matching meal from ${orderRow.restaurantName} of type ${orderRow.mealType}. ` +
                `Please check the meal criteria or position indices.`
            );
        }
        
        // Update the meal name and price information in the orderRow
        orderRow.name = mealInfo.name || orderRow.name;
        orderRow.pricePerUnit = mealInfo.price || undefined;
        
        // Calculate and update total row price
        if (orderRow.pricePerUnit && orderRow.quantity) {
            // Parse number from price string (e.g., "20 Kč")
            const priceValue = parseFloat(orderRow.pricePerUnit);
            const totalValue = priceValue * orderRow.quantity;
            
            // Format total price with the same format (assuming "XX Kč" format)
            const currencySuffix = orderRow.pricePerUnit.replace(/^[0-9.,\s]+/, '');
            orderRow.totalRowPrice = `${totalValue} ${currencySuffix.trim()}`;
        }
        
        log(`Found matching meal: ${mealInfo.name} from ${mealInfo.restaurant}`);
        log(`Ordering meal: ${mealInfo.name} (${mealInfo.type}) for ${mealInfo.price}`);
        
        // Place the order
        await selectedMeal.orderMeal(
            orderRow.quantity,
            orderRow.mealTime ? orderRow.mealTime.toString() : undefined,
            orderRow.note
        );
        
        // Verify the order was placed correctly
        const orderedQuantity = await selectedMeal.getMealQuantity();
        expect(
            orderedQuantity !== null,
            `Ordered quantity should be available for ${mealInfo.name}`
        ).toBeTruthy();
        
        if (orderedQuantity !== null) {
            expect(
                orderedQuantity,
                `Ordered quantity should match the requested quantity for ${mealInfo.name}`
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
        log(`Total order price calculated: ${orderDTO.totalOrderPrice}`);
    }

    //detailed log of orderDTO
    log('OrderDTO:', JSON.stringify(orderDTO, null, 2));

    // All meal data has been updated
    return orderDTO;
}
