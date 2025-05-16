import { HomePage } from '@shared/pages/home-page.page';
import { CategoriesPage } from './categories.page';
import { BasePage } from '@shared/pages/base-page';
import { TrainingHomePage } from './training-home.page';

export class TrainingApp {
  constructor(public readonly page: BasePage) {}

  async gotoDashboard(): Promise<HomePage> {
    await this.page.homeLink().click();
    await this.page.page.waitForLoadState('networkidle');
    return new HomePage(this.page.page);
  }

  async gotoCategories(): Promise<CategoriesPage> {
    await this.page.navigateToTrainingCategories();
    await this.page.page.waitForLoadState('networkidle');
    return new CategoriesPage(this.page.page);
  }

  async gotoTraining(): Promise<TrainingHomePage> {
    await this.page.trainingLink().click();
    await this.page.page.waitForLoadState('networkidle');
    return new TrainingHomePage(this.page.page);
  }

}
