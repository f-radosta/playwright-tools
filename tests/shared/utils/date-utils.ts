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
 * Utility class for parsing dates and times from text in various formats
 */
export class DateTimeUtils {
    /**
     * Parse date and time information from various Czech date formats in the UI
     * Handles multiple formats:
     * 1. Two-day format: "od 12. 6. 2025 13:20\ndo 22. 6. 2025 18:18"
     * 2. Single-day with times: "19. 3. 2026\n7:11 - 8:11"
     * 3. Single-day combined: "1. 1. 2100 10:00 - 11:00"
     */
    static parseDateTimes(dateText: string | null): ParsedDateTimeInfo {
        if (!dateText) {
            return this.getEmptyDateTimeInfo();
        }

        try {
            const lines = dateText.split('\n').map(line => line.trim());

            // Format 1: Two-day format with "od" and "do"
            if (
                lines.length === 2 &&
                lines[0].includes('od') &&
                lines[1].includes('do')
            ) {
                return this.parseTwoDayFormat(lines[0], lines[1]);
            }

            // Format 2: Single day with date and time range on separate lines
            else if (lines.length === 2 && lines[1].includes('-')) {
                return this.parseSingleDayTwoLines(lines[0], lines[1]);
            }

            // Format 3: Single day with date and time range on one line
            else if (dateText.includes(' - ')) {
                return this.parseSingleDayOneLine(dateText);
            }

            // Unknown format
            else {
                console.error('Unknown date format:', dateText);
                return this.getEmptyDateTimeInfo();
            }
        } catch (error) {
            console.error('Failed to parse date times:', error);
            return this.getEmptyDateTimeInfo();
        }
    }

    /**
     * Parse two-day format: "od 12. 6. 2025 13:20\ndo 22. 6. 2025 18:18"
     */
    private static parseTwoDayFormat(
        startLine: string,
        endLine: string
    ): ParsedDateTimeInfo {
        try {
            const startDateStr = startLine.replace(/^od\s+/, '');
            const endDateStr = endLine.replace(/^do\s+/, '');

            // Parse start date
            const [startDay, startMonth, startYearTime] =
                startDateStr.split('. ');
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
            return this.getEmptyDateTimeInfo();
        }
    }

    /**
     * Parse single-day format with date and time on separate lines:
     * "19. 3. 2026\n7:11 - 8:11"
     */
    private static parseSingleDayTwoLines(
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
            console.error(
                'Failed to parse single-day two-lines format:',
                error
            );
            return this.getEmptyDateTimeInfo();
        }
    }

    /**
     * Parse single-day format with date and time on one line:
     * "1. 1. 2100 10:00 - 11:00"
     */
    private static parseSingleDayOneLine(dateText: string): ParsedDateTimeInfo {
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
                let startTimeIndex = filteredParts.findIndex(p =>
                    p.includes(':')
                );
                if (startTimeIndex === -1) return this.getEmptyDateTimeInfo();

                const startTime = filteredParts[startTimeIndex];

                // Find the dash separator
                const dashIndex = filteredParts.findIndex(p => p === '-');
                if (dashIndex === -1 || dashIndex <= startTimeIndex) {
                    return this.getEmptyDateTimeInfo();
                }

                // End time should be after the dash
                const endTime = filteredParts[dashIndex + 1];
                if (!endTime || !endTime.includes(':')) {
                    return this.getEmptyDateTimeInfo();
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
            return this.getEmptyDateTimeInfo();
        }
    }

    /**
     * Returns an empty date time info object
     */
    private static getEmptyDateTimeInfo(): ParsedDateTimeInfo {
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
    static formatCzechDate(date: Date | null): string {
        if (!date) {
            return '';
        }
        return `${date.getDate()}. ${
            date.getMonth() + 1
        }. ${date.getFullYear()}`;
    }

    /**
     * Format time in HH:MM format
     */
    static formatTime(date: Date | null): string {
        if (!date) {
            return '';
        }
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
