import {
    NewTrainingFormDTO,
    TrainingFilterDTO,
    TrainingTestCase
} from '@training/models/training.types';

/**
 * Provides test data for training-related test cases
 */
export class TrainingTestDataProvider {
    /**
     * Get default filter criteria for training tests
     */
    static getDefaultFilterCriteria(): TrainingFilterDTO {
        return {
            category: 'ATesting-kategorie-skoleni',
            department: 'ATesting-oddeleni'
        };
    }

    /**
     * Creates a new training DTO with unique name using timestamp
     */
    static getNewTrainingDTO(
        namePrefix = 'New Training ATest'
    ): NewTrainingFormDTO {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return {
            category: 'ATesting-kategorie-skoleni',
            name: `${namePrefix} ${timestamp}`,
            description: 'Automated test training description',
            trainer: 'Administrátor',
            department: 'ATesting-oddeleni',
            capacity: 10,
            startDate: '01.01.2100 10:00',
            endDate: '01.01.2100 11:00'
        };
    }

    /**
     * Creates a new training DTO with single day format (for date parsing tests)
     */
    static getNewSingleDayTrainingDTO(): NewTrainingFormDTO {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();

        return {
            category: 'ATesting-kategorie-skoleni',
            name: `Single-Day Format ${timestamp}`,
            description:
                'Training with single day format for testing date parsing',
            trainer: 'Administrátor',
            department: 'ATesting-oddeleni',
            capacity: 15,
            // Format: DD.MM.YYYY HH:MM (single day with start/end time)
            startDate: `${day}.${month}.${year} 09:30`,
            endDate: `${day}.${month}.${year} 16:45`
        };
    }

    /**
     * Creates a new training DTO with multi-day format (for date parsing tests)
     */
    static getNewMultiDayTrainingDTO(): NewTrainingFormDTO {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 10); // End 10 days later

        const startDay = startDate.getDate().toString().padStart(2, '0');
        const startMonth = (startDate.getMonth() + 1)
            .toString()
            .padStart(2, '0');
        const startYear = startDate.getFullYear();

        const endDay = endDate.getDate().toString().padStart(2, '0');
        const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const endYear = endDate.getFullYear();

        return {
            category: 'ATesting-kategorie-skoleni',
            name: `Multi-Day Format ${timestamp}`,
            description:
                'Training with multi-day format for testing date parsing',
            trainer: 'Administrátor',
            department: 'ATesting-oddeleni',
            capacity: 25,
            // Format: DD.MM.YYYY HH:MM (multi-day with start/end dates and times)
            startDate: `${startDay}.${startMonth}.${startYear} 13:15`,
            endDate: `${endDay}.${endMonth}.${endYear} 17:30`
        };
    }

    /**
     * Returns all test cases for training tests
     */
    static getTestCases(): TrainingTestCase[] {
        return [
            {
                testName: 'Create and delete training',
                trainingData: this.getNewTrainingDTO(),
                shouldDelete: true
            },
            {
                testName: 'Create training with filter and verify details',
                filterCriteria: this.getDefaultFilterCriteria(),
                trainingData: this.getNewTrainingDTO('Filtered Training Test'),
                shouldDelete: true,
                shouldVerifyDetails: true
            },
            {
                testName: 'Create training with maximum capacity',
                trainingData: {
                    ...this.getNewTrainingDTO('Max Capacity Training'),
                    capacity: 50
                },
                shouldDelete: true
            },
            // Date format test cases
            {
                testName:
                    'Create single-day format training and verify date parsing',
                trainingData: this.getNewSingleDayTrainingDTO(),
                shouldDelete: true,
                shouldVerifyDetails: true
            },
            {
                testName:
                    'Create multi-day format training and verify date parsing',
                trainingData: this.getNewMultiDayTrainingDTO(),
                shouldDelete: true,
                shouldVerifyDetails: true
            }
        ];
    }
}
