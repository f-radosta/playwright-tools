import {BasePage} from '@shared/pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared/pages/page.interface';
import {OrderList} from '@meal/components/lists/order-list.component';
import {TodayMealCard} from '@meal/components/cards/today-meal-card.component';

export class MealOrderHPPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page.getByRole('heading', {name: 'Objednání obědů'});
    }

    // Component instances
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
                this.page.getByTestId('basket-card')
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
                this.page.getByTestId('ordered-card')
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
                this.page.locator('[data-test="list-and-filter-wrapper"]')
            );
        }
        return this._todayMealCard;
    }
}
