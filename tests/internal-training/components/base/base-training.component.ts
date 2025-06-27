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
