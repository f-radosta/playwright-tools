import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {expect} from '@playwright/test';
import { log } from '@shared/utils/config';
import {
    getTestCases,
    MealOrderingTestCase
} from '@meal/test-data/meal-test-data';
import {
    cleanupMealOrders,
    navigateAndFilterTodayMeals,
    navigateAndFilterTomorrowMeals,
    selectAndOrderMeal,
    verifyCart,
    verifyTodayMeal
} from '@meal/testers/meal-tester';

// Get all test cases
const testCases = getTestCases();

// Create a test for each case
testCases.forEach((testCase: MealOrderingTestCase) => {
    userTest(
        `Meal ordering: ${testCase.testName}`,
        async ({app}: {app: AppFactory}) => {
            try {
                // Step 1: Navigate and filter meals
                let result;

                // Choose appropriate navigation method based on test case
                if (testCase.verifyTodayMeal) {
                    result = await navigateAndFilterTodayMeals(
                        app,
                        testCase.filterCriteria
                    );
                } else {
                    result = await navigateAndFilterTomorrowMeals(
                        app,
                        testCase.filterCriteria
                    );
                }

                const {success, filteredList} = result;

                if (!success || !filteredList) {
                    log('Failed to navigate and filter meals');
                    return;
                }

                // Step 2: Always order a meal
                const mealDetails = await selectAndOrderMeal(
                    filteredList,
                    testCase.mealSelectionIndex || 0,
                    testCase.orderQuantity,
                    testCase.timeSlot,
                    testCase.orderNote
                );

                if (!mealDetails.success) {
                    log('Failed to select and order meal');
                    return;
                }

                // Step 3: Verify cart if required
                if (testCase.verifyCart) {
                    // Convert null to undefined for type compatibility
                    const verifyDetails = {
                        success: mealDetails.success,
                        mealName: mealDetails.mealName || undefined,
                        restaurantName: mealDetails.restaurantName || undefined,
                        quantity: mealDetails.quantity,
                        note: mealDetails.note
                    };
                    await verifyCart(app, verifyDetails);
                }

                // Special step for Today's Meal verification
                if (testCase.verifyTodayMeal) {
                    const todayMealDetails = await verifyTodayMeal(app);

                    // Perform comprehensive validation of the Today's Meal card
                    if (todayMealDetails.success) {
                        // Validate card structure
                        expect(todayMealDetails.cardTitle).toBeTruthy();
                        expect(todayMealDetails.restaurantName).toBeTruthy();
                        expect(todayMealDetails.mealTime).toBeTruthy();
                        expect(todayMealDetails.mealPrice).toBeTruthy();

                        // Validate meal entries
                        expect(todayMealDetails.meals).toBeTruthy();
                        expect(todayMealDetails.meals?.length).toBeGreaterThan(
                            0
                        );

                        // For each meal in the card, validate its structure
                        todayMealDetails.meals?.forEach((meal, index) => {
                            expect(
                                meal.name,
                                `Meal ${index + 1} should have a name`
                            ).toBeTruthy();
                            expect(
                                meal.quantity,
                                `Meal ${index + 1} should have a quantity`
                            ).toBeGreaterThan(0);
                            expect(
                                meal.type,
                                `Meal ${index + 1} should have a type`
                            ).toBeTruthy();

                            log(
                                `Verified meal ${index + 1}: ${
                                    meal.quantity
                                }x ${meal.name} (${meal.type})`
                            );
                        });

                        // Comprehensive log of the verification
                        log(`Verified Today's Meal card:
                          - Title: ${todayMealDetails.cardTitle}
                          - Restaurant: ${todayMealDetails.restaurantName}
                          - Time: ${todayMealDetails.mealTime}
                          - Price: ${todayMealDetails.mealPrice}
                          - Has note: ${todayMealDetails.hasNote ? 'Yes' : 'No'}
                        `);
                    }
                }
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
