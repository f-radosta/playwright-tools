import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {expect} from '@playwright/test';
import {log} from '@shared/utils/config';
import {TrainingTestCase} from '@training-models/training.types';
import {getTestCases} from '@training-test-data/training-test-data';
import {
    createTraining,
    deleteTraining,
    navigateAndFilterTrainings,
    verifyTrainingDetails
} from '@training-testers/training-tester';

const testCases = getTestCases();

testCases.forEach((testCase: TrainingTestCase) => {
    userTest(testCase.testName, async ({app}: {app: AppFactory}) => {
        // Step 1: Navigate and filter trainings if criteria provided
        const {success, trainingListPage} = await navigateAndFilterTrainings(
            app,
            testCase.filterCriteria
        );

        if (!success) {
            log('Failed to navigate and filter trainings');
            return;
        }

        // Step 2: Create a new training
        const {success: createSuccess, trainingDetails} = await createTraining(
            trainingListPage,
            testCase.trainingData
        );

        expect(createSuccess, 'Training creation should succeed').toBeTruthy();
        expect(
            trainingDetails,
            'Training details should be returned'
        ).toBeDefined();

        // Step 3: Verify training details if specified
        if (testCase.shouldVerifyDetails && trainingDetails) {
            const detailsVerified = await verifyTrainingDetails(
                trainingListPage,
                trainingDetails
            );
            expect(
                detailsVerified,
                'Training details should match expected values'
            ).toBeTruthy();
        }

        // Step 4: Delete training if specified
        if (testCase.shouldDelete && trainingDetails) {
            const deleteSuccess = await deleteTraining(
                trainingListPage,
                trainingDetails.name
            );
            expect(
                deleteSuccess,
                'Training deletion should succeed'
            ).toBeTruthy();
        }
    });
});
