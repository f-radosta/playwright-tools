import {Locator} from '@playwright/test';
import {SingleFilterInterface} from '@shared-interfaces/single-filter.interface';

/**
 * Enum for months
 */
export enum Month {
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11
}

/**
 * Component for date filter controls
 */
export class DateFilterComponent implements SingleFilterInterface {
    /**
     * @param locator The locator for the date input field
     */
    constructor(readonly locator: Locator) {}

    /**
     * Sets the date filter value
     * @param date Date string in the format expected by the date input (YYYY-MM-DD)
     */
    async setDate(date: string): Promise<void> {
        await this.setDateFilter(date, this.locator);
    }

    /**
     * Generate a date range string in the format 'DD.MM.YYYY - DD.MM.YYYY'
     * @param startDate The start date of the range
     * @param endDate The end date of the range (optional, if not provided, only the start date is used)
     * @returns A formatted date range string
     */
    static generateDateRangeString(startDate: Date, endDate?: Date): string {
        const formatDate = (date: Date): string => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        if (!endDate) {
            return formatDate(startDate);
        }

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    /**
     * Generate a date range string starting from an offset day and spanning for N days
     * @param daysToInclude Number of days to include in the range
     * @param startOffset Number of days to offset from today (0 = today, 1 = tomorrow, etc.)
     * @returns A formatted date range string
     */
    static generateDateRangeForDays(daysToInclude: number = 4, startOffset: number = 0): string {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + startOffset);
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + daysToInclude - 1); // -1 because we count the start day
        
        return this.generateDateRangeString(startDate, endDate);
    }
    
    /**
     * Generate a date range string for only tomorrow
     * @returns A formatted date range for tomorrow only
     */
    static generateTomorrowDateRange(): string {
        return this.generateDateRangeForDays(1, 1);
    }
    
    /**
     * Generate a date range string for only the day after tomorrow
     * @returns A formatted date range for the day after tomorrow only
     */
    static generateDayAfterTomorrowDateRange(): string {
        return this.generateDateRangeForDays(1, 2);
    }
    
    /**
     * Calculate days until next weekend (Saturday)
     * @param nextWeekend If true, get days to the weekend after the next one
     * @returns Number of days until next Saturday
     */
    static getDaysToNextWeekend(nextWeekend: boolean = false): number {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Calculate days until next Saturday
        let daysToSaturday = (6 - currentDay) % 7;
        if (daysToSaturday === 0 && today.getHours() >= 12) {
            // If it's already Saturday afternoon, target next weekend
            daysToSaturday = 7;
        }
        
        // If we want the weekend after the next one
        if (nextWeekend) {
            daysToSaturday += 7;
        }
        
        return daysToSaturday;
    }
    
    /**
     * Generate a date range for the weekend (Saturday and Sunday)
     * @param nextWeekend If true, get the weekend after this coming weekend
     * @returns A formatted date range for the weekend
     */
    static generateWeekendDateRange(nextWeekend: boolean = false): string {
        const today = new Date();
        const daysToSaturday = this.getDaysToNextWeekend(nextWeekend);
        
        // Create date range from Saturday to Sunday
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysToSaturday);
        
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        
        return this.generateDateRangeString(saturday, sunday);
    }

    /**
     * Generate a month string in the format 'MM/YYYY'
     * @param month The month (0-11 or Month enum)
     * @param year The year (defaults to current year)
     * @returns A formatted month string
     */
    static generateMonthString(month: Month | number, year: number = new Date().getFullYear()): string {
        const monthNum = (month + 1).toString().padStart(2, '0');
        return `${monthNum}/${year}`;
    }

    /**
     * Sets a date filter value
     * @param date Date string in the format expected by the date input
     * @param dateInputLocator The locator for the date input
     */
    protected async setDateFilter(date: string, dateInputLocator: Locator) {
        // Remove the readonly attribute before filling
        await dateInputLocator.evaluate(element => {
            element.removeAttribute('readonly');
        });

        // Fill the date input
        await dateInputLocator.fill(date);
    }
}
