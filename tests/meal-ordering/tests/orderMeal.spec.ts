import { userTest } from '@auth/app-auth.fixture';
import { AppFactory } from '@shared/pages/app.factory';

userTest('Order a meal as user', async ({ app }: { app: AppFactory }) => {

    const currentMenuPage = await app.gotoCurrentMenu();

    //const availableMeals = await currentMenuPage.getAvailableMeals();


});
