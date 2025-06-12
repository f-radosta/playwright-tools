import {Locator} from '@playwright/test';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import {BaseTraining} from '@training-models/training.types';

/**
 * Base component providing common training functionality implementations
 * Implements the BaseTraining interface from training.types
 */
export abstract class BaseTrainingComponent
    extends BaseListItemComponent
    implements BaseTraining
{
    /**
     * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
     */
    protected normalizeText(text: string | null): string {
        if (text === null) return '';
        return text.trim().replace(/\s+/g, ' ');
    }

    /**
     * Helper to safely extract text content and normalize it
     */
    protected async safeGetText(locator: Locator): Promise<string | null> {
        try {
            const text = await locator.textContent();
            if (text === null || text.trim() === '') return null;
            return this.normalizeText(text);
        } catch (error) {
            console.error('Failed to get text content:', error);
            return null;
        }
    }

    /**
     * Get the name of the training
     */
    abstract getName(): Promise<string | null>;

    /**
     * Get the category of the training
     */
    abstract getCategory(): Promise<string | null>;

    /**
     * Get the trainer of the training
     */
    abstract getTrainer(): Promise<string | null>;

    /**
     * Get the department of the training
     */
    abstract getDepartment(): Promise<string | null>;

    /**
     * Get the start date of the training
     */
    abstract getStartDate(): Promise<Date | null>;

    /**
     * Get the end date of the training
     */
    abstract getEndDate(): Promise<Date | null>;

    /**
     * Get the capacity of the training
     */
    abstract getCapacity(): Promise<number | null>;
}
