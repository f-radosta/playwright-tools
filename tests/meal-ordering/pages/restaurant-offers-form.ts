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
            await this.fillMeal(
                meal.mealName,
                meal.mealType,
                meal.price,
                meal.dailyLimit
            );
        }

        // Save the form
        await this.saveForm();
    }

    /**
     * Clicks the save button to submit the form
     */
    async saveForm(): Promise<void> {
        await this.page.click(MEAL_SELECTORS.XPATH_SELECTOR.FORM.SAVE_BUTTON);
    }

    /**
     * Deletes all meal entries by finding and clicking all delete buttons
     */
    async deleteAllMeals(): Promise<void> {
        const deleteButtons = this.page.locator(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.DELETE_MEAL_BUTTONS
        );
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
    async fillMeal(
        mealName: string,
        mealType: string,
        price: number,
        dailyLimit?: number
    ): Promise<void> {
        // Get the main meals container
        const mealsContainer = await this.page.$(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_CONTAINER
        );
        if (!mealsContainer) {
            throw new Error('Meals container not found');
        }

        // Find all meal rows within the container
        const mealRows = await mealsContainer.$$(
            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_CONTAINER_ROW
        );

        // Find the first empty meal row (where name input is empty)
        for (const row of mealRows) {
            const nameInput = await row.$(
                MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_NAME_INPUT
            );
            if (nameInput) {
                const value = await nameInput.inputValue();
                if (!value.trim()) {
                    // Fill meal name
                    await nameInput.fill(mealName);

                    // Fill meal type
                    const typeSelect = await row.$(
                        MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_TYPE_SELECT
                    );
                    if (typeSelect) {
                        // Convert enum value to the corresponding option value
                        let optionValue = '2'; // Default to MainCourse
                        switch (mealType) {
                            case 'Snídaně':
                                optionValue = '0';
                                break;
                            case 'Polévka':
                                optionValue = '1';
                                break;
                            case 'Hlavní chod':
                                optionValue = '2';
                                break;
                            case 'Salát':
                                optionValue = '3';
                                break;
                            case 'Dezert':
                                optionValue = '4';
                                break;
                            case 'Svačina':
                                optionValue = '5';
                                break;
                        }
                        await typeSelect.selectOption(optionValue);
                    }

                    // Fill price
                    const priceInput = await row.$(
                        MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_PRICE_INPUT
                    );
                    if (priceInput) {
                        await priceInput.fill(price.toString());
                    }

                    // Fill daily limit if provided
                    if (dailyLimit !== undefined) {
                        const limitInput = await row.$(
                            MEAL_SELECTORS.XPATH_SELECTOR.FORM.MEAL_LIMIT_INPUT
                        );
                        if (limitInput) {
                            await limitInput.fill(dailyLimit.toString());
                        }
                    }

                    return; // Exit after filling the first empty meal
                }
            }
        }

        throw new Error('No empty meal slot found');
    }
}
