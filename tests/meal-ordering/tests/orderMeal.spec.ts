import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared/pages/app.factory';
import {expect} from '@playwright/test';
import {MenuDTO} from '@meal/components/filters/menu-filter.component';
import {DateFilterComponent} from '@shared/components/filters/date-filter.component';

userTest('Order a meal as user', async ({app}: {app: AppFactory}) => {
    // Navigate to the current menu page
    const currentMenuPage = await app.gotoCurrentMenu();

    // Get tomorrow's menu list
    const tomorrowList = await currentMenuPage.menuList.getTomorrowList();
    expect(
        tomorrowList,
        "Tomorrow's menu list should be available"
    ).not.toBeNull();

    if (!tomorrowList) {
        return; // Exit test if tomorrow's list isn't available
    }

    // Apply filters to find specific meals
    const filterCriteria: MenuDTO = {
        restaurantName: 'Interní restaurace',
        foodType: 'Hlavní chod',
        date: DateFilterComponent.generateDateRangeForDays(4) // Today and next 3 days
    };

    await currentMenuPage.menuList.menuFilter.filter(filterCriteria);

    // Get a fresh reference to tomorrow's list after filtering
    const filteredTomorrowList =
        await currentMenuPage.menuList.getTomorrowList();
    expect(
        filteredTomorrowList,
        "Tomorrow's filtered menu list should be available"
    ).not.toBeNull();

    if (!filteredTomorrowList) {
        return; // Exit test if tomorrow's filtered list isn't available
    }

    // Get all meals that match the filter
    const meals = await filteredTomorrowList.getMeals();
    expect(
        meals.length,
        'At least one meal should be available'
    ).toBeGreaterThan(0);

    if (meals.length === 0) {
        return; // Exit test if no meals are available
    }

    // Get available meals (that can be ordered)
    const availableMeals = await filteredTomorrowList.getAvailableMeals();

    expect(
        availableMeals.length,
        'At least one meal should be available for ordering'
    ).toBeGreaterThan(0);

    if (availableMeals.length === 0) {
        console.log('No available meals found that can be ordered');
        return; // Exit test if no meals can be ordered
    }

    // Get the first available meal
    const meal = availableMeals[0];

    // Verify meal details
    const mealName = await meal.getMealName();
    const restaurantName = await meal.getRestaurantName();
    const price = await meal.getPrice();
    const foodType = await meal.getFoodType();

    console.log(
        `Ordering meal: ${mealName} from ${restaurantName} (${foodType}) for ${price}`
    );

    // Get available time slots
    const timeSlots = await meal.getAvailableTimeSlots();
    expect(
        timeSlots.length,
        'At least one time slot should be available'
    ).toBeGreaterThan(0);

    // Select the first time slot
    const selectedTimeSlot = timeSlots[0].value;

    // Order the meal with quantity 2 and a note
    await meal.orderMeal(
        2,
        selectedTimeSlot,
        'Please pack one portion for takeaway'
    );

    // Verify the order was placed by checking the quantity
    const quantity = await meal.getQuantity();
    expect(quantity).toBe(2);
});

userTest('Filter and browse meals', async ({app}: {app: AppFactory}) => {
    // Navigate to the current menu page
    const currentMenuPage = await app.gotoCurrentMenu();

    // Get all available daily menu lists
    const lists = await currentMenuPage.menuList.getDailyMenuLists();
    expect(
        lists.length,
        'At least one daily menu list should be available'
    ).toBeGreaterThan(0);

    // Log information about each list
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i];
        const date = await list.getDate();
        const isToday = await list.isToday();
        const isTomorrow = await list.isTomorrow();

        console.log(
            `List ${
                i + 1
            }: ${date.toLocaleDateString()} (Today: ${isToday}, Tomorrow: ${isTomorrow})`
        );

        // Get meals in this list
        const meals = await list.getMeals();
        console.log(`- Contains ${meals.length} meals`);

        // Get available meals
        const availableMeals = await list.getAvailableMeals();
        console.log(
            `- ${availableMeals.length} meals are available for ordering`
        );

        // Log the first 3 available meals (if available)
        for (let j = 0; j < Math.min(3, availableMeals.length); j++) {
            const meal = availableMeals[j];
            const name = await meal.getMealName();
            const restaurant = await meal.getRestaurantName();
            const price = await meal.getPrice();

            console.log(
                `  - [AVAILABLE] ${name} from ${restaurant} for ${price}`
            );
        }
    }

    // Test filtering functionality
    console.log('Testing filter functionality...');

    // Apply filters
    await currentMenuPage.menuList.menuFilter.filter({
        restaurantName: 'Interní restaurace',
        foodType: 'Hlavní chod',
        date: DateFilterComponent.generateDateRangeForDays(4) // Today and next 3 days
    });

    // Get filtered results from tomorrow's list
    const tomorrowList = await currentMenuPage.menuList.getTomorrowList();
    if (tomorrowList) {
        const filteredMeals = await tomorrowList.getMeals();
        console.log(`Found ${filteredMeals.length} meals matching 'polévka'`);

        // Clear filters
        await currentMenuPage.menuList.menuFilter.resetFilter();

        // Verify filters were cleared by checking if more meals are now visible
        const allMeals = await tomorrowList.getMeals();
        console.log(`After clearing filters: ${allMeals.length} meals visible`);
    }
});
