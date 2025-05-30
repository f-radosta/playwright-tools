import {Locator} from '@playwright/test';
import {SingleFilterInterface} from '../interfaces/single-filter.interface';

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
     * Generate a date range string for today and the next N days
     * @param daysToInclude Number of days to include in the range (including today)
     * @returns A formatted date range string
     */
    static generateDateRangeForDays(daysToInclude: number = 4): string {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + daysToInclude - 1); // -1 because we include today
        
        return this.generateDateRangeString(today, endDate);
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
