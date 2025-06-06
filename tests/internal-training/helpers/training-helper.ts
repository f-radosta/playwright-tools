import {expect} from '@playwright/test';
import {AppFactory} from '@shared/pages/app.factory';
import {
    NewTrainingFormDTO,
    TrainingFilterDTO,
    Training
} from '@training/models/training.types';
import {TrainingListPage} from '@training/pages/training-list.page';
import {DateTimeUtils} from '@shared/utils/date-utils';

/**
 * Helper methods for training-related test operations
 */
export class TrainingHelper {
    /**
     * Navigate to training list and apply filters
     */
    static async navigateAndFilterTrainings(
        app: AppFactory,
        filterCriteria?: TrainingFilterDTO
    ) {
        // Navigate to the training list page
        const trainingListPage = await app.gotoTrainingList();

        // Apply filters if provided
        if (filterCriteria) {
            await trainingListPage.trainingsList.trainingFilter.filter(
                filterCriteria
            );
        }

        // Get the filtered list
        const trainingsList = trainingListPage.trainingsList;
        expect(
            trainingsList,
            'Training list should be available'
        ).not.toBeNull();

        return {
            success: !!trainingsList,
            trainingListPage,
            trainingsList
        };
    }

    /**
     * Create a new training and return its details
     */
    static async createTraining(
        trainingListPage: TrainingListPage,
        trainingData: NewTrainingFormDTO
    ): Promise<{success: boolean; trainingDetails?: Training}> {
        try {
            // Create the training
            await trainingListPage.createNewTraining(trainingData);

            // Find the created training
            const training =
                await trainingListPage.trainingsList.findTrainingByName(
                    trainingData.name
                );

            if (!training) {
                console.error(
                    `Training "${trainingData.name}" not found after creation`
                );
                return {success: false};
            }

            // Extract training details if needed
            const trainingDetails: Training = {
                name: trainingData.name,
                category: trainingData.category,
                description: trainingData.description,
                trainer: trainingData.trainer,
                department: trainingData.department,
                capacity: trainingData.capacity,
                startDate: trainingData.startDate,
                endDate: trainingData.endDate
            };

            return {success: true, trainingDetails};
        } catch (error) {
            console.error('Failed to create training:', error);
            return {success: false};
        }
    }

    /**
     * Delete a training by name
     */
    static async deleteTraining(
        trainingListPage: TrainingListPage,
        trainingName: string
    ): Promise<boolean> {
        try {
            const training =
                await trainingListPage.trainingsList.findTrainingByName(
                    trainingName
                );

            if (!training) {
                console.error(
                    `Training "${trainingName}" not found for deletion`
                );
                return false;
            }

            await training.deleteItself();
            await trainingListPage.page.reload();

            // Verify it's gone
            const trainingAfterDelete =
                await trainingListPage.trainingsList.findTrainingByName(
                    trainingName
                );

            return trainingAfterDelete === null;
        } catch (error) {
            console.error('Failed to delete training:', error);
            return false;
        }
    }

    /**
     * Verify training details match expected values
     */
    static async verifyTrainingDetails(
        trainingListPage: TrainingListPage,
        expectedTraining: Training
    ): Promise<boolean> {
        try {
            const training =
                await trainingListPage.trainingsList.findTrainingByName(
                    expectedTraining.name
                );

            if (!training) {
                console.error(
                    `Training "${expectedTraining.name}" not found for verification`
                );
                return false;
            }

            // Verify basic details
            const actualName = await training.getName();
            const actualCategory = await training.getCategory();
            const actualTrainer = await training.getTrainer();
            const actualDepartment = await training.getDepartment();

            // Verify dates - using our enhanced date parsing
            const actualStartDate = await training.getStartDate();
            const actualEndDate = await training.getEndDate();
            const capacity = await training.getCapacity();

            // Get full date/time information for logging
            const dateInfo = await training.parseDateTimes();

            console.log('=== Training verification ===');
            console.log(
                `Name: Expected "${expectedTraining.name}" | Actual "${actualName}"`
            );
            console.log(
                `Category: Expected "${expectedTraining.category}" | Actual "${actualCategory}"`
            );
            console.log(
                `Trainer: Expected "${expectedTraining.trainer}" | Actual "${actualTrainer}"`
            );
            console.log(
                `Department: Expected "${expectedTraining.department}" | Actual "${actualDepartment}"`
            );

            // Log date information with better formatting using DateTimeUtils
            console.log('Date details:');
            console.log(
                `  Format: ${dateInfo.isSingleDay ? 'Single day' : 'Two days'}`
            );
            console.log(
                `  Start date: ${DateTimeUtils.formatCzechDate(
                    actualStartDate
                )} ${dateInfo.startTime || ''}`
            );
            console.log(
                `  End date: ${DateTimeUtils.formatCzechDate(actualEndDate)} ${
                    dateInfo.endTime || ''
                }`
            );
            console.log(
                `  Raw start date: ${actualStartDate?.toISOString() || 'N/A'}`
            );
            console.log(
                `  Raw end date: ${actualEndDate?.toISOString() || 'N/A'}`
            );
            console.log(`  Capacity: ${capacity}`);

            // For debugging, show the raw date text from the UI
            const rawDateText = await training.getDateTime();
            console.log(`  Raw date text from UI: "${rawDateText}"`);

            // Verify required fields
            expect(actualName).toBe(expectedTraining.name);
            expect(actualCategory).toBe(expectedTraining.category);
            expect(actualTrainer).toBe(expectedTraining.trainer);

            // Verify dates if provided in expected training
            if (expectedTraining.startDate) {
                expect(actualStartDate).not.toBeNull();
            }

            if (expectedTraining.endDate) {
                expect(actualEndDate).not.toBeNull();
            }

            return true;
        } catch (error) {
            console.error('Failed to verify training details:', error);
            return false;
        }
    }
}
