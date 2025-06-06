/**
 * Training system type definitions
 */

/**
 * Data transfer object for the new training form
 */
export interface NewTrainingFormDTO {
    category: string;
    name: string;
    description: string;
    trainer: string;
    department: string;
    capacity: number;
    startDate: string;
    endDate: string;
    issueId?: string;
    roomName?: string;
    online?: boolean;
    registrationDeadline?: string;
    reasonForClosingTheRegistration?: string;
}

/**
 * Interface for a training item in the list
 */
export interface Training {
    name: string;
    category: string;
    description: string;
    trainer: string;
    department: string;
    capacity: number;
    startDate: Date | string;
    endDate: Date | string;
    participants?: number;
    online?: boolean;
}

/**
 * Filter criteria for training list
 */
export interface TrainingFilterDTO {
    category?: string;
    name?: string;
    trainer?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    participant?: string;
    online?: boolean;
    includePast?: boolean;
}

/**
 * Simple DTO for category filtering
 */
export interface CategoryDTO {
    categoryName: string;
}

/**
 * Base interface for a component that displays training details
 */
export interface BaseTraining {
    getName(): Promise<string | null>;
    getCategory(): Promise<string | null>;
    getTrainer(): Promise<string | null>;
    getDepartment(): Promise<string | null>;
    getStartDate(): Promise<Date | null>;
    getEndDate(): Promise<Date | null>;
    getCapacity(): Promise<number | null>;
}

/**
 * Test case definition for training
 */
export interface TrainingTestCase {
    testName: string;
    filterCriteria?: TrainingFilterDTO;
    trainingData: NewTrainingFormDTO;
    shouldDelete?: boolean;
    shouldVerifyDetails?: boolean;
}
