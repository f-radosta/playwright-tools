import { log } from '@shared/utils/config';
// Debugging utility for meal combinations
import {allOrderCombinations} from './all-combinations-data-provider';
import generateFiltersForOrder from './filter-criteria-data-provider';

// Debug allOrderCombinations
log('\n==== Debugging allOrderCombinations ====');
log(`Type of allOrderCombinations: ${typeof allOrderCombinations}`);
log(`Is array: ${Array.isArray(allOrderCombinations)}`);
log(`Length: ${allOrderCombinations?.length || 'undefined'}`);

if (Array.isArray(allOrderCombinations) && allOrderCombinations.length > 0) {
    // Show details of each order
    allOrderCombinations.forEach((order, index) => {
        log(`\nOrder ${index + 1}:`);
        log(`- Total Price: ${order.totalOrderPrice}`);
        log(`- Meal Rows: ${order.mealRows?.length || 'undefined'}`);

        if (Array.isArray(order.mealRows) && order.mealRows.length > 0) {
            order.mealRows.forEach((meal, mealIndex) => {
                log(
                    `  - Meal ${mealIndex + 1}: ${meal.quantity}x ${
                        meal.restaurantName
                    } (${meal.mealType})`
                );
            });
        } else {
            log('  - No meal rows found!');
        }

        // Test filter generation
        const withFilters = generateFiltersForOrder(order);
        log(
            `- Generated filters: ${
                Object.keys(withFilters.ordersWithFilters).length
            } items`
        );
    });
} else {
    log('⚠️ allOrderCombinations is empty or not an array!');
}

log('\n==== Debugging Complete ====');

// Export the results for import testing
export const debugResults = {
    combinationsCount: allOrderCombinations?.length || 0,
    hasData:
        Array.isArray(allOrderCombinations) && allOrderCombinations.length > 0
};
