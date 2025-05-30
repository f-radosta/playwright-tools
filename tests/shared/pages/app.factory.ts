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
    async gotoDashboard(): Promise<HomePage> {
        await this.page.homeLink().click();
        await this.page.waitForPageReady();
        return new HomePage(this.page.page);
    }

    // Training navigation methods
    async gotoCategories(): Promise<CategoriesPage> {
        await this.page.navigateToTrainingCategories();
        await this.page.waitForPageReady();
        return new CategoriesPage(this.page.page);
    }

    async gotoTrainingHome(): Promise<TrainingHomePage> {
        await this.page.trainingLink().click();
        await this.page.waitForPageReady();
        return new TrainingHomePage(this.page.page);
    }

    async gotoTrainingList(): Promise<TrainingListPage> {
        await this.page.navigateToTrainingList();
        await this.page.waitForPageReady();
        return new TrainingListPage(this.page.page);
    }

    // Meal ordering navigation methods
    async gotoMealOrderHP(): Promise<MealOrderHPPage> {
        await this.page.lunchOrderLink().click();
        await this.page.waitForPageReady();
        return new MealOrderHPPage(this.page.page);
    }
    
    async gotoCurrentMenu(): Promise<CurrentMenuPage> {
        await this.page.navigateToCurrentMenu();
        await this.page.waitForPageReady();
        return new CurrentMenuPage(this.page.page);
    }

    async gotoMonthlyBilling(): Promise<MonthlyBillingPage> {
        await this.page.navigateToMonthlyBilling();
        await this.page.waitForPageReady();
        return new MonthlyBillingPage(this.page.page);
    }
}
