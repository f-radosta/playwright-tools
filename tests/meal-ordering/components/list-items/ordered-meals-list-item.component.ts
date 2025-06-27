import {Locator, Page} from '@playwright/test';
import {ListItemInterface} from '@shared-components/interfaces/list-item.interface';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {OrderedMealEditFormPage} from '@meal/pages/ordered-meal-edit-form.page';
import {getEnumValueByDisplayText} from '@shared-helpers/shared-helper';
import {Restaurant} from '@meal-models/meal-ordering.types';
import {normalizeText} from '@shared-helpers/shared-helper';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';

export class OrderedMealsListItem extends BaseListItemComponent implements ListItemInterface {
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    async getDate(): Promise<string | null> {
        const text = await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.DATE)
            .textContent();
        return text ? normalizeText(text) : null;
    }

    async getName(): Promise<string | null> {
        const text = await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.USER)
            .textContent();
        return text ? normalizeText(text) : null;
    }

    async getMealName(): Promise<string | null> {
        const text = await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.MEAL)
            .textContent();
        return text ? normalizeText(text) : null;
    }

    async getRestaurant(): Promise<Restaurant | null> {
        const text = await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.RESTAURANT)
            .textContent();
        return text ? getEnumValueByDisplayText(Restaurant, text) : null;
    }

    async getQuantity(): Promise<string | null> {
        const text = await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.QUANTITY)
            .textContent();
        return text ? normalizeText(text) : null;
    }

    /**
     * Clicks the edit button and returns the edit meal order form page
     * @returns A promise that resolves when the edit button is clicked and the page is loaded
     */
    async goToEditForm(page: Page): Promise<OrderedMealEditFormPage> {
        await this.itemLocator
            .getByTestId(MEAL_SELECTORS.ORDERED_ITEM.EDIT)
            .click();
        return new OrderedMealEditFormPage(page);
    }
}
