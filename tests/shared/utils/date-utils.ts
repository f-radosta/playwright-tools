/**
 * Date utilities for parsing and formatting dates from UI elements
 */

/**
 * Interface for parsed date and time information
 */
export interface ParsedDateTimeInfo {
    startDate: Date | null;
    endDate: Date | null;
    startTime: string | null;
    endTime: string | null;
    isSingleDay: boolean;
}

/**
 * Parse date and time information from various Czech date formats in the UI
 * Handles multiple formats:
 * 1. Two-day format: "od 12. 6. 2025 13:20\ndo 22. 6. 2025 18:18"
 * 2. Single-day with times: "19. 3. 2026\n7:11 - 8:11"
 * 3. Single-day combined: "1. 1. 2100 10:00 - 11:00"
 */
export function parseDateTimes(dateText: string | null): ParsedDateTimeInfo {
    if (!dateText) {
        return getEmptyDateTimeInfo();
    }

    try {
        // First check if it's a single line with 'od' and 'do' (without newlines)
        if (
            dateText.includes('od') &&
            dateText.includes('do') &&
            !dateText.includes('\n')
        ) {
            // Handle single line format: "od 14. 6. 2025 13:15 do 19. 6. 2025 17:30"
            const [odPart, doPart] = dateText.split(' do ');
            if (odPart && doPart) {
                return parseTwoDayFormat(odPart, 'do ' + doPart);
            }
        }

        const lines = dateText.split('\n').map(line => line.trim());

        // Format 2: Single day with date and time range on separate lines
        if (lines.length === 2 && lines[1].includes('-')) {
            return parseSingleDayTwoLines(lines[0], lines[1]);
        }

        // Format 3: Single day with date and time range on one line
        if (dateText.includes(' - ')) {
            return parseSingleDayOneLine(dateText);
        }

        // If we got here, the format is not recognized
        console.error('Unknown date format:', dateText);
        return getEmptyDateTimeInfo();
    } catch (error) {
        console.error('Failed to parse date times:', error);
        return getEmptyDateTimeInfo();
    }
}

/**
 * Parse two-day format: "od 12. 6. 2025 13:20\ndo 22. 6. 2025 18:18"
 */
function parseTwoDayFormat(
    startLine: string,
    endLine: string
): ParsedDateTimeInfo {
    try {
        const startDateStr = startLine.replace(/^od\s+/, '');
        const endDateStr = endLine.replace(/^do\s+/, '');

        // Parse start date
        const [startDay, startMonth, startYearTime] = startDateStr.split('. ');
        const [startYear, startTime] = startYearTime.split(' ');
        const [startHour, startMinute] = startTime.split(':');
        const startDate = new Date(
            parseInt(startYear, 10),
            parseInt(startMonth, 10) - 1,
            parseInt(startDay, 10),
            parseInt(startHour, 10),
            parseInt(startMinute, 10)
        );

        // Parse end date
        const [endDay, endMonth, endYearTime] = endDateStr.split('. ');
        const [endYear, endTime] = endYearTime.split(' ');
        const [endHour, endMinute] = endTime.split(':');
        const endDate = new Date(
            parseInt(endYear, 10),
            parseInt(endMonth, 10) - 1,
            parseInt(endDay, 10),
            parseInt(endHour, 10),
            parseInt(endMinute, 10)
        );

        return {
            startDate,
            endDate,
            startTime,
            endTime,
            isSingleDay: false
        };
    } catch (error) {
        console.error('Failed to parse two-day format:', error);
        return getEmptyDateTimeInfo();
    }
}

/**
 * Parse single-day format with date and time on separate lines:
 * "19. 3. 2026\n7:11 - 8:11"
 */
function parseSingleDayTwoLines(
    dateLine: string,
    timeLine: string
): ParsedDateTimeInfo {
    try {
        // Parse date
        const [day, month, year] = dateLine.split('. ');

        // Parse times
        const [startTime, endTime] = timeLine.split(' - ');

        // Create start date with time
        const [startHour, startMinute] = startTime
            .split(':')
            .map(val => parseInt(val, 10));
        const startDate = new Date(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            startHour || 0,
            startMinute || 0
        );

        // Create end date with time
        const [endHour, endMinute] = endTime
            .split(':')
            .map(val => parseInt(val, 10));
        const endDate = new Date(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            endHour || 0,
            endMinute || 0
        );

        return {
            startDate,
            endDate,
            startTime,
            endTime,
            isSingleDay: true
        };
    } catch (error) {
        console.error('Failed to parse single-day two-lines format:', error);
        return getEmptyDateTimeInfo();
    }
}

/**
 * Parse single-day format with date and time on one line:
 * "1. 1. 2100 10:00 - 11:00"
 */
function parseSingleDayOneLine(dateText: string): ParsedDateTimeInfo {
    try {
        console.log(
            'Attempting to parse single-day one-line format:',
            dateText
        );

        // Use regex to extract the date and time parts
        // Note: In JS regex literals, backslashes need to be escaped with another backslash
        const dateRegex =
            /(\d+)\.(\s*)(\d+)\.(\s*)(\d+)(\s+)(\d+):(\d+)(\s*)-(\s*)(\d+):(\d+)/;
        const dateMatch = dateText.match(dateRegex);

        if (dateMatch) {
            // Extract groups - note indexes depend on capturing groups in the regex
            const day = dateMatch[1];
            const month = dateMatch[3];
            const year = dateMatch[5];
            const startHour = dateMatch[7];
            const startMinute = dateMatch[8];
            const endHour = dateMatch[11];
            const endMinute = dateMatch[12];

            const startTime = `${startHour}:${startMinute}`;
            const endTime = `${endHour}:${endMinute}`;

            console.log('Parsed date components:', {
                day,
                month,
                year,
                startTime,
                endTime
            });

            // Create date objects
            const startDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                parseInt(startHour, 10),
                parseInt(startMinute, 10)
            );

            const endDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                parseInt(endHour, 10),
                parseInt(endMinute, 10)
            );

            return {
                startDate,
                endDate,
                startTime,
                endTime,
                isSingleDay: true
            };
        }

        // If regex failed, try a simpler split approach
        console.log('Regex failed, trying split approach');
        const parts = dateText.split(' ');

        // Filter out empty parts and clean up periods from date parts
        const filteredParts = parts.filter(p => p.trim().length > 0);

        // Expected format after filtering: ["1.", "1.", "2100", "10:00", "-", "11:00"]
        if (filteredParts.length >= 6) {
            const day = filteredParts[0].replace(/\./, '');
            const month = filteredParts[1].replace(/\./, '');
            const year = filteredParts[2];

            // Find the time components (those containing ':')
            let startTimeIndex = filteredParts.findIndex(p => p.includes(':'));
            if (startTimeIndex === -1) return getEmptyDateTimeInfo();

            const startTime = filteredParts[startTimeIndex];

            // Find the dash separator
            const dashIndex = filteredParts.findIndex(p => p === '-');
            if (dashIndex === -1 || dashIndex <= startTimeIndex) {
                return getEmptyDateTimeInfo();
            }

            // End time should be after the dash
            const endTime = filteredParts[dashIndex + 1];
            if (!endTime || !endTime.includes(':')) {
                return getEmptyDateTimeInfo();
            }

            // Parse time components
            const [startHour, startMinute] = startTime
                .split(':')
                .map(n => parseInt(n, 10));
            const [endHour, endMinute] = endTime
                .split(':')
                .map(n => parseInt(n, 10));

            console.log('Split approach parsed components:', {
                day,
                month,
                year,
                startTime,
                endTime
            });

            const startDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                startHour || 0,
                startMinute || 0
            );

            const endDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                endHour || 0,
                endMinute || 0
            );

            return {
                startDate,
                endDate,
                startTime,
                endTime,
                isSingleDay: true
            };
        }

        throw new Error(`Could not parse single-day format: "${dateText}"`);
    } catch (error) {
        console.error('Failed to parse single-day one-line format:', error);
        return getEmptyDateTimeInfo();
    }
}

/**
 * Returns an empty date time info object
 */
function getEmptyDateTimeInfo(): ParsedDateTimeInfo {
    return {
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        isSingleDay: false
    };
}

/**
 * Format a date for display in Czech format (D. M. YYYY)
 */
export function formatCzechDate(date: Date | null): string {
    if (!date) {
        return '';
    }
    return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
}

/**
 * Format time in HH:MM format
 */
export function formatTime(date: Date | null): string {
    if (!date) {
        return '';
    }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Generate a date range string in the format 'DD.MM.YYYY - DD.MM.YYYY'
 * @param startDate The start date of the range
 * @param endDate The end date of the range (optional, if not provided, only the start date is used)
 * @returns A formatted date range string
 */
export function generateDateRangeString(
    startDate: Date,
    endDate?: Date
): string {
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
 * Generate a date range string starting from an offset day and spanning for N days
 * @param daysToInclude Number of days to include in the range
 * @param startOffset Number of days to offset from today (0 = today, 1 = tomorrow, etc.)
 * @returns A formatted date range string
 */
export function generateDateRangeForDays(
    daysToInclude: number = 4,
    startOffset: number = 0
): string {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + startOffset);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysToInclude - 1); // -1 because we count the start day

    return generateDateRangeString(startDate, endDate);
}

/**
 * Generate a date range string for only tomorrow
 * @returns A formatted date range for tomorrow only
 */
export function generateTomorrowDateRange(): string {
    return generateDateRangeForDays(1, 1);
}

/**
 * Generate a date range string for only the day after tomorrow
 * @returns A formatted date range for the day after tomorrow only
 */
export function generateDayAfterTomorrowDateRange(): string {
    return generateDateRangeForDays(1, 2);
}

/**
 * Calculate days until next weekend (Saturday)
 * @param nextWeekend If true, get days to the weekend after the next one
 * @returns Number of days until next Saturday
 */
export function getDaysToNextWeekend(nextWeekend: boolean = false): number {
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
export function generateWeekendDateRange(nextWeekend: boolean = false): string {
    const today = new Date();
    const daysToSaturday = getDaysToNextWeekend(nextWeekend);

    // Create date range from Saturday to Sunday
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysToSaturday);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    return generateDateRangeString(saturday, sunday);
}

/**
 * Generate a month string in the format 'MM/YYYY'
 * @param month The month (0-11 or Month enum)
 * @param year The year (defaults to current year)
 * @returns A formatted month string
 */
export function generateMonthString(
    month: Month | number,
    year: number = new Date().getFullYear()
): string {
    const monthNum = (month + 1).toString().padStart(2, '0');
    return `${monthNum}/${year}`;
}
