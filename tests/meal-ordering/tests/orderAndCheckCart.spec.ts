import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared/pages/app.factory';
import {expect} from '@playwright/test';
import {MenuDTO} from '@meal/components/filters/menu-filter.component';
import {DateFilterComponent} from '@shared/components/filters/date-filter.component';

userTest('Order a meal and verify it appears in the cart', async ({app}: {app: AppFactory}) => {
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
    const quantity = 2;
    const note = 'Please pack one portion for takeaway';

    // Order the meal with quantity 2 and a note
    await meal.orderMeal(
        quantity,
        selectedTimeSlot,
        note
    );
    
    // Verify the order was placed by checking the quantity
    const orderedQuantity = await meal.getQuantity();
    expect(orderedQuantity).toBe(quantity);

    // Now navigate to the meal order homepage to check the cart
    console.log('Navigating to meal order homepage to check cart...');
    const mealOrderHP = await app.gotoMealOrderHP();
    
    // Get cart items from the cart list
    const cartItems = await mealOrderHP.cartList.getItems();
    expect(cartItems.length, 'Cart should have at least one item').toBeGreaterThan(0);
    
    // Find the item we just ordered
    let foundOrderedMeal = false;
    for (const cartItem of cartItems) {
        const cartItemName = await cartItem.getMealName();
        const cartItemQuantity = await cartItem.getMealQuantity();
        
        // Verify mealName is not null before using includes
        expect(mealName, 'Meal name should not be null').not.toBeNull();
        // Log the cart item details for debugging
        console.log(`XXX Cart item name: "${cartItemName}"`);
        console.log(`XXX Meal name: "${mealName}"`);
        console.log(`XXX Cart item quantity: ${cartItemQuantity}`);
        console.log(`XXX Quantity: ${quantity}`);
        
        // Both the menu item and cart item text content are now normalized
        // We can do a direct comparison or check if one contains the other
        // Log names for debugging
        console.log(`XXX Cart item name: "${cartItemName}"`);
        console.log(`XXX Meal name: "${mealName}"`);
        
        // Check for exact match or substring match
        const nameMatches = mealName === cartItemName;
        const quantityMatches = cartItemQuantity === quantity;
        
        console.log(`XXX Name matches: ${nameMatches}, Quantity matches: ${quantityMatches}`);
        
        if (nameMatches && quantityMatches) {
            foundOrderedMeal = true;
            
            // Verify all details of the cart item
            const cartItemRestaurant = await cartItem.getRestaurantName();
            
            // Log restaurant names for debugging
            console.log(`XXX Cart item restaurant: "${cartItemRestaurant}"`);
            console.log(`XXX Menu restaurant: "${restaurantName}"`);
            
            // Both strings should be normalized now, so we can do an exact comparison
            expect(cartItemRestaurant).toBe(restaurantName);
            
            const cartItemTime = await cartItem.getMealTime();
            expect(cartItemTime).toBeTruthy();
            
            // Check if note is present
            const hasNote = await cartItem.hasNote();
            expect(hasNote).toBeTruthy();
            
            if (hasNote) {
                const noteText = await cartItem.getNote();
                expect(noteText).toBeTruthy();
            }
            
            // Check price information
            const pricePerUnit = await cartItem.getPricePerUnit();
            expect(pricePerUnit).toBeTruthy();
            
            const totalPrice = await cartItem.getTotalPrice();
            expect(totalPrice).toBeTruthy();
            
            console.log(`Found ordered meal in cart: ${cartItemName} x${cartItemQuantity}`);
            break;
        }
    }
    
    expect(foundOrderedMeal, 'The ordered meal should be found in the cart').toBeTruthy();
    
    // Verify the total price in the cart
    const cartTotalPrice = await mealOrderHP.cartList.getTotalPrice();
    expect(cartTotalPrice).toContain('Kč');
    console.log(`Cart total price: ${cartTotalPrice}`);
    
    // Check the ordered-unbilled list as well
    console.log('Checking ordered-unbilled list...');
    const orderedItems = await mealOrderHP.orderedUnbilledList.getItems();
    console.log(`Found ${orderedItems.length} items in the ordered-unbilled list`);
});
