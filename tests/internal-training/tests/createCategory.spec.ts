import { userTest } from '@shared/fixtures/auth.fixture';
import { TrainingApp } from '@training/pages/training-app.factory';
import { DuplicateCategoryError } from '@training/pages/categories.page';
import { expect } from '@playwright/test';

/**
 * Přihlásit se pod uživatelem bez rolí
 * done
  Na url / kliknout na dlaždici Interní školení
  done
  Uživatel je přesměrován na HP Interního školení
  done
  V levém sloupci vybrat Interní školení -> Kategorie školení
  done
  Uživatel je přesměrován na výpis kategorií (/hr/course-category/) a kliknout na tláčo "Přidat"
  
  Ve formuláři vyplnit pole "Název kategorie školení" a kliknout na tláčo "Přidat"

  Přesměruje zpět do výpisu kategorií
  Ve výpisu zkontrolovat zda přibyla nově vytvořená kategorie
  Nově vytvořenou kategorii smazat přes ikonku popelnice
*/

// Test with user authentication
userTest('Create and delete category as user', async ({ trainingApp }: { trainingApp: TrainingApp }) => {
  // Navigate to categories page
  const categoriesPage = await trainingApp.gotoCategories();
  await categoriesPage.waitForPageLoad();

  const newCategoryName = 'New Category ATest';
  
  // // Filter categories by type
  // await categoriesPage.categoriesList.categoriesFilter.filter('Blue');

  // Add new category
  try {
    await categoriesPage.createNewCategory(newCategoryName);
    console.log(`Successfully created category: ${newCategoryName}`);
  } catch (error) {
    if (error instanceof DuplicateCategoryError) {
      await categoriesPage.categoriesList.deleteCategoryByName(newCategoryName);
      console.log(`Successfully deleted existing category: ${newCategoryName}`);
      
      await categoriesPage.page.reload();

      await categoriesPage.createNewCategory(newCategoryName);
      console.log(`Successfully created category: ${newCategoryName}`);
    } else {
      throw error;
    }
  }
  
  // Delete the category
  await categoriesPage.categoriesList.deleteCategoryByName(newCategoryName);
  console.log(`Successfully deleted category: ${newCategoryName}`);

});
