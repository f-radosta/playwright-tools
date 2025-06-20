// Debugging utility for meal combinations
import {allOrderCombinations} from './all-combinations-data-provider';
import generateFiltersForOrder from './filter-criteria-data-provider';

// Debug allOrderCombinations
console.log('\n==== Debugging allOrderCombinations ====');
console.log(`Type of allOrderCombinations: ${typeof allOrderCombinations}`);
console.log(`Is array: ${Array.isArray(allOrderCombinations)}`);
console.log(`Length: ${allOrderCombinations?.length || 'undefined'}`);

if (Array.isArray(allOrderCombinations) && allOrderCombinations.length > 0) {
    // Show details of each order
    allOrderCombinations.forEach((order, index) => {
        console.log(`\nOrder ${index + 1}:`);
        console.log(`- Total Price: ${order.totalOrderPrice}`);
        console.log(`- Meal Rows: ${order.mealRows?.length || 'undefined'}`);

        if (Array.isArray(order.mealRows) && order.mealRows.length > 0) {
            order.mealRows.forEach((meal, mealIndex) => {
                console.log(
                    `  - Meal ${mealIndex + 1}: ${meal.quantity}x ${
                        meal.restaurantName
                    } (${meal.mealType})`
                );
            });
        } else {
            console.log('  - No meal rows found!');
        }

        // Test filter generation
        const withFilters = generateFiltersForOrder(order);
        console.log(
            `- Generated filters: ${
                Object.keys(withFilters.ordersWithFilters).length
            } items`
        );
    });
} else {
    console.log('⚠️ allOrderCombinations is empty or not an array!');
}

console.log('\n==== Debugging Complete ====');

// Export the results for import testing
export const debugResults = {
    combinationsCount: allOrderCombinations?.length || 0,
    hasData:
        Array.isArray(allOrderCombinations) && allOrderCombinations.length > 0
};
