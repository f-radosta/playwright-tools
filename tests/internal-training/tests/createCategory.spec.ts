import {userTest} from '@auth/app-auth.fixture';
import {AppFactory} from '@shared-pages/app.factory';
import {DuplicateCategoryError} from '@training-pages/categories.page';

userTest(
    'Create and delete category as user',
    async ({app}: {app: AppFactory}) => {
        const categoriesPage = await app.gotoCategories();
        const newCategoryName = 'New Category ATest';

        // Add new category (delete duplicate if exists)
        try {
            await categoriesPage.createNewCategory(newCategoryName);
        } catch (error) {
            if (error instanceof DuplicateCategoryError) {
                await categoriesPage.categoriesList.deleteCategoryByName(
                    newCategoryName
                );
                await categoriesPage.page.reload();
                await categoriesPage.createNewCategory(newCategoryName);
            } else {
                throw error;
            }
        }

        // Delete the category
        await categoriesPage.categoriesList.deleteCategoryByName(
            newCategoryName
        );
    }
);
