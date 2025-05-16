import { HomePage } from '@shared/pages/home-page.page';
import { CategoriesPage } from './categories.page';
import { BasePage } from '@shared/pages/base-page';
import { TrainingHomePage } from './training-home.page';

export class TrainingApp {
  constructor(public readonly page: BasePage) {}

  async gotoDashboard(): Promise<HomePage> {
    await this.page.homeLink().click();
    return new HomePage(this.page.page);
  }

  async gotoCategories(): Promise<CategoriesPage> {
    await this.page.navigateToTrainingCategories();
    return new CategoriesPage(this.page.page);
  }

  async gotoTraining(): Promise<TrainingHomePage> {
    // For main menu items without dropdown, we can still use the direct click
    await this.page.trainingLink().click();
    return new TrainingHomePage(this.page.page);
  }

}
