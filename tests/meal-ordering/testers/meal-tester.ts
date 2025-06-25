import {expect} from '@playwright/test';
import { log } from '@shared/utils/config';
import {AppFactory} from '@shared-pages/app.factory';
import {MenuDTO} from '@meal-filters/menu-filter.component';
import {
    DailyMenuList,
    OrderListItem as OrderListItemInterface
} from '@meal-models/meal-ordering.types';
import {OrderListItem as OrderListItemComponent} from '@meal-list-items/order-list-item.component';

/**
 * Convert component OrderListItem to model OrderListItem interface
 */
export function toOrderListItemModel(
    component: OrderListItemComponent
): OrderListItemInterface {
    return component;
}

/**
 * Convert array of component OrderListItems to array of model OrderListItem interfaces
 */
export function toOrderListItemModelArray(
    components: OrderListItemComponent[]
): OrderListItemInterface[] {
    return components as unknown as OrderListItemInterface[];
}

// Date type for meal lists
export enum MealListType {
    TODAY = 'today',
    TOMORROW = 'tomorrow'
}

export type VerifyTodayMealResult = {
    success: boolean;
    cardTitle: string | null;
    meals: Array<{
        name: string | null;
        quantity: number | null;
        type: string | null;
        restaurantName?: string | null;
        time?: string | null;
        price?: string | null;
        hasNote?: boolean;
        note?: string | null;
    }>;
    restaurantName: string | null;
    mealTime: string | null;
    mealPrice: string | null;
    hasNote: boolean;
    noteText: string | null;
};

/**
 * Navigate to menu and filter for today's meals
 */
export async function navigateAndFilterTodayMeals(
    app: AppFactory,
    filterCriteria: MenuDTO
) {
    return navigateAndFilterMeals(app, filterCriteria, MealListType.TODAY);
}

/**
 * Navigate to menu and filter for tomorrow's meals
 */
export async function navigateAndFilterTomorrowMeals(
    app: AppFactory,
    filterCriteria: MenuDTO
) {
    return navigateAndFilterMeals(app, filterCriteria, MealListType.TOMORROW);
}

/**
 * General method for navigating and filtering meals by specific list type
 * @private Internal implementation - use specific methods instead
 */
async function navigateAndFilterMeals(
    app: AppFactory,
    filterCriteria: MenuDTO,
    listType: MealListType
) {
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

export async function selectAndOrderMeal(
    filteredList: DailyMenuList,
    mealIndex: number = 0,
    quantity: number = 1,
    timeSlot?: string,
    note?: string
) {
    const availableMeals = await filteredList.getAvailableMeals();

    expect(
        availableMeals.length,
        'At least one meal should be available for ordering'
    ).toBeGreaterThan(0);

    if (availableMeals.length === 0) {
        return {success: false};
    }

    const meal = availableMeals[mealIndex];

    const [mealName, restaurantName, price, foodType] = await Promise.all([
        meal.getMealName(),
        meal.getRestaurantName(),
        meal.getPricePerUnit(),
        meal.getMealType()
    ]);

    log(
        `Ordering meal: ${mealName} from ${restaurantName} (${foodType}) for ${price}`
    );

    await meal.orderMeal(quantity, timeSlot, note);

    const orderedQuantity = await meal.getMealQuantity();
    expect(orderedQuantity).toBe(quantity);

    return {
        success: true,
        mealName,
        restaurantName,
        price,
        foodType,
        quantity,
        timeSlot,
        note
    };
}

export async function verifyCart(
    app: AppFactory,
    mealDetails: {
        success: boolean;
        mealName?: string;
        restaurantName?: string;
        quantity?: number;
        note?: string;
        timeSlot?: string;
    }
) {
    log('Navigating to meal order homepage to check cart...');
    const mealOrderHP = await app.gotoMealOrderHP();

    // Get cart items (convert component types to model types)
    const cartItemComponents = await mealOrderHP.cartList.getItems();
    const cartItems: OrderListItemInterface[] =
        toOrderListItemModelArray(cartItemComponents);
    expect(
        cartItems.length,
        'Cart should have at least one item'
    ).toBeGreaterThan(0);

    let foundOrderedMeal = false;

    for (const cartItem of cartItems) {
        const cartItemName = await cartItem.getMealName();
        const cartItemQuantity = await cartItem.getMealQuantity();

        log(`Cart item name: "${cartItemName}"`);
        log(`Meal name: "${mealDetails.mealName}"`);
        log(`Cart item quantity: ${cartItemQuantity}`);
        log(`Quantity: ${mealDetails.quantity}`);
        const nameMatches = mealDetails.mealName === cartItemName;
        const quantityMatches = cartItemQuantity === mealDetails.quantity;

        log(
            `Name matches: ${nameMatches}, Quantity matches: ${quantityMatches}`
        );

        if (nameMatches && quantityMatches) {
            foundOrderedMeal = true;

            const cartItemRestaurant = await cartItem.getRestaurantName();

            log(`Cart item restaurant: "${cartItemRestaurant}"`);
            log(`Menu restaurant: "${mealDetails.restaurantName}"`);

            expect(cartItemRestaurant).toBe(mealDetails.restaurantName);

            // Verify time slot if provided in mealDetails
            if (mealDetails.timeSlot) {
                const cartItemTime = await cartItem.getMealTime();
                expect(cartItemTime).toBe(mealDetails.timeSlot);
                log(`Verified time slot: ${cartItemTime}`);
            }

            const hasNote = await cartItem.hasNote();
            if (mealDetails.note) {
                expect(hasNote).toBeTruthy();

                if (hasNote) {
                    const noteText = await cartItem.getNote();
                    expect(noteText).toBeTruthy();
                }
            }

            const pricePerUnit = await cartItem.getPricePerUnit();
            expect(pricePerUnit).toBeTruthy();

            const totalPrice = await cartItem.getTotalPrice();
            expect(totalPrice).toBeTruthy();

            log(
                `Found ordered meal in cart: ${cartItemName} x${cartItemQuantity}`
            );
            break;
        }
    }

    expect(
        foundOrderedMeal,
        'The ordered meal should be found in the cart'
    ).toBeTruthy();

    const cartTotalPrice = await mealOrderHP.cartList.getTotalPrice();
    expect(cartTotalPrice).toContain('Kč');
    log(`Cart total price: ${cartTotalPrice}`);
    log('Checking ordered-unbilled list...');
    const orderedItems = await mealOrderHP.orderedUnbilledList.getItems();
    log(
        `Found ${orderedItems.length} items in the ordered-unbilled list`
    );

    return {success: foundOrderedMeal, mealOrderHP};
}

/**
 * Clean up meal orders by resetting filters and setting quantities to 0
 * This ensures that tests don't leave behind orders that could affect other tests
 * @param app The AppFactory instance
 * @returns True if cleanup was successful, false otherwise
 */
export async function cleanupMealOrders(app: AppFactory): Promise<boolean> {
    try {
        const currentMenuPage = await app.gotoCurrentMenu();

        const emptyFilter: MenuDTO = {};
        await currentMenuPage.menuList.menuFilter.filter(emptyFilter);

        const allLists = await currentMenuPage.menuList.getDailyMenuLists();
        for (const list of allLists) {
            const meals = await list.getAvailableMeals();
            for (const meal of meals) {
                await meal.setQuantity(0);
            }
        }

        return true;
    } catch (error) {
        console.error('Failed to clean up meal orders:', error);
        return false;
    }
}

export async function verifyTodayMeal(
    app: AppFactory
): Promise<VerifyTodayMealResult> {
    const mealOrderHP = await app.gotoMealOrderHP();
    const todayMealCard = mealOrderHP.getTodayMealCard();

    expect(todayMealCard, "Today's meal card should be visible").toBeTruthy();

    if (!todayMealCard) {
        return {
            success: false,
            cardTitle: null,
            meals: [],
            restaurantName: null,
            mealTime: null,
            mealPrice: null,
            hasNote: false,
            noteText: null
        };
    }

    const cardTitle = await todayMealCard.getTitle();
    expect(cardTitle, "Today's meal card title should be present").toBeTruthy();
    log(`Card title: ${cardTitle}`);

    const mealRows = await todayMealCard.getMealRows();
    expect(
        mealRows.length,
        'Card should have at least one meal'
    ).toBeGreaterThan(0);
    log(`Found ${mealRows.length} meals on the card`);

    const meals = [];
    for (let i = 0; i < mealRows.length; i++) {
        const mealData = await todayMealCard.extractMealData(i);

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

        log(
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

    const defaultResult = {
        success: true,
        cardTitle,
        meals,
        restaurantName: null,
        mealTime: null,
        mealPrice: null,
        hasNote: false,
        noteText: null
    };

    if (meals.length === 0) {
        return defaultResult;
    }
    const firstMeal = meals[0];
    const {
        restaurantName,
        time: mealTime,
        price: mealPrice,
        hasNote,
        note: noteText
    } = firstMeal;

    expect(restaurantName, 'Restaurant name should be present').toBeTruthy();
    expect(mealTime, 'Meal time should be present').toBeTruthy();
    expect(mealPrice, 'Meal price should be present').toBeTruthy();
    log(`Restaurant: ${restaurantName}`);
    log(`Meal time: ${mealTime}`);
    log(`Meal price: ${mealPrice}`);

    if (hasNote && noteText) {
        log(`Note: ${noteText}`);
    }
    return {
        ...defaultResult,
        restaurantName,
        mealTime,
        mealPrice,
        hasNote,
        noteText
    };
}
