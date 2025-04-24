import { expect, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Navigation elements
  readonly homeLink = () => this.page.getByRole('link', { name: 'Úvodní stránka' });
  readonly trainingLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Interní školení' });
  readonly trainingListLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Seznam školení' });
  readonly trainingCategoriesLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Kategorie školení' });
  readonly lunchOrderLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Objednání obědů' });
  readonly currentMenuLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Aktuální menu' });
  readonly monthlyBillingLink = () => this.page.getByRole('complementary').getByRole('link', { name: 'Měsíční vyúčtování' });

  constructor(page: Page) {
    this.page = page;
  }

  async acceptAlert(expectedMessage?: string): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      if (expectedMessage) {
        expect(dialog.message()).toContain(expectedMessage);
      }
      await dialog.accept();
    });
  }

  // async waitForPageLoad(...elements: Array<() => Locator>) {
  //   // Wait until the page elements are visible
  //   for (const element of elements) {
  //     await expect(element()).toBeVisible();
  //   }
  // }

  // // Navigation methods
  // async navigateToHome(...elements: Array<() => Locator>) {
  //   await this.homeLink().click();
  //   await this.waitForPageLoad(...elements);
  // }

  // async navigateToTrainingList(...elements: Array<() => Locator>) {
  //   await this.trainingLink().click();
  //   await this.trainingListLink().click();
  //   await this.waitForPageLoad(...elements);
  // }

  // async navigateToTrainingCategories(...elements: Array<() => Locator>) {
  //   await this.trainingLink().click();
  //   await this.trainingCategoriesLink().click();
  //   await this.waitForPageLoad(...elements);
  // }

  // async navigateToCurrentMenu(...elements: Array<() => Locator>) {
  //   await this.lunchOrderLink().click();
  //   await this.currentMenuLink().click();
  //   await this.waitForPageLoad(...elements);
  // }

  // async navigateToMonthlyBilling(...elements: Array<() => Locator>) {
  //   await this.lunchOrderLink().click();
  //   await this.monthlyBillingLink().click();
  //   await this.waitForPageLoad(...elements);
  // }
}