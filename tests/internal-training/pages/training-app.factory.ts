import { HomePage } from '@shared/pages/home-page.page';
import { CategoriesPage } from './categories.page';
import { BasePage } from '@shared/pages/base-page';
import { TrainingHomePage } from './training-home.page';

export class TrainingApp {
  constructor(public readonly page: BasePage) {}

  async gotoDashboard(): Promise<HomePage> {
    await this.page.homeLink().click();
    const homePage = new HomePage(this.page.page);
    await homePage.expectHomePageVisible();
    return homePage;
  }

  async gotoCategories(): Promise<CategoriesPage> {
    await this.page.trainingLink().click();
    await this.page.trainingCategoriesLink().click();
    const categoriesPage = new CategoriesPage(this.page.page);
    await categoriesPage.expectPageHeaderVisible();
    return categoriesPage;
  }

  async gotoTraining(): Promise<TrainingHomePage> {
    await this.page.trainingLink().click();
    const trainingHomePage = new TrainingHomePage(this.page.page);
    await trainingHomePage.expectPageHeaderVisible();
    return trainingHomePage;
  }

  // ... add more navigations as needed
}
