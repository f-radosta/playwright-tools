import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {allOrderCombinations} from '@meal-test-data/all-combinations-data-provider';
import {generateFiltersForOrder} from '@meal-test-data/filter-criteria-data-provider';
import {processMealOrder, verifyCart, toOrderDTO} from '@meal-testers/combination-meal-tester';
import {cleanupMealOrders} from '@meal-testers/meal-tester';
import { log } from '@shared/utils/config';

const generateTestName = (orderIndex: number, mealCount: number): string => {
    return `${orderIndex + 1}. -> ${mealCount} meal(s)`;
};
allOrderCombinations.forEach((order, index) => {
    userTest(
        `Meal ordering with combinations: ${generateTestName(
            index,
            order.mealRows.length
        )}`,
        async ({app}: {app: AppFactory}) => {
            try {
                // Generate filter criteria for each meal in the order
                const ordersWithFilters = generateFiltersForOrder(order);

                // Log test information
                log(`\n🍽️ Processing meal combination ${index + 1}:`);
                log(`- Total meals: ${order.mealRows.length}`);
                log(`- Total price: ${order.totalOrderPrice} CZK`);

                // Log meal details
                order.mealRows.forEach((mealRow, mealIndex) => {
                    log(
                        `- Meal ${mealIndex + 1}: ${mealRow.quantity}x ${
                            mealRow.restaurantName
                        } (${mealRow.mealType})`
                    );
                });

                // Log detailed order with filters information
                log('\n=== Order with Filters ===');
                //log(`Total Order Price: ${ordersWithFilters.totalOrderPrice} CZK`);
                
                // Log each meal row with its filter criteria
                Object.entries(ordersWithFilters).forEach(([key, { mealRow, filterCriteria }]) => {
                    log(`\nMeal ${key}:`);
                    log('  Meal Details:');
                    log(`    - Restaurant: ${mealRow.restaurantName}`);
                    log(`    - Type: ${mealRow.mealType}`);
                    log(`    - Quantity: ${mealRow.quantity}`);
                    log(`    - Price per unit: ${mealRow.pricePerUnit} CZK`);
                    log(`    - Total price: ${mealRow.totalRowPrice} CZK`);
                    log(`    - Date: ${mealRow.date.toISOString().split('T')[0]}`);
                    if (mealRow.note) log(`    - Note: ${mealRow.note}`);
                    
                    log('  Filter Criteria:');
                    log(`    - Include Restaurant: ${filterCriteria.includeRestaurant}`);
                    log(`    - Include Food Type: ${filterCriteria.includeFoodType}`);
                    log(`    - Include Date Range: ${filterCriteria.includeDateRange}`);
                    if (filterCriteria.includeRestaurant) log(`    - Restaurant: ${filterCriteria.restaurant}`);
                    if (filterCriteria.includeFoodType) log(`    - Food Type: ${filterCriteria.foodType}`);
                    if (filterCriteria.includeDateRange) {
                        log(`    - Days to Include: ${filterCriteria.daysToInclude}`);
                        log(`    - Start Offset: ${filterCriteria.startOffset}`);
                    }
                });
                log('=========================\n');
                
                // Process the meal order and get the order details
                const orderDTO = await processMealOrder(app, ordersWithFilters);

                // Verify the process completed successfully
                log('✅ All meals processed successfully');

                // Verify the cart with the returned order data
                await verifyCart(app, orderDTO);

                // Cart verification completed successfully
                log('✅ Cart verification completed successfully');
            } finally {
                // Always run cleanup even if the test fails
                log('\n🧹 Running post-test meal order cleanup...');
                try {
                    await cleanupMealOrders(app);
                    log('✅ Cleanup completed successfully');
                } catch (error) {
                    console.error('❌ Cleanup failed:', error);
                }
            }
        }
    );
});
