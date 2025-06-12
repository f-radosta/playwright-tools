import {
    NewTrainingFormDTO,
    TrainingFilterDTO,
    TrainingTestCase
} from '@training-models/training.types';

/**
 * Get default filter criteria for training tests
 */
export function getDefaultFilterCriteria(): TrainingFilterDTO {
    return {
        category: 'ATesting-kategorie-skoleni',
        department: 'ATesting-oddeleni'
    };
}

/**
 * Creates a new training DTO with unique name using timestamp
 */
export function getNewTrainingDTO(
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
export function getNewSingleDayTrainingDTO(): NewTrainingFormDTO {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    const day = futureDate.getDate().toString().padStart(2, '0');
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const year = futureDate.getFullYear();

    return {
        category: 'ATesting-kategorie-skoleni',
        name: `Single-Day Format ${timestamp}`,
        description: 'Automated test training with single day date format',
        trainer: 'Administrátor',
        department: 'ATesting-oddeleni',
        capacity: 5,
        startDate: `${day}.${month}.${year} 10:00`,
        endDate: `${day}.${month}.${year} 12:00`
    };
}

/**
 * Creates a new training DTO with multi-day format (for date parsing tests)
 */
export function getNewMultiDayTrainingDTO(): NewTrainingFormDTO {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);

    const startDay = startDate.getDate().toString().padStart(2, '0');
    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const startYear = startDate.getFullYear();

    const endDay = endDate.getDate().toString().padStart(2, '0');
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const endYear = endDate.getFullYear();

    return {
        category: 'ATesting-kategorie-skoleni',
        name: `Multi-Day Format ${timestamp}`,
        description: 'Training with multi-day format for testing date parsing',
        trainer: 'Administrátor',
        department: 'ATesting-oddeleni',
        capacity: 25,
        startDate: `${startDay}.${startMonth}.${startYear} 13:15`,
        endDate: `${endDay}.${endMonth}.${endYear} 17:30`
    };
}

/**
 * Returns all test cases for training tests
 */
export function getTestCases(): TrainingTestCase[] {
    return [
        {
            testName: 'Create and delete training',
            trainingData: getNewTrainingDTO(),
            shouldDelete: true
        },
        {
            testName: 'Create training with filter and verify details',
            filterCriteria: getDefaultFilterCriteria(),
            trainingData: getNewTrainingDTO('Filtered Training Test'),
            shouldDelete: true,
            shouldVerifyDetails: true
        },
        {
            testName: 'Create training with maximum capacity',
            trainingData: {
                ...getNewTrainingDTO('Max Capacity Training'),
                capacity: 50
            },
            shouldDelete: true
        },
        // Date format test cases
        {
            testName: 'Create single-day format training and verify date parsing',
            trainingData: getNewSingleDayTrainingDTO(),
            shouldDelete: true,
            shouldVerifyDetails: true
        },
        {
            testName: 'Create multi-day format training and verify date parsing',
            trainingData: getNewMultiDayTrainingDTO(),
            shouldDelete: true,
            shouldVerifyDetails: true
        }
    ];
}
