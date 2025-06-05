import {HomePage} from '@shared/pages/home-page.page';
import {BasePage} from '@shared/pages/base-page';
// Training imports
import {CategoriesPage} from '@training/pages/categories.page';
import {TrainingHomePage} from '@training/pages/training-home.page';
import {TrainingListPage} from '@training/pages/training-list.page';
// Meal ordering imports
import {CurrentMenuPage} from '@meal/pages/current-menu.page';
import {MonthlyBillingPage} from '@meal/pages/monthly-billing.page';
import {MealOrderHPPage} from '@meal/pages/meal-order-hp.page';

export class AppFactory {
    constructor(public readonly page: BasePage) {}

    // Common navigation
    async gotoDashboard(requireRedirect = true): Promise<HomePage> {
        await this.page.navigateAndWait(async () => {
            await this.page.homeLink().click();
        }, requireRedirect);
        return new HomePage(this.page.page);
    }

    // Training navigation methods
    async gotoCategories(requireRedirect = true): Promise<CategoriesPage> {
        await this.page.navigateAndWait(async () => {
            await this.page.navigateToTrainingCategories();
        }, requireRedirect);
        return new CategoriesPage(this.page.page);
    }

    async gotoTrainingHome(requireRedirect = true): Promise<TrainingHomePage> {
        await this.page.navigateAndWait(async () => {
            await this.page.trainingLink().click();
        }, requireRedirect);
        return new TrainingHomePage(this.page.page);
    }

    async gotoTrainingList(requireRedirect = true): Promise<TrainingListPage> {
        await this.page.navigateAndWait(async () => {
            await this.page.navigateToTrainingList();
        }, requireRedirect);
        return new TrainingListPage(this.page.page);
    }

    // Meal ordering navigation methods
    async gotoMealOrderHP(requireRedirect = true): Promise<MealOrderHPPage> {
        await this.page.navigateAndWait(async () => {
            await this.page.lunchOrderLink().click();
        }, requireRedirect);
        return new MealOrderHPPage(this.page.page);
    }

    async gotoCurrentMenu(requireRedirect = true): Promise<CurrentMenuPage> {
        await this.page.navigateAndWait(async () => {
            await this.page.navigateToCurrentMenu();
        }, requireRedirect);
        return new CurrentMenuPage(this.page.page);
    }

    async gotoMonthlyBilling(
        requireRedirect = true
    ): Promise<MonthlyBillingPage> {
        await this.page.navigateAndWait(async () => {
            await this.page.navigateToMonthlyBilling();
        }, requireRedirect);
        return new MonthlyBillingPage(this.page.page);
    }
}
