import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {allOrderCombinations} from '@meal-test-data/all-combinations-data-provider';
import {generateFiltersForOrder} from '@meal-test-data/filter-criteria-data-provider';
import {processMealOrder, verifyCart, toOrderDTO} from '@meal-testers/combination-meal-tester';
import {cleanupMealOrders} from '@meal-testers/meal-tester';

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
                console.log(`\n🍽️ Processing meal combination ${index + 1}:`);
                console.log(`- Total meals: ${order.mealRows.length}`);
                console.log(`- Total price: ${order.totalOrderPrice} CZK`);

                // Log meal details
                order.mealRows.forEach((mealRow, mealIndex) => {
                    console.log(
                        `- Meal ${mealIndex + 1}: ${mealRow.quantity}x ${
                            mealRow.restaurantName
                        } (${mealRow.mealType})`
                    );
                });

                // Log detailed order with filters information
                console.log('\n=== Order with Filters ===');
                //console.log(`Total Order Price: ${ordersWithFilters.totalOrderPrice} CZK`);
                
                // Log each meal row with its filter criteria
                Object.entries(ordersWithFilters).forEach(([key, { mealRow, filterCriteria }]) => {
                    console.log(`\nMeal ${key}:`);
                    console.log('  Meal Details:');
                    console.log(`    - Restaurant: ${mealRow.restaurantName}`);
                    console.log(`    - Type: ${mealRow.mealType}`);
                    console.log(`    - Quantity: ${mealRow.quantity}`);
                    console.log(`    - Price per unit: ${mealRow.pricePerUnit} CZK`);
                    console.log(`    - Total price: ${mealRow.totalRowPrice} CZK`);
                    console.log(`    - Date: ${mealRow.date.toISOString().split('T')[0]}`);
                    if (mealRow.note) console.log(`    - Note: ${mealRow.note}`);
                    
                    console.log('  Filter Criteria:');
                    console.log(`    - Include Restaurant: ${filterCriteria.includeRestaurant}`);
                    console.log(`    - Include Food Type: ${filterCriteria.includeFoodType}`);
                    console.log(`    - Include Date Range: ${filterCriteria.includeDateRange}`);
                    if (filterCriteria.includeRestaurant) console.log(`    - Restaurant: ${filterCriteria.restaurant}`);
                    if (filterCriteria.includeFoodType) console.log(`    - Food Type: ${filterCriteria.foodType}`);
                    if (filterCriteria.includeDateRange) {
                        console.log(`    - Days to Include: ${filterCriteria.daysToInclude}`);
                        console.log(`    - Start Offset: ${filterCriteria.startOffset}`);
                    }
                });
                console.log('=========================\n');
                
                // Process the meal order and get the order details
                const orderDTO = await processMealOrder(app, ordersWithFilters);

                // Verify the process completed successfully
                console.log('✅ All meals processed successfully');

                // Verify the cart with the returned order data
                await verifyCart(app, orderDTO);

                // Cart verification completed successfully
                console.log('✅ Cart verification completed successfully');
            } finally {
                // Always run cleanup even if the test fails
                console.log('\n🧹 Running post-test meal order cleanup...');
                try {
                    await cleanupMealOrders(app);
                    console.log('✅ Cleanup completed successfully');
                } catch (error) {
                    console.error('❌ Cleanup failed:', error);
                }
            }
        }
    );
});
