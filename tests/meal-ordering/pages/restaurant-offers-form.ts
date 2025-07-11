import {BasePage} from '@shared-pages/base-page';
import {Locator, Page} from '@playwright/test';
import {PageInterface} from '@shared-pages/page.interface';
import {
    DropdownFilterComponent,
    DropdownType
} from '@shared/components/filters/dropdown-filter.component';
import {DateFilterComponent} from '@shared/components/filters/date-filter.component';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {
    OrderDispatchFrequency,
    RestaurantOfferFormDTO,
    DayOfWeek
} from '@meal-models/meal-ordering.types';

export class RestaurantOfferFormPage extends BasePage implements PageInterface {
    private readonly restaurantFilter: DropdownFilterComponent;
    private readonly menuValidityFilter: DateFilterComponent;

    pageTitle(): Locator {
        return this.page.getByRole('heading', {
            name: 'Nabídky restaurací'
        });
    }

    constructor(page: Page) {
        super(page);
        this.restaurantFilter = new DropdownFilterComponent(
            this.page.locator(MEAL_SELECTORS.XPATH_SELECTOR.FORM.RESTAURANT),
            DropdownType.TOMSELECT
        );

        this.menuValidityFilter = new DateFilterComponent(
            this.page.locator(MEAL_SELECTORS.XPATH_SELECTOR.FORM.MENU_VALIDITY)
        );
    }

    /**
     * Selects a restaurant from the dropdown
     * @param restaurantName The name of the restaurant to select
     */
    async selectRestaurant(restaurantName: string): Promise<void> {
        // restaurant name is sometimes disabled in edit form
        try {
            // Dropdown is different in edit form
            await this.page
                .locator('//*[@class="ts-control"]//*[@class="item"]')
                .click({timeout: 100});
        } catch (error) {}
        await this.restaurantFilter.select(restaurantName);
    }

    /**
     * Sets the menu validity to a one-month period starting from today
     */
    async setMenuValidity(dateRange: string): Promise<void> {
        await this.menuValidityFilter.setDate(dateRange);
        await this.pageTitle().click();
    }

    /**
     * Clicks the 'Add meal' button to add a new meal row
     */
    async clickAddMealButton(): Promise<void> {
        await this.page.click(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.ADD_MEAL_BUTTON
        );
    }

    /**
     * Sets the order dispatch frequency
     * @param frequency The frequency value to select (e.g., 'Odeslání jednorázově', 'Odeslání každý den', 'Odeslání týdně', 'eBRÁNA jídelna')
     */
    async setOrderDispatchFrequency(
        frequency: OrderDispatchFrequency
    ): Promise<void> {
        await this.page.selectOption(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.ORDER_DISPATCH_FREQUENCY,
            {value: frequency}
        );
    }

    /**
     * Sets the one-time order dispatch date
     * @param date The date string in YYYY-MM-DD format
     */
    async setOneTimeOrderDispatchDate(date: string): Promise<void> {
        const dateInput = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.ONE_TIME_ORDER_DISPATCH_DATE
        );
        await dateInput.fill(date);
    }

    /**
     * Sets the order dispatch time
     * @param time The time string in HH:MM AM/PM format (e.g., '02:30 PM')
     */
    async setOrderDispatchTime(time: string): Promise<void> {
        const timeInput = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.ORDER_DISPATCH_TIME
        );
        await timeInput.fill(time);
    }

    /**
     * Sets the day of week for weekly order dispatch
     * @param day The day of the week to set (e.g., 'Pondělí', 'Úterý', etc.)
     */
    async setDispatchDay(day: DayOfWeek): Promise<void> {
        const daySelect = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.ORDER_DISPATCH_DAY
        );
        await daySelect.selectOption({label: day});
    }

    /**
     * Sets the state of the 'include weekend' switch
     * @param include Whether to include weekends (true) or not (false)
     */
    async setIncludeWeekend(include: boolean): Promise<void> {
        const currentState = await this.page.isChecked(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.INCLUDE_WEEKEND
        );
        if (currentState !== include) {
            await this.page.click(
                MEAL_SELECTORS.XPATH_SELECTOR.FORM.INCLUDE_WEEKEND
            );
        }
    }

    /**
     * Sets the state of the 'include holiday' switch
     * @param include Whether to include holidays (true) or not (false)
     */
    async setIncludeHoliday(include: boolean): Promise<void> {
        const currentState = await this.page.isChecked(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.INCLUDE_HOLIDAY
        );
        if (currentState !== include) {
            await this.page.click(
                MEAL_SELECTORS.XPATH_SELECTOR.FORM.INCLUDE_HOLIDAY
            );
        }
    }

    /**
     * Sets the name of the food offer
     * @param name The name to set for the food offer
     */
    async setName(name: string): Promise<void> {
        await this.page.fill(MEAL_SELECTORS.XPATH_SELECTOR.FORM.NAME, name);
    }

    /**
     * Fills out the entire form using the provided DTO
     * @param formData Object containing all form data
     */
    async fillForm(formData: RestaurantOfferFormDTO): Promise<void> {
        // Clear existing meals
        await this.deleteAllMeals();

        // Fill basic info
        await this.selectRestaurant(formData.restaurantName);
        await this.setMenuValidity(formData.menuValidity);
        await this.setIncludeWeekend(formData.includeWeekend);
        await this.setIncludeHoliday(formData.includeHoliday);
        await this.setName(formData.name);

        // Handle different order dispatch frequencies
        switch (formData.orderDispatchFrequency) {
            case OrderDispatchFrequency.OneTime:
                if (formData.oneTimeOrderDispatchDate) {
                    await this.setOneTimeOrderDispatchDate(
                        formData.oneTimeOrderDispatchDate
                    );
                }
                break;
            case OrderDispatchFrequency.Weekly:
                if (formData.orderDispatchDay) {
                    await this.setDispatchDay(formData.orderDispatchDay);
                } else {
                    throw new Error(
                        'orderDispatchDay is required for weekly order dispatch'
                    );
                }
                break;
            case OrderDispatchFrequency.Daily:
            case OrderDispatchFrequency.EbranaCanteen:
                // No additional date to set for these frequencies
                break;
        }

        await this.setOrderDispatchTime(formData.orderDispatchTime);

        // Add and fill meals
        for (const meal of formData.meals) {
            await this.clickAddMealButton();
            await this.page.waitForTimeout(600);
            await this.fillMeal(
                meal.mealName,
                meal.mealType,
                meal.price,
                meal.dailyLimit
            );
            await this.page.waitForTimeout(400);
        }

        // Save the form
        await this.saveForm();
    }

    /**
     * Clicks the save button to submit the form and waits for the save to complete
     */
    async saveForm(): Promise<void> {
        await this.page.click(MEAL_SELECTORS.XPATH_SELECTOR.FORM.SAVE_BUTTON);
        await this.page.waitForTimeout(500);
        // Wait for the 'Zpět na výpis' link to be hidden, indicating the save is complete
        await this.page
            .getByRole('link', {name: 'Zpět na výpis'})
            .waitFor({state: 'hidden', timeout: 5000});
    }

    /**
     * Deletes all meal entries by finding and clicking all delete buttons
     */
    async deleteAllMeals(): Promise<void> {
        const deleteButtons = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.DELETE_MEAL_BUTTONS
        );
        await deleteButtons.nth(0).waitFor({state: 'visible'});
        const count = await deleteButtons.count();

        // Click all delete buttons in reverse order to avoid index shifting issues
        for (let i = count - 1; i >= 0; i--) {
            await deleteButtons.nth(i).click();
        }
    }

    /**
     * Fills in meal details in the first empty meal slot
     * @param mealName The name of the meal
     * @param mealType The type of the meal (e.g., 'Hlavní chod')
     * @param price The price of the meal
     * @param dailyLimit Optional daily limit for the meal
     */
    /**
     * Gets the option value for a meal type
     * @param mealType The display name of the meal type
     * @returns The corresponding option value
     */
    private getMealTypeOptionValue(mealType: string): string {
        switch (mealType) {
            case 'Snídaně':
                return '0';
            case 'Polévka':
                return '1';
            case 'Hlavní chod':
                return '2';
            case 'Salát':
                return '3';
            case 'Dezert':
                return '4';
            case 'Svačina':
                return '5';
            default:
                return '2'; // Default to MainCourse
        }
    }

    async fillMeal(
        mealName: string,
        mealType: string,
        price: number,
        dailyLimit?: number
    ): Promise<void> {
        // const lastRow = this.page.locator(MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_CONTAINER_ROW).last();
        // await lastRow.waitFor({ state: 'visible', timeout: 5000 });

        // Fill meal name
        const nameInput = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_NAME_INPUT
        );
        await nameInput.fill(mealName);

        // Fill meal type
        const typeSelect = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_TYPE_SELECT
        );
        const optionValue = this.getMealTypeOptionValue(mealType);
        await typeSelect.selectOption(optionValue);

        // Fill price
        const priceInput = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_PRICE_INPUT
        );
        await priceInput.fill(price.toString());

        // Fill daily limit if provided
        if (dailyLimit !== undefined) {
            const limitInput = this.page.locator(
                MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_LIMIT_INPUT
            );
            await limitInput.fill(dailyLimit.toString());
        }
    }

    async moveToPast(): Promise<void> {
        await this.setMenuValidity('1.1.2020 - 2.1.2020');
        await this.saveForm();
    }

    async goBack(): Promise<void> {
        await this.page.getByRole('link', {name: 'Zpět na výpis'}).click();
    }

}
