import {Locator} from '@playwright/test';
import {MEAL_SELECTORS} from '@meal-selectors/meals.selectors';
import {BaseListComponent} from '@shared-components/base-list.component';
import {ListInterface} from '@shared-interfaces/list.interface';
import {MenuListItem} from '@meal-components/index';

export class DailyMenuList
    extends BaseListComponent<MenuListItem>
    implements ListInterface
{
    private _date: Date | null = null;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
    }

    /**
     * Get the date associated with this daily menu list
     */
    public async getDate(): Promise<Date> {
        if (!this._date) {
            await this.initializeDate();
        }
        return this._date!;
    }

    /**
     * Initialize the date from the list header or title
     */
    private async initializeDate(): Promise<void> {
        try {
            // Try to find a date indicator in the list header
            const headerLocator = this.listLocator.getByTestId(MEAL_SELECTORS.DATE_LABEL);
            const headerText = await headerLocator.textContent();

            if (headerText) {
                // Extract date from header text - this will need to be adjusted based on your actual format
                this._date = this.extractDateFromText(headerText);
            } else {
                throw new Error('Failed to extract date from list');
            }
        } catch (error) {
            // If any error occurs during date extraction, fallback to current date
            console.warn(
                'Failed to extract date from list, using current date:',
                error
            );
            this._date = new Date();
        }
    }

    /**
     * Extract a date from text using regular expressions
     * This method is customized for the date format "29.5. čtvrtek" (day.month. day_of_week)
     */
    private extractDateFromText(text: string): Date {
        console.log('Extracting date from text:', text);
        
        // Format: "29.5. čtvrtek" - day.month. day_of_week
        const czechDateRegex = /\b(\d{1,2})\.(\d{1,2})\.(\s+\w+)?/;
        const czechMatch = text.match(czechDateRegex);
        
        if (czechMatch) {
            const [_, day, month] = czechMatch;
            const currentYear = new Date().getFullYear();
            console.log(`Parsed Czech date: day=${day}, month=${month}, year=${currentYear}`);
            
            // Create date with current year - using local time
            // Create a date at noon to avoid timezone issues
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10) - 1; // JavaScript months are 0-based
            
            // Set the date to noon on the specified day to avoid timezone issues
            const date = new Date(currentYear, monthNum, dayNum, 12, 0, 0);
            console.log('Created date:', date, 'Day:', date.getDate(), 'Month:', date.getMonth() + 1);
            return date;
        }
        
        // Standard date format with year
        const standardDateRegex = /\b(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})\b/;
        const standardMatch = text.match(standardDateRegex);

        if (standardMatch) {
            const [_, day, month, year] = standardMatch;
            // Adjust year if it's a 2-digit format
            const fullYear = year.length === 2 ? `20${year}` : year;
            console.log(`Parsed standard date: day=${day}, month=${month}, year=${fullYear}`);
            return new Date(`${fullYear}-${month}-${day}`);
        }

        // Try to find day names like "Today", "Tomorrow", etc.
        const today = new Date();

        if (text.toLowerCase().includes('dnes') || text.toLowerCase().includes('today')) {
            console.log('Identified as today');
            return today;
        } else if (text.toLowerCase().includes('zítra') || text.toLowerCase().includes('tomorrow')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            console.log('Identified as tomorrow');
            return tomorrow;
        } else if (text.toLowerCase().includes('včera') || text.toLowerCase().includes('yesterday')) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            console.log('Identified as yesterday');
            return yesterday;
        }

        // Default to today if no date is found
        console.log('No date pattern found, defaulting to today');
        return today;
    }

    /**
     * Check if this list is for today
     */
    public async isToday(): Promise<boolean> {
        const date = await this.getDate();
        
        // Create today's date at noon to avoid timezone issues
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
        
        console.log('List date:', date, 'Day:', date.getDate(), 'Month:', date.getMonth() + 1);
        console.log('Today date:', today, 'Day:', today.getDate(), 'Month:', today.getMonth() + 1);
        
        // Compare only the date components (year, month, day)
        const result = (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
        
        console.log('Is today?', result);
        return result;
    }

    /**
     * Check if this list is for tomorrow
     */
    public async isTomorrow(): Promise<boolean> {
        const date = await this.getDate();
        
        // Create tomorrow's date at noon to avoid timezone issues
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0, 0);
        
        console.log('List date:', date, 'Day:', date.getDate(), 'Month:', date.getMonth() + 1);
        console.log('Tomorrow date:', tomorrow, 'Day:', tomorrow.getDate(), 'Month:', tomorrow.getMonth() + 1);
        
        // Compare only the date components (year, month, day)
        const result = (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        );
        
        console.log('Is tomorrow?', result);
        return result;
    }

    /**
     * Check if this list is for yesterday
     */
    public async isYesterday(): Promise<boolean> {
        const date = await this.getDate();
        
        // Create yesterday's date at noon to avoid timezone issues
        const now = new Date();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12, 0, 0);
        
        console.log('List date:', date, 'Day:', date.getDate(), 'Month:', date.getMonth() + 1);
        console.log('Yesterday date:', yesterday, 'Day:', yesterday.getDate(), 'Month:', yesterday.getMonth() + 1);
        
        // Compare only the date components (year, month, day)
        const result = (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
        
        console.log('Is yesterday?', result);
        return result;
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): MenuListItem {
        return new MenuListItem(locator);
    }

    /**
     * Get all meal items in this daily menu list
     * @returns Array of MenuListItem objects
     */
    public async getMeals(): Promise<MenuListItem[]> {
        return super.getItems();
    }
    
    /**
     * Get only available meals (meals that can be ordered) from this daily menu list
     * @returns Array of available MenuListItem objects
     */
    public async getAvailableMeals(): Promise<MenuListItem[]> {
        const allMeals = await this.getMeals();
        const availableMeals: MenuListItem[] = [];
        
        for (const meal of allMeals) {
            if (await meal.canBeOrdered()) {
                availableMeals.push(meal);
            }
        }
        
        return availableMeals;
    }
}
