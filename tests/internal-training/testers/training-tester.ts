import {expect} from '@playwright/test';
import {AppFactory} from '@shared-pages/app.factory';
import {
    NewTrainingFormDTO,
    TrainingFilterDTO,
    Training
} from '@training-models/training.types';
import {TrainingListPage} from '@training-pages/training-list.page';
import {DateTimeUtils} from '@shared-utils/date-utils';

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
        const trainingListPage = await app.gotoTrainingList();

        if (filterCriteria) {
            await trainingListPage.trainingsList.trainingFilter.filter(
                filterCriteria
            );
        }

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
            await trainingListPage.createNewTraining(trainingData);

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

            const [
                actualName,
                actualCategory,
                actualTrainer,
                actualDepartment,
                actualStartDate,
                actualEndDate,
                capacity,
                dateInfo,
                rawDateText
            ] = await Promise.all([
                training.getName(),
                training.getCategory(),
                training.getTrainer(),
                training.getDepartment(),
                training.getStartDate(),
                training.getEndDate(),
                training.getCapacity(),
                training.parseDateTimes(),
                training.getDateTime()
            ]);

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

            console.log(`  Raw date text from UI: "${rawDateText}"`);

            expect(actualName).toBe(expectedTraining.name);
            expect(actualCategory).toBe(expectedTraining.category);
            expect(actualTrainer).toBe(expectedTraining.trainer);

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
