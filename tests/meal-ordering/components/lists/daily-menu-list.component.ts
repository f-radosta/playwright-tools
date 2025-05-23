import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared/components/base-list.component';
import {ListInterface} from '@shared/components/interfaces/list.interface';
import {MenuListItem} from '@meal/components';

export class DailyMenuList
    extends BaseListComponent<MenuListItem>
    implements ListInterface
{
    private _date: Date | null = null;

    constructor(public readonly listAndFilterWrapperLocator: Locator) {
        super(listAndFilterWrapperLocator);
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
            const headerLocator =
                this.listAndFilterWrapperLocator.getByTestId('list-header');
            const headerText = await headerLocator.textContent();

            if (headerText) {
                // Extract date from header text - this will need to be adjusted based on your actual format
                this._date = this.extractDateFromText(headerText);
            } else {
                // If no header text, try to get it from the list title or other element
                const titleLocator =
                    this.listAndFilterWrapperLocator.getByTestId('list-title');
                const titleText = await titleLocator.textContent();

                if (titleText) {
                    this._date = this.extractDateFromText(titleText);
                } else {
                    // Fallback to current date if no date information is found
                    this._date = new Date();
                }
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
     * This method should be customized based on the actual date format in your application
     */
    private extractDateFromText(text: string): Date {
        // This is a simple example that looks for common date formats
        // You'll need to adjust this based on your actual date format
        const dateRegex = /\b(\d{1,2})[\.\/\-](\d{1,2})[\.\/\-](\d{2,4})\b/;
        const match = text.match(dateRegex);

        if (match) {
            const [_, day, month, year] = match;
            // Adjust year if it's a 2-digit format
            const fullYear = year.length === 2 ? `20${year}` : year;
            return new Date(`${fullYear}-${month}-${day}`);
        }

        // Try to find day names like "Today", "Tomorrow", etc.
        const today = new Date();

        if (text.toLowerCase().includes('today')) {
            return today;
        } else if (text.toLowerCase().includes('tomorrow')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        } else if (text.toLowerCase().includes('yesterday')) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday;
        }

        // Default to today if no date is found
        return today;
    }

    /**
     * Check if this list is for today
     */
    public async isToday(): Promise<boolean> {
        const date = await this.getDate();
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    /**
     * Check if this list is for tomorrow
     */
    public async isTomorrow(): Promise<boolean> {
        const date = await this.getDate();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        );
    }

    /**
     * Check if this list is for yesterday
     */
    public async isYesterday(): Promise<boolean> {
        const date = await this.getDate();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): MenuListItem {
        return new MenuListItem(locator);
    }
}
