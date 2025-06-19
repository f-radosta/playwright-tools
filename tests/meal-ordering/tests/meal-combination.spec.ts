import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {allOrderCombinations} from '@meal/test-data/all-combinations-data-provider';
import generateFiltersForOrder from '@meal/test-data/filter-criteria-data-provider';
import {processMealOrder} from '@meal/testers/combination-meal-tester';
import {cleanupMealOrders} from '@meal/testers/meal-tester';

const generateTestName = (orderIndex: number, mealCount: number): string => {
    return `Meal combination ${orderIndex + 1}: ${mealCount} meal(s)`;
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

                // Process the order with its filter criteria
                await processMealOrder(app, ordersWithFilters);

                // Verify the process completed successfully
                console.log('✅ All meals processed successfully');
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
