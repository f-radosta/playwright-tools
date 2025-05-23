import { userTest } from '@auth/app-auth.fixture';
import { AppFactory } from '@shared/pages/app.factory';

userTest('Order a meal as user', async ({ app }: { app: AppFactory }) => {
    // Navigate to the current menu page
    const currentMenuPage = await app.gotoCurrentMenu();

    // Get available meals
    const availableMeals = await currentMenuPage.getAvailableMeals();

    // If there are meals available, order the first one
    if (availableMeals.length > 0) {
        await currentMenuPage.orderMealByName(availableMeals[0]);

        // Navigate to monthly billing to verify the order
        const monthlyBillingPage = await app.gotoMonthlyBilling();

        // Get ordered meals
        const orderedMeals = await monthlyBillingPage.getOrderedMeals();

        // Verify that the meal was ordered
        const today = new Date().toLocaleDateString('cs-CZ'); // Format: DD.MM.YYYY
        const orderedToday = orderedMeals.find(meal => meal.date === today && meal.name === availableMeals[0]);

        if (!orderedToday) {
            throw new Error(`Meal "${availableMeals[0]}" not found in today's orders`);
        }
    } else {
        console.log('No meals available to order');
    }
});
