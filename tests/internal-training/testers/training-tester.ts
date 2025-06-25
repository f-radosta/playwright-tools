import {expect} from '@playwright/test';
import {log} from '@shared/utils/config';
import {AppFactory} from '@shared-pages/app.factory';
import {
    NewTrainingFormDTO,
    TrainingFilterDTO,
    Training
} from '@training-models/training.types';
import {TrainingListPage} from '@training-pages/training-list.page';
import {formatCzechDate} from '@shared-utils/date-utils';

/**
 * Navigate to training list and apply filters
 */
export async function navigateAndFilterTrainings(
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
export async function createTraining(
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
export async function deleteTraining(
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
export async function verifyTrainingDetails(
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

        log('=== Training verification ===');
        log(
            `Name: Expected "${expectedTraining.name}" | Actual "${actualName}"`
        );
        log(
            `Category: Expected "${expectedTraining.category}" | Actual "${actualCategory}"`
        );
        log(
            `Trainer: Expected "${expectedTraining.trainer}" | Actual "${actualTrainer}"`
        );
        log(
            `Department: Expected "${expectedTraining.department}" | Actual "${actualDepartment}"`
        );

        log('Date details:');
        log(
            `  Format: ${dateInfo.isSingleDay ? 'Single day' : 'Two days'}`
        );
        log(
            `  Start date: ${formatCzechDate(actualStartDate)} ${
                dateInfo.startTime || ''
            }`
        );
        log(
            `  End date: ${formatCzechDate(actualEndDate)} ${
                dateInfo.endTime || ''
            }`
        );
        log(
            `  Raw start date: ${actualStartDate?.toISOString() || 'N/A'}`
        );
        log(
            `  Raw end date: ${actualEndDate?.toISOString() || 'N/A'}`
        );
        log(`  Capacity: ${capacity}`);

        log(`  Raw date text from UI: "${rawDateText}"`);

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
