import {expect} from '@playwright/test';
import {AppFactory} from '@shared/pages/app.factory';
import {MenuDTO} from '@meal/components/filters/menu-filter.component';
import {
    BaseMeal,
    DailyMenuList,
    OrderListItem as OrderListItemInterface,
    TodayMealInfo
} from '@meal/models/meal-ordering.types';
import {OrderListItem as OrderListItemComponent} from '@meal/components/list-items/order-list-item.component';

/**
 * Type adapter helpers to convert between component instances and model interfaces
 */
export class MealTypeAdapter {
    /**
     * Convert component OrderListItem to model OrderListItem interface
     */
    static toOrderListItemModel(
        component: OrderListItemComponent
    ): OrderListItemInterface {
        return component;
    }

    /**
     * Convert array of component OrderListItems to array of model OrderListItem interfaces
     */
    static toOrderListItemModelArray(
        components: OrderListItemComponent[]
    ): OrderListItemInterface[] {
        return components as unknown as OrderListItemInterface[];
    }
}

// Date type for meal lists
export enum MealListType {
    TODAY = 'today',
    TOMORROW = 'tomorrow'
}

export class MealOrderingHelper {
    /**
     * Navigate to menu and filter for today's meals
     */
    static async navigateAndFilterTodayMeals(
        app: AppFactory,
        filterCriteria: MenuDTO
    ) {
        return this.navigateAndFilterMeals(
            app,
            filterCriteria,
            MealListType.TODAY
        );
    }

    /**
     * Navigate to menu and filter for tomorrow's meals
     */
    static async navigateAndFilterTomorrowMeals(
        app: AppFactory,
        filterCriteria: MenuDTO
    ) {
        return this.navigateAndFilterMeals(
            app,
            filterCriteria,
            MealListType.TOMORROW
        );
    }

    /**
     * General method for navigating and filtering meals by specific list type
     * @private Internal implementation - use specific methods instead
     */
    private static async navigateAndFilterMeals(
        app: AppFactory,
        filterCriteria: MenuDTO,
        listType: MealListType
    ) {
        // Navigate to the current menu page
        const currentMenuPage = await app.gotoCurrentMenu();

        // Get the appropriate menu list based on type
        const getListMethod =
            listType === MealListType.TODAY
                ? currentMenuPage.menuList.getTodayList.bind(
                      currentMenuPage.menuList
                  )
                : currentMenuPage.menuList.getTomorrowList.bind(
                      currentMenuPage.menuList
                  );

        const menuList = await getListMethod();
        expect(
            menuList,
            `${listType}'s menu list should be available`
        ).not.toBeNull();

        if (!menuList) {
            return {success: false, currentMenuPage, filteredList: null};
        }

        // Apply filters
        await currentMenuPage.menuList.menuFilter.filter(filterCriteria);

        // Get fresh reference after filtering
        const filteredList = await getListMethod();
        expect(
            filteredList,
            'Filtered menu list should be available'
        ).not.toBeNull();

        return {
            success: !!filteredList,
            currentMenuPage,
            filteredList
        };
    }

    static async selectAndOrderMeal(
        filteredList: DailyMenuList,
        mealIndex: number = 0,
        quantity: number = 1,
        note?: string
    ) {
        // Get available meals
        const availableMeals = await filteredList.getAvailableMeals();

        expect(
            availableMeals.length,
            'At least one meal should be available for ordering'
        ).toBeGreaterThan(0);

        if (availableMeals.length === 0) {
            return {success: false};
        }

        // Get the meal to order
        const meal = availableMeals[mealIndex];

        // Get and log meal details
        const mealName = await meal.getMealName();
        const restaurantName = await meal.getRestaurantName();
        const price = await meal.getPricePerUnit();
        const foodType = await meal.getMealType();

        console.log(
            `Ordering meal: ${mealName} from ${restaurantName} (${foodType}) for ${price}`
        );

        // Get time slots
        const timeSlots = await meal.getAvailableTimeSlots();
        expect(
            timeSlots.length,
            'At least one time slot should be available'
        ).toBeGreaterThan(0);

        if (timeSlots.length === 0) {
            return {success: false};
        }

        // Select first time slot
        const selectedTimeSlot = timeSlots[0].value;

        // Order the meal
        await meal.orderMeal(quantity, selectedTimeSlot, note);

        // Verify order placement
        const orderedQuantity = await meal.getMealQuantity();
        expect(orderedQuantity).toBe(quantity);

        return {
            success: true,
            mealName,
            restaurantName,
            price,
            foodType,
            quantity,
            selectedTimeSlot,
            note
        };
    }

    static async verifyCart(
        app: AppFactory,
        mealDetails: {
            success: boolean;
            mealName?: string;
            restaurantName?: string;
            quantity?: number;
            note?: string;
        }
    ) {
        // Navigate to meal order homepage
        console.log('Navigating to meal order homepage to check cart...');
        const mealOrderHP = await app.gotoMealOrderHP();

        // Get cart items (convert component types to model types)
        const cartItemComponents = await mealOrderHP.cartList.getItems();
        const cartItems: OrderListItemInterface[] =
            MealTypeAdapter.toOrderListItemModelArray(cartItemComponents);
        expect(
            cartItems.length,
            'Cart should have at least one item'
        ).toBeGreaterThan(0);

        // Find our ordered meal
        let foundOrderedMeal = false;

        for (const cartItem of cartItems) {
            const cartItemName = await cartItem.getMealName();
            const cartItemQuantity = await cartItem.getMealQuantity();

            // Log details for debugging
            console.log(`Cart item name: "${cartItemName}"`);
            console.log(`Meal name: "${mealDetails.mealName}"`);
            console.log(`Cart item quantity: ${cartItemQuantity}`);
            console.log(`Quantity: ${mealDetails.quantity}`);

            // Check if this is our meal
            const nameMatches = mealDetails.mealName === cartItemName;
            const quantityMatches = cartItemQuantity === mealDetails.quantity;

            console.log(
                `Name matches: ${nameMatches}, Quantity matches: ${quantityMatches}`
            );

            if (nameMatches && quantityMatches) {
                foundOrderedMeal = true;

                // Verify additional details
                const cartItemRestaurant = await cartItem.getRestaurantName();

                // Log restaurant names for debugging
                console.log(`Cart item restaurant: "${cartItemRestaurant}"`);
                console.log(`Menu restaurant: "${mealDetails.restaurantName}"`);

                expect(cartItemRestaurant).toBe(mealDetails.restaurantName);

                const cartItemTime = await cartItem.getMealTime();
                expect(cartItemTime).toBeTruthy();

                // Check if note is present
                const hasNote = await cartItem.hasNote();
                if (mealDetails.note) {
                    expect(hasNote).toBeTruthy();

                    if (hasNote) {
                        const noteText = await cartItem.getNote();
                        expect(noteText).toBeTruthy();
                    }
                }

                // Check price information
                const pricePerUnit = await cartItem.getPricePerUnit();
                expect(pricePerUnit).toBeTruthy();

                const totalPrice = await cartItem.getTotalPrice();
                expect(totalPrice).toBeTruthy();

                console.log(
                    `Found ordered meal in cart: ${cartItemName} x${cartItemQuantity}`
                );
                break;
            }
        }

        expect(
            foundOrderedMeal,
            'The ordered meal should be found in the cart'
        ).toBeTruthy();

        // Verify the total price in the cart
        const cartTotalPrice = await mealOrderHP.cartList.getTotalPrice();
        expect(cartTotalPrice).toContain('Kč');
        console.log(`Cart total price: ${cartTotalPrice}`);

        // Check the ordered-unbilled list as well
        console.log('Checking ordered-unbilled list...');
        const orderedItems = await mealOrderHP.orderedUnbilledList.getItems();
        console.log(
            `Found ${orderedItems.length} items in the ordered-unbilled list`
        );

        return {success: foundOrderedMeal, mealOrderHP};
    }

    static async verifyTodayMeal(app: AppFactory) {
        // Navigate to the meal order homepage where Today's Meal card would be shown
        const mealOrderHP = await app.gotoMealOrderHP();

        // Get the Today's Meal card component
        const todayMealCard = mealOrderHP.getTodayMealCard();

        // Check if Today's Meal card exists
        expect(
            todayMealCard,
            "Today's meal card should be visible"
        ).toBeTruthy();

        if (!todayMealCard) {
            return {success: false};
        }

        // Verify card title
        const cardTitle = await todayMealCard.getTitle();
        expect(
            cardTitle,
            "Today's meal card title should be present"
        ).toBeTruthy();
        console.log(`Card title: ${cardTitle}`);

        // Get all meal rows
        const mealRows = await todayMealCard.getMealRows();
        expect(
            mealRows.length,
            'Card should have at least one meal'
        ).toBeGreaterThan(0);
        console.log(`Found ${mealRows.length} meals on the card`);

        // Collect comprehensive meal information using the extractMealData helper
        const meals = [];
        for (let i = 0; i < mealRows.length; i++) {
            // Get all meal data at once
            const mealData = await todayMealCard.extractMealData(i);

            // Validate required fields
            expect(
                mealData.name,
                `Meal name should be present for meal at index ${i}`
            ).toBeTruthy();
            expect(
                mealData.quantity,
                `Meal quantity should be present for meal at index ${i}`
            ).toBeTruthy();
            expect(
                mealData.type,
                `Meal type should be present for meal at index ${i}`
            ).toBeTruthy();

            console.log(
                `Meal ${i + 1}: ${mealData.quantity}x ${mealData.name} (${
                    mealData.type
                })`
            );

            if (
                mealData.name === null ||
                mealData.quantity === null ||
                mealData.type === null
            ) {
                throw new Error(
                    `Meal name, quantity, or type is null for meal at index ${i}`
                );
            }

            meals.push(mealData);
        }

        // Extract detailed information from the first meal for compatibility with existing tests
        let restaurantName = null;
        let mealTime = null;
        let mealPrice = null;
        let hasNote = false;
        let noteText = null;

        if (meals.length > 0) {
            const firstMeal = meals[0];

            // Verify restaurant name
            restaurantName = firstMeal.restaurantName;
            expect(restaurantName).toBeTruthy();
            console.log(`Restaurant: ${restaurantName}`);

            // Verify meal time
            mealTime = firstMeal.time;
            expect(mealTime).toBeTruthy();
            console.log(`Meal time: ${mealTime}`);

            // Verify meal price
            mealPrice = firstMeal.price;
            expect(mealPrice).toBeTruthy();
            console.log(`Meal price: ${mealPrice}`);

            // Check note information
            hasNote = firstMeal.hasNote;
            noteText = firstMeal.note;

            if (hasNote && noteText) {
                console.log(`Note: ${noteText}`);
            }
        }

        return {
            success: true,
            cardTitle,
            meals,
            restaurantName,
            mealTime,
            mealPrice,
            hasNote,
            noteText
        };
    }
}
