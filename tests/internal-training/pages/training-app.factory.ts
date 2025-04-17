import { HomePage } from '@shared/pages/home-page.page';
import { CategoriesPage } from './categories.page';
import { BasePage } from '@shared/pages/base-page';

export class TrainingApp {
  constructor(public readonly page: BasePage) {}

  async gotoDashboard(): Promise<HomePage> {
    await this.page.homeLink().click();
    return new HomePage(this.page.page);
  }

  async gotoCategories(): Promise<CategoriesPage> {
    await this.page.trainingLink().click();
    await this.page.trainingCategoriesLink().click();
    //await this.page.waitForPageLoad(...elements);
    return new CategoriesPage(this.page.page);
  }

  // ... add more navigations as needed
}
