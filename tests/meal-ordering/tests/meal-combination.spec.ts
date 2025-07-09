import {adminTest, userTest} from '@auth/app-auth.fixture';
import {AppFixtures} from '@shared/fixtures/app.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {test} from '@playwright/test';

// Type for test functions that use both AppFactory and AppFixtures
type TestFunction = (args: { app: AppFactory } & AppFixtures) => Promise<void>;
import {allOrderCombinations} from '@meal-test-data/all-combinations-data-provider';
import {generateFiltersForOrder} from '@meal-test-data/filter-criteria-data-provider';
import {processMealOrder, verifyCart, toOrderDTO, OrderDTO} from '@meal-testers/combination-meal-tester';
import {cleanupMealOrders} from '@meal-helpers/meal-helper';
import { log } from '@shared/utils/config';
import { mergeOrders, verifyOrders } from '@meal/testers/ordered-meals-tester';

adminTest(
    'Pre-test meal ordering cleanup',
    async ({app}: {app: AppFactory} & AppFixtures) => {
        log('\n🧹 Running pre-test meal order cleanup...');
        await cleanupMealOrders(app);
        log('✅ Cleanup completed successfully');
    }
);

const generateTestName = (orderIndex: number, mealCount: number): string => {
    return `${orderIndex + 1}. -> ${mealCount} meal(s)`;
};
// Configure tests to run in a single worker with increased timeout
// This ensures shared state works correctly
test.describe.configure({ 
    mode: 'serial',
    timeout: 5 * 60 * 1000 // 5 minutes timeout for the whole test suite
});

//const ordComb = [allOrderCombinations[0]];
allOrderCombinations.forEach((order, index) => {
    // Define the test function with proper typing
    const testFn: TestFunction = async ({app, sharedData}) => {
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

        sharedData.ordersToCheck.push(orderDTO);

        log('ordersToCheck length: ' + sharedData.ordersToCheck.length);

        // Verify the process completed successfully
        log('✅ All meals processed successfully');

        // // Verify the cart with the returned order data
        // await verifyCart(app, orderDTO);

        // // Cart verification completed successfully
        // log('✅ Cart verification completed successfully');
    };

    userTest(
        `Meal ordering with combinations: ${generateTestName(index, order.mealRows.length)}`,
        testFn
    );
});

// This test must run after all the ordering tests
userTest('User cart check', async ({app, sharedData}) => {
    log('\nUser cart check...');
    if (!sharedData.ordersToCheck.length) {
        throw new Error('No orders to check');
    }
    const mergedOrders = mergeOrders(sharedData.ordersToCheck);
    await verifyCart(app, mergedOrders);
    log('✅ User cart check completed successfully');
});

adminTest('Admin order check', async ({app, sharedData}) => {
    log('\nAdmin order check...');
    if (!sharedData.ordersToCheck.length) {
        throw new Error('No orders to check');
    }
    const mergedOrders = mergeOrders(sharedData.ordersToCheck);
    await verifyOrders(app, mergedOrders);
    log('✅ Admin order check completed successfully');
});

adminTest(
    'Post-test meal ordering cleanup',
    async ({app}: {app: AppFactory} & AppFixtures) => {
        log('\n🧹 Running post-test meal order cleanup...');
        await cleanupMealOrders(app);
        log('✅ Cleanup completed successfully');
    }
);
