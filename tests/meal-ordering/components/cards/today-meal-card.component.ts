import {Locator} from '@playwright/test';
import {BaseMeal} from '@meal-models/meal-ordering.types';

/**
 * Class representing the "Your Meal Today" card component
 * Implements the BaseMeal interface for consistent API across components
 */
export class TodayMealCard implements BaseMeal {
    constructor(private readonly rootLocator: Locator) {}

    /**
     * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
     */
    protected normalizeText(text: string | null): string {
        if (text === null) return '';
        return text.trim().replace(/\s+/g, ' ');
    }

    /**
     * Helper to safely extract text content and normalize it
     */
    protected async safeGetText(locator: Locator): Promise<string | null> {
        try {
            const text = await locator.textContent();
            if (text === null || text.trim() === '') return null;
            return this.normalizeText(text);
        } catch (error) {
            console.error('Failed to get text content:', error);
            return null;
        }
    }

    /**
     * Gets the card title element
     */
    async getTitle(): Promise<string | null> {
        const titleContainer = this.rootLocator.locator(
            '[data-test="meal-card-title-container"]'
        );
        const title = await titleContainer
            .locator('.infoTile__title')
            .textContent();
        return title?.trim() || null;
    }

    /**
     * Gets all meal rows in the card
     */
    async getMealRows(): Promise<Locator[]> {
        return this.rootLocator
            .locator('[data-test="meal-section-container"]')
            .all();
    }

    /**
     * Gets the name of a meal at a specific index
     * @param index The index of the meal (0-based)
     */
    async getMealName(index = 0): Promise<string | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const mealName = await mealRows[index]
            .locator('[data-test="meal-name"]')
            .textContent();

        return mealName?.trim() || null;
    }

    /**
     * Gets the quantity of a meal at a specific index
     * @param index The index of the meal (0-based)
     */
    async getMealQuantity(index = 0): Promise<number | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const quantityText = await mealRows[index]
            .locator('[data-test="meal-quantity"]')
            .textContent();

        if (!quantityText) {
            return null;
        }

        // Extract number from format like "1x"
        const match = quantityText.match(/(\d+)x/);
        return match ? parseInt(match[1], 10) : null;
    }

    /**
     * Gets the type of a meal at a specific index based on the aria-label
     * @param index The index of the meal (0-based)
     */
    async getMealType(index = 0): Promise<string | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const typeIcon = mealRows[index].locator(
            '[data-test="meal-type-icon"]'
        );
        const ariaLabel = await typeIcon.getAttribute('aria-label');

        return ariaLabel || null;
    }

    /**
     * Gets the restaurant name for a specific meal
     * @param index The index of the meal (0-based)
     */
    async getRestaurantName(index = 0): Promise<string | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const restaurantName = await mealRows[index]
            .locator('[data-test="meal-restaurant-name"]')
            .textContent();

        return restaurantName?.trim() || null;
    }

    /**
     * Gets the meal time for a specific meal
     * @param index The index of the meal (0-based)
     */
    async getMealTime(index = 0): Promise<string | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const timeLocator = mealRows[index].locator('[data-test="meal-time"]');
        if ((await timeLocator.count()) === 0) return null;

        return this.safeGetText(timeLocator);
    }

    /**
     * Gets the meal price for a specific meal
     * @param index The index of the meal (0-based)
     */
    async getMealPrice(index = 0): Promise<string | null> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const mealPrice = await mealRows[index]
            .locator('[data-test="meal-price"]')
            .textContent();

        return mealPrice?.trim() || null;
    }

    /**
     * Gets the price per unit (alias to getMealPrice for BaseMeal interface)
     * @param index The index of the meal (0-based)
     */
    async getPricePerUnit(index = 0): Promise<string | null> {
        return this.getMealPrice(index);
    }

    /**
     * Checks if the specific meal has a note
     * @param index The index of the meal (0-based)
     */
    async hasNote(index = 0): Promise<boolean> {
        const mealRows = await this.getMealRows();
        if (index >= mealRows.length) {
            throw new Error(`Meal with index ${index} not found`);
        }

        const noteContainer = mealRows[index].locator(
            '[data-test="meal-note-container"]'
        );
        return (await noteContainer.count()) > 0;
    }

    /**
     * Gets the meal note text or tooltip for a specific meal (implements getNote from BaseMeal interface)
     * @param index The index of the meal (0-based)
     */
    async getNote(index = 0): Promise<string | null> {
        return this.getNoteText(index);
    }

    /**
     * Gets the meal note text or tooltip for a specific meal
     * @param index The index of the meal (0-based)
     */
    async getNoteText(index = 0): Promise<string | null> {
        if (!(await this.hasNote(index))) {
            return null;
        }

        const mealRows = await this.getMealRows();
        const noteContainer = mealRows[index].locator(
            '[data-test="meal-note-container"]'
        );

        // First try to get the tooltip text which contains the full note
        const tooltipText = await noteContainer.getAttribute(
            'data-bs-original-title'
        );
        if (tooltipText) {
            return tooltipText;
        }

        // Fallback to visible text
        const noteText = await noteContainer
            .locator('[data-test="meal-note-text"]')
            .textContent();
        return noteText?.trim() || null;
    }

    /**
     * Extracts a complete meal data object for the meal at the specified index
     * This contains all available BaseMeal data as direct properties rather than methods
     * @param index The index of the meal (0-based)
     */
    async extractMealData(index = 0): Promise<{
        name: string | null;
        quantity: number | null;
        type: string | null;
        restaurantName: string | null;
        price: string | null;
        time: string | null;
        hasNote: boolean;
        note: string | null;
    }> {
        return {
            name: await this.getMealName(index),
            quantity: await this.getMealQuantity(index),
            type: await this.getMealType(index),
            restaurantName: await this.getRestaurantName(index),
            price: await this.getPricePerUnit(index),
            time: await this.getMealTime(index),
            hasNote: await this.hasNote(index),
            note: await this.getNote(index)
        };
    }
}
