import { userTest } from '@auth/app-auth.fixture';
import { AppFactory } from '@shared/pages/app.factory';
import { NewTrainingFormDTO } from '@training/pages/training-list.page';

userTest('Create and delete training as user', async ({ app }: { app: AppFactory }) => {

    const trainingListPage = await app.gotoTrainingList();
    const newTrainingDTO: NewTrainingFormDTO = {
        category: 'ATesting-kategorie-skoleni',
        name: 'New Training ATest',
        description: 'popis',
        trainer: 'Administrátor',
        department: 'ATesting-oddeleni',
        capacity: 10,
        startDate: '01.01.2100 10:00',
        endDate: '01.01.2100 11:00'
    };

    await trainingListPage.createNewTraining(newTrainingDTO);
    const training = await trainingListPage.trainingsList.findTrainingByName(newTrainingDTO.name);
    if (!training) {
        throw new Error(`Training "${newTrainingDTO.name}" not found`);
    }
    await training.deleteItself();
  
});
