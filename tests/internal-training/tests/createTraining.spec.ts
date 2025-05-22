import { userTest } from '@auth/auth.fixture';
import { TrainingApp } from '@training/pages/training-app.factory';
import { DuplicateCategoryError } from '@training/pages/categories.page';
import { NewTrainingFormDTO } from '@training/pages/training-list.page';

userTest('Create and delete training as user', async ({ trainingApp }: { trainingApp: TrainingApp }) => {
    // const categoriesPage = await trainingApp.gotoCategories();
    // const newCategoryName = 'New Category ATest';

    // // Add new category (if does not exist)
    // try {
    //     await categoriesPage.createNewCategory(newCategoryName);
    //     console.log(`Successfully created category: ${newCategoryName}`);
    // } catch (error) {
    //     if (!(error instanceof DuplicateCategoryError)) {
    //         throw error;
    //     }
    // }
    // const category = await categoriesPage.categoriesList.findCategoryByName(newCategoryName);
    // if (!category) {
    //     throw new Error(`Category "${newCategoryName}" not found`);
    // }

    const trainingListPage = await trainingApp.gotoTrainingList();
    const newTrainingDTO: NewTrainingFormDTO = {
        //category: newCategoryName,
        category: 'test',
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

    // // Delete the category
    // await categoriesPage.categoriesList.deleteCategoryByName(newCategoryName);
    // console.log(`Successfully deleted category: ${newCategoryName}`);
  
});

// Přihlásit se pod uživatelem bez rolí
// Na url / kliknout na dlaždici Interní školení
// Uživatel je přesměrován na HP Interního školení
// V levém sloupci vybrat Interní školení -> Kategorie školení
// Uživatel je přesměrován na výpis kategorií(/hr/course - category /) a kliknout na tláčo "Přidat"
// Ve formuláři vyplnit pole "Název kategorie školení" a kliknout na tláčo "Přidat"
// Přesměruje zpět do výpisu kategorií
// Ve výpisu zkontrolovat zda přibyla nově vytvořená kategorie

// V levém sloupci vybrat Interní školení -> Seznam školení
// Uživatel je přesměrován do seznamu školení(/hr/training - course / internal / list) a kliknout na tláčo "Vytvořit školení"
// Ve formuláři vyplnit pole:
// Kategorie školení - vybrat nově vytvořenou kategorii
// Název školení - vyplnit název
// Popis - vyplnit popis(lorem ipsum)
// Školitele - vybrat uživatele(např. "Administrátor")
// Oddělení - vybrat oddělení "ATesting-oddeleni"
// Kapacitu - zadat hodnotu 10
// Začátek a konec školení - nastavit budoucí datum
// Kliknout na tláčo "Uložit"
// Přesměruje zpět do seznamu školení

// Ve výpisu zkontrolovat zda přibylo nově vytvořené školení
// Nově vytvořené školení smazat přes ikonku popelnice
// V levém sloupci vybrat Interní školení -> Kategorie školení
// Uživatel je přesměrován na výpis kategorií(/hr/course - category /)
// Nově vytvořenou kategorii smazat přes ikonku popelnice
