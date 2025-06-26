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

    XPATH_SELECTOR: {
        FILTER: {
            RESTAURANT: '//*[@id="food_menu_filter_company"]',
            FOOD_TYPE: '//*[@id="food_menu_filter_mealType"]',
            DATE: '//*[@id="food_menu_filter_dateRange"]'
        }
    }
} as const;
