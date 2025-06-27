import { OrderDTO } from '@meal-models/meal-ordering.types';
import { AppFactory } from '@shared-pages/app.factory';
import { OrderedMealsPage } from '@meal-pages/ordered-meals.page';

function extractDateNumbers(date: Date | string): string {
    // Convert to string if it's a Date object
    const dateStr = date instanceof Date ? date.toLocaleDateString('cs-CZ') : date;
    
    // Extract numbers from formats like "pátek 27.6." or "pá 27.06."
    const match = dateStr.match(/(\d{1,2})\.(\d{1,2})/);
    if (!match) return '';
    
    // Return day and month as DD.MM
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    return `${day}.${month}`;
}

export async function compareOrders(app: AppFactory, order: OrderDTO): Promise<void> {
    const orderedMealsPage = await app.gotoOrderedMeals();
    const orderedMeals = await orderedMealsPage.orderedMealsList.getAllOrderedMealsData();

    // Verify we have the same number of meals
    if (order.mealRows.length !== orderedMeals.length) {
        throw new Error(
            `Expected ${order.mealRows.length} meals, found ${orderedMeals.length}`
        );
    }

    // Sort both arrays for consistent comparison
    const expected = [...order.mealRows].sort((a, b) => 
        `${a.name}-${a.restaurantName}`.localeCompare(`${b.name}-${b.restaurantName}`)
    );
    
    const actual = [...orderedMeals].sort((a, b) =>
        `${a.mealName}-${a.restaurantName}`.localeCompare(`${b.mealName}-${b.restaurantName}`)
    );

    // Compare each meal
    for (let i = 0; i < expected.length; i++) {
        const expectedMeal = expected[i];
        const actualMeal = actual[i];

        // Simple field comparisons
        if (expectedMeal.name !== actualMeal.mealName) {
            throw new Error(`Meal name mismatch: expected "${expectedMeal.name}", got "${actualMeal.mealName}"`);
        }

        if (expectedMeal.restaurantName !== actualMeal.restaurantName) {
            throw new Error(`Restaurant mismatch: expected "${expectedMeal.restaurantName}", got "${actualMeal.restaurantName}"`);
        }

        if (expectedMeal.quantity !== actualMeal.quantity) {
            throw new Error(`Quantity mismatch: expected ${expectedMeal.quantity}, got ${actualMeal.quantity}`);
        }
        
        // Compare dates by day and month only
        const expectedDate = expectedMeal.date ? extractDateNumbers(expectedMeal.date) : '';
        const actualDate = actualMeal.date ? extractDateNumbers(actualMeal.date) : '';
        
        if (expectedDate && actualDate && expectedDate !== actualDate) {
            throw new Error(`Date mismatch: expected ${expectedDate}, got ${actualDate}`);
        }
    }
}
