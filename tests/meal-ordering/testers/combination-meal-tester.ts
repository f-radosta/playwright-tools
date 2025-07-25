import {expect} from '@playwright/test';
import { log } from '@shared/utils/config';
import {AppFactory} from '@shared-pages/app.factory';
import type {
    OrderDTO,
    OrdersWithFilterCriteriaDTO,
    OrderListItem as OrderListItemInterface,
    MealRowDTO,
} from '@meal-models/meal-ordering.types';
import {
    navigateAndFilterMeals,
    convertToMenuDTO,
    selectAndOrderMeals
} from '@meal-helpers/meal-helper';
import { OrderMealListItem } from '../components/list-items/order-meal-list-item.component';

/**
 * Processes meal orders using the provided OrdersWithFiltersDTO which contains meal rows and their associated filter criteria
 * @param app The AppFactory instance
 * @param ordersWithFilters Container with order details and their associated filter criteria
 * @returns Promise that resolves when all orders are complete
 * @throws Will throw an error if any order cannot be processed
 */
function calculateTotalOrderPrice(processedMeals: MealRowDTO[]): string | undefined {
    const sum = processedMeals.reduce((acc, meal) => {
        if (meal.totalRowPrice) {
            // Remove currency and spaces, parse as float
            const num = parseFloat(meal.totalRowPrice.replace(/[^\d.,-]/g, '').replace(',', '.'));
            if (!isNaN(num)) acc += num;
        }
        return acc;
    }, 0);
    if (sum > 0) {
        // Use the currency from the last meal if available
        const currencyMatch = processedMeals.map(m => m.totalRowPrice).filter(Boolean).pop()?.match(/[^\d.,\s]+/);
        return `${Math.round(sum)}${currencyMatch ? ` ${currencyMatch[0]}` : ''}`;
    }
    return undefined;
}

export async function processMealOrder(
    app: AppFactory,
    ordersWithFilters: OrdersWithFilterCriteriaDTO
): Promise<OrderDTO> {
    const processedMeals: MealRowDTO[] = [];
    let lastTotalOrderPrice: string | undefined;
    
    // Process each order with its associated filter criteria
    for (const key in ordersWithFilters) {
        const orderWithFilter = ordersWithFilters[key];
        const {mealRow, filterCriteria} = orderWithFilter;

        // Convert FilterCriteriaCombination to MenuDTO
        const menuFilter = convertToMenuDTO(filterCriteria);

        // Create a single meal order for this iteration
        const order: OrderDTO = {
            mealRows: [mealRow]
        };

        // Navigate to current menu and filter meals
        const {availableMeals, success: filterSuccess} = await navigateAndFilterMeals(
            app,
            menuFilter
        );

        // Verify we have meals to order
        expect(
            filterSuccess && availableMeals.length > 0,
            `Expected to find available meals matching ${JSON.stringify(
                menuFilter
            )}`
        ).toBeTruthy();

        // Order the meal and get updated order with actual meal names
        const orderResult = await selectAndOrderMeals(availableMeals, order);
        
        // Store the calculated total price from the last result
        if (orderResult.totalOrderPrice) {
            lastTotalOrderPrice = orderResult.totalOrderPrice;
        }

        // Process all meal rows from the result
        // And update the name from what's actually displayed in the UI
        for (const updatedMealRow of orderResult.mealRows) {
            const processedMeal: MealRowDTO = {
                ...mealRow,
                name: updatedMealRow.name,
                pricePerUnit: updatedMealRow.pricePerUnit,
                totalRowPrice: updatedMealRow.totalRowPrice
            };
            processedMeals.push(processedMeal);
        }
    }

    // Calculate total price by summing totalRowPrice of all processed meals
    const totalOrderPrice = calculateTotalOrderPrice(processedMeals);
    return {
        mealRows: processedMeals,
        totalOrderPrice
    };
}

// Re-export the OrderDTO type for convenience
export type {OrderDTO} from '@meal-models/meal-ordering.types';

/**
 * Converts OrdersWithFiltersDTO to OrderDTO by extracting the meal rows and using the total price
 */
export function toOrderDTO(ordersWithFilters: OrdersWithFilterCriteriaDTO): OrderDTO {
    const mealRows = Object.values(ordersWithFilters).map(
        item => item.mealRow
    );

    return {
        mealRows
    };
}

/**
 * Verifies that the cart contains all the meals from the given order
 * @param app The AppFactory instance
 * @param order The order to verify in the cart
 */
export async function verifyCart(
    app: AppFactory,
    order: OrderDTO
): Promise<void> {
    log('Navigating to meal order homepage to verify cart...');
    const mealOrderHP = await app.gotoMealOrderHP();

    // Get all meal items in the cart (each meal row)
    const cartMealItems: OrderMealListItem[] = await mealOrderHP.cartList.getAllMealItems();

    // Count meal names in both cart and order
    const cartNames = await Promise.all(cartMealItems.map(item => item.getMealName()));
    const orderNames = order.mealRows.map(row => row.name);
    log('DEBUG - Meal names in cart:', cartNames);
    log('DEBUG - Meal names in order:', orderNames);
    expect(
        cartNames.length,
        `Expected ${orderNames.length} meal names in cart, found ${cartNames.length}`
    ).toBe(orderNames.length);

    // Verify each meal in the order exists in the cart
    for (const mealRow of order.mealRows) {
        let foundMeal = null;
        
        // for loop with await with an async callback
        for (const cartItem of cartMealItems) {
            const cartItemName = await cartItem.getMealName();
            const cartItemQuantity = await cartItem.getMealQuantity();

            // Basic match on name and quantity
            if (cartItemName === mealRow.name && cartItemQuantity === mealRow.quantity) {
                foundMeal = cartItem;
                break;
            }
        }

        expect(
            foundMeal,
            `Expect meal "${mealRow.name}" x${mealRow.quantity} to be in cart`
        ).toBeDefined();

        if (!foundMeal) continue;

        // Verify restaurant
        const cartItemRestaurant = await foundMeal.getRestaurantName();
        expect(
            cartItemRestaurant,
            `Verify restaurant for ${mealRow.name}`
        ).toBe(mealRow.restaurantName);

        // Verify meal type
        const cartItemMealType = await foundMeal.getMealType();
        expect(cartItemMealType, `Verify meal type for ${mealRow.name}`).toBe(
            mealRow.mealType
        );

        // Verify meal time if specified in the order
        if (mealRow.mealTime) {
            const cartItemTime = await foundMeal.getMealTime();
            expect(cartItemTime, `Verify time slot for ${mealRow.name}`).toBe(
                mealRow.mealTime
            );
        }

        // Verify note if present
        if (mealRow.note) {
            const hasNote = await foundMeal.hasNote();
            expect(hasNote, `Verify note for ${mealRow.name}`).toBeTruthy();

            if (hasNote) {
                const noteText = await foundMeal.getNote();
                expect(noteText, `Verify note for ${mealRow.name}`).toBe(
                    mealRow.note
                );
            }
        }

        // Verify prices
        const pricePerUnit = await foundMeal.getPricePerUnit();
        expect(
            pricePerUnit,
            `Verify price per unit for ${mealRow.name}`
        ).toBeTruthy();
        expect(
            pricePerUnit,
            `Verify price per unit for ${mealRow.name}`
        ).toContain(mealRow.pricePerUnit);

        const totalPrice = await foundMeal.getTotalPrice();
        expect(
            totalPrice,
            `Verify total price for ${mealRow.name}`
        ).toBeTruthy();
        expect(
            totalPrice,
            `Verify total price for ${mealRow.name}`
        ).toContain(mealRow.totalRowPrice);

        log(
            `✓ Verified meal in cart: ${mealRow.name} x${mealRow.quantity}`
        );
    }

    // Verify total cart price
    const cartTotalPrice = await mealOrderHP.cartList.getTotalPrice();
    expect(cartTotalPrice, 'Verify cart total price').toBeTruthy();
    expect(cartTotalPrice, 'Verify cart total price').toContain(
        order.totalOrderPrice
    );
    log(`✓ Verified cart total price: ${cartTotalPrice}`);

    // Log ordered-unbilled list status for reference
    const orderedItems = await mealOrderHP.orderedUnbilledList.getItems();
    log(
        `Found ${orderedItems.length} items in the ordered-unbilled list`
    );
}