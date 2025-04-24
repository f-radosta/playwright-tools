import { userTest } from '@auth/auth.fixture';
import { TrainingApp } from '@training/pages/training-app.factory';
import { DuplicateCategoryError } from '@training/pages/categories.page';

userTest('Create and delete category as user', async ({ trainingApp }: { trainingApp: TrainingApp }) => {
  const categoriesPage = await trainingApp.gotoCategories();
  await categoriesPage.expectPageHeaderVisible();

  const newCategoryName = 'New Category ATest';
  
  // Add new category (delete duplicate if exists)
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
