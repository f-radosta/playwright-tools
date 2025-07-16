import {BasePage} from '@shared-pages/base-page';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';
import {OrderList} from '@meal-lists/order-list.component';
import {TodayMealCard} from '@meal-cards/today-meal-card.component';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class MealOrderHPPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {name: 'Objednání obědů'});
    }

    private _cartList: OrderList | null = null;
    private _orderedUnbilledList: OrderList | null = null;
    private _todayMealCard: TodayMealCard | null = null;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the cart list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get cartList(): OrderList {
        if (!this._cartList) {
            this._cartList = new OrderList(
                this.page.getByTestId(MEAL_SELECTORS.PAGE.BASKET_CARD)
            );
        }
        return this._cartList;
    }

    /**
     * Get the ordered unbilled list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get orderedUnbilledList(): OrderList {
        if (!this._orderedUnbilledList) {
            this._orderedUnbilledList = new OrderList(
                this.page.getByTestId(MEAL_SELECTORS.PAGE.ORDERED_CARD)
            );
        }
        return this._orderedUnbilledList;
    }

    /**
     * Get the Today's Meal card component
     * Lazy-loaded to ensure the component is only created when needed
     */
    getTodayMealCard(): TodayMealCard {
        if (!this._todayMealCard) {
            this._todayMealCard = new TodayMealCard(
                this.page.getByTestId(SHARED_SELECTORS.LIST.LIST_AND_FILTER_WRAPPER)
            );
        }
        return this._todayMealCard;
    }
}
