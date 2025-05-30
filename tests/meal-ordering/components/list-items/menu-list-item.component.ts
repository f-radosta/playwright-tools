import {BaseListItemComponent} from '@shared/components/base-list-item.component';
import {ListItemInterface} from '@shared/components/interfaces/list-item.interface';
import {Locator} from '@playwright/test';
import {DropdownFilterComponent, DropdownType} from '@shared/components/filters/dropdown-filter.component';

/**
 * Represents a menu item in the meal ordering system
 */
export class MenuListItem
    extends BaseListItemComponent
    implements ListItemInterface {
    
    /**
     * Get the name of the meal
     */
    async getMealName(): Promise<string | null> {
        return this.itemLocator.getByTestId('food-name').textContent();
    }

    /**
     * Get the restaurant name for this meal
     */
    async getRestaurantName(): Promise<string | null> {
        return this.itemLocator.getByTestId('restaurant-name').textContent();
    }

    /**
     * Get the price of the meal
     */
    async getPrice(): Promise<string | null> {
        const priceCell = this.itemLocator.getByTestId('price-cell');
        return priceCell.getByTestId('list-item-text').textContent();
    }

    /**
     * Get the order deadline status
     */
    async getOrderDeadlineStatus(): Promise<string | null> {
        const deadlineTimer = this.itemLocator.getByTestId('deadline-timer');
        return deadlineTimer.getAttribute('data-test-order-status');
    }

    /**
     * Get the food type from the icon (e.g., "Polévka", "Hlavní chod")
     */
    async getFoodType(): Promise<string | null> {
        const foodIcon = this.itemLocator.getByTestId('food-type-icon');
        return foodIcon.getAttribute('aria-label');
    }

    /**
     * Get the current quantity value
     */
    async getQuantity(): Promise<number> {
        const quantityInput = this.itemLocator.getByTestId('quantity-input');
        const value = await quantityInput.inputValue();
        return value ? parseInt(value.trim(), 10) : 0;
    }

    /**
     * Check if the meal can be ordered (based on deadline)
     */
    async canBeOrdered(): Promise<boolean> {
        const status = await this.getOrderDeadlineStatus();
        // 'available' means orders are open, 'ordered' means orders are closed
        return status === 'available';
    }

    /**
     * Get the restaurant link URL
     */
    async getRestaurantLink(): Promise<string | null> {
        const restaurantCell = this.itemLocator.getByTestId('restaurant-cell');
        const link = restaurantCell.getByTestId('restaurant-link');
        return link.getAttribute('href');
    }

    /**
     * Set the quantity of the meal using the input field
     * @param quantity The quantity to set
     */
    async setQuantity(quantity: number): Promise<void> {
        const quantityInput = this.itemLocator.getByTestId('quantity-input');
        
        // Clear the input and set the new value
        await quantityInput.fill(quantity.toString());
    }
    
    /**
     * Increment the quantity by clicking the + button
     */
    async incrementQuantity(): Promise<void> {
        const incrementButton = this.itemLocator.getByTestId('increment-button');
        await incrementButton.click();
    }
    
    /**
     * Decrement the quantity by clicking the - button
     */
    async decrementQuantity(): Promise<void> {
        const decrementButton = this.itemLocator.getByTestId('decrement-button');
        await decrementButton.click();
    }
    
    /**
     * Select a time slot for the meal
     * @param timeValue The value of the time slot to select (e.g., "1100", "1130")
     */
    async selectTimeSlot(timeValue: string): Promise<void> {
        const timeSelect = this.itemLocator.getByTestId('time-select');
        
        // First try the standard selectOption approach
        try {
            await timeSelect.selectOption(timeValue);
            return;
        } catch (error) {
            console.log('Standard selectOption failed, trying alternative approach');
        }
        
        // If standard approach fails, try clicking the select and then the option
        try {
            // Click to open the dropdown
            await timeSelect.click();
            
            // Find and click the option with the matching value
            const option = timeSelect.locator(`option[value="${timeValue}"]`);
            await option.click();
            return;
        } catch (error) {
            console.log('Alternative approach failed, trying direct option selection');
        }
        
        // If all else fails, try to set the value directly
        await timeSelect.evaluate((element, value) => {
            (element as HTMLSelectElement).value = value;
            // Dispatch a change event to trigger any listeners
            const event = new Event('change', { bubbles: true });
            element.dispatchEvent(event);
        }, timeValue);
    }
    
    /**
     * Get available time slots
     * @returns Array of objects with time slot value and text
     */
    async getAvailableTimeSlots(): Promise<Array<{value: string, text: string}>> {
        const timeSelect = this.itemLocator.getByTestId('time-select');
        
        // Get all option elements
        const options = await timeSelect.locator('option').all();
        const timeSlots = [];
        
        for (const option of options) {
            const value = await option.getAttribute('value') || '';
            const text = await option.textContent() || '';
            timeSlots.push({ value, text: text.trim() });
        }
        
        return timeSlots;
    }
    
    /**
     * Add a note to the meal order
     * @param note The note text to add
     */
    async addNote(note: string): Promise<void> {
        // Click the note button to open the modal
        const noteButton = this.itemLocator.getByTestId('note-button');
        await noteButton.click();
        
        // Wait for the modal to appear
        const modal = this.itemLocator.page().locator('.modal.show');
        await modal.waitFor({ state: 'visible' });
        
        // Fill in the note
        const textarea = modal.getByTestId('note-textarea');
        await textarea.fill(note);
        
        // Submit the form
        const submitButton = modal.getByTestId('note-submit');
        await submitButton.click();
    }

    /**
     * Order this meal with the specified quantity and time slot
     * @param quantity The quantity to order
     * @param timeSlot Optional time slot value (e.g., "1100", "1130")
     * @param note Optional note for the order
     */
    async orderMeal(quantity: number = 1, timeSlot?: string, note?: string): Promise<void> {
        // Set the quantity
        await this.setQuantity(quantity);
        
        // Select time slot if provided
        if (timeSlot) {
            await this.selectTimeSlot(timeSlot);
        }
        
        // Add note if provided
        if (note) {
            await this.addNote(note);
        }
    }
}
