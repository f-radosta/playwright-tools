export const MEAL_SELECTORS = {
    DATE_LABEL: 'date-label',
    DAILY_MENU_LIST: 'daily-menu-list',

    PAGE: {
        BASKET_CARD: 'basket-card',
        ORDER_SUMMARY_TOTAL_PRICE: 'order-summary-total-price',
        ORDERED_CARD: 'ordered-card'
    },

    MENU_ITEM: {
        NOTE: {
            INDICATOR: 'note-indicator',
            BUTTON: 'note-button',
            TEXTAREA: 'note-textarea',
            SUBMIT: 'note-submit'
        },
        FOOD_NAME: 'food-name',
        RESTAURANT_NAME: 'restaurant-name',
        PRICE_CELL: 'price-cell',
        DEADLINE_TIMER: 'deadline-timer',
        QUANTITY_INPUT: 'quantity-input',
        TIME_SELECT: 'time-select',
        RESTAURANT_CELL: 'restaurant-cell',
        RESTAURANT_LINK: 'restaurant-link',
        INCREMENT_BUTTON: 'increment-button',
        DECREMENT_BUTTON: 'decrement-button',
        DATE: 'date',
        TODAY_INDICATOR: 'today-indicator',
        MEAL_TYPE_ICON: 'meal-type-icon',
        MEAL_NAME: 'menu-meal-name',
        PRICE: 'price'
    },
    ORDER_ITEM: {
        NOTE: {
            TEXT: 'order-note-text',
            CONTAINER: 'order-note-container'
        },
        DATE: 'order-date',
        TODAY_INDICATOR: 'order-today-indicator',
        MEAL_TYPE_ICON: 'order-meal-type-icon',
        QUANTITY: 'order-meal-quantity',
        MEAL_NAME: 'order-meal-name',
        LIST_ITEM_DATE_ROW: 'list-item-date-row',
        LIST_ITEM_MEAL_ROW: 'list-item-meal-row',
        TIME: 'order-time',
        TOTAL_PRICE: 'order-total-price',
        RESTAURANT_NAME: 'order-restaurant-name',
        PRICE_PER_UNIT: 'order-price-per-unit'
    },
    ORDERED_ITEM: {
        EDIT: 'order-edit',
        DATE: 'order-date',
        USER: 'order-user',
        MEAL: 'order-meal',
        RESTAURANT: 'order-restaurant',
        QUANTITY: 'order-quantity'
    },

    XPATH_SELECTOR: {
        FILTER: {
            RESTAURANT: '//*[@id="food_menu_filter_company"]',
            FOOD_TYPE: '//*[@id="food_menu_filter_mealType"]',
            DATE: '//*[@id="food_menu_filter_dateRange"]',
            USER: '//*[@id="order_item_filter_users"]'
        },
        FORM: {
            RESTAURANT: '//*[@id="food_offer_foodCompany"]',
            MENU_VALIDITY: '//*[@id="food_offer_dateRange"]',
            INCLUDE_WEEKEND: '//*[@id="food_offer_includeWeekend"]',
            INCLUDE_HOLIDAY: '//*[@id="food_offer_includeHoliday"]',
            NAME: '//*[@id="food_offer_name"]',
            MEAL_CONTAINER: '//*[@id="food_offer_meals"]',
            MEAL_CONTAINER_ROW: '//*[@id="food_offer_meals"]//*',
            MEAL_NAME_INPUT: './/input[contains(@id, "_name")]',
            MEAL_TYPE_SELECT: './/select[contains(@id, "_mealType")]',
            MEAL_PRICE_INPUT: './/input[contains(@id, "_price")]',
            MEAL_LIMIT_INPUT: './/input[contains(@id, "_dailyMaxLimit")]',
            ADD_MEAL_BUTTON: '//button[@id="food_offer_meals_add"]',
            ORDER_DISPATCH_FREQUENCY:
                '//select[@id="food_offer_orderDispatchFrequency"]',
            ORDER_DISPATCH_DAY: '//select[@id="food_offer_orderDispatchDay"]',
            ONE_TIME_ORDER_DISPATCH_DATE:
                '//input[@id="food_offer_oneTimeOrderDispatchDate"]',
            ORDER_DISPATCH_TIME: '//input[@id="food_offer_orderDispatchTime"]',
            SAVE_BUTTON:
                '//button[@type="submit" and contains(@class, "btn-primary") and contains(., "Uložit")]',
            DELETE_MEAL_BUTTONS: '//button[contains(@id, "_delete")]'
        }
    }
} as const;
