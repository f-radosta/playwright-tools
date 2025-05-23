import { Page } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';

export class CurrentMenuPage extends BasePage {
  // Page title locator
  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Aktuální menu' });
  
  // Menu items list
  readonly menuItemsList = () => this.page.getByTestId('menu-items-list');
  
  // Order button
  readonly orderButton = () => this.page.getByRole('button', { name: 'Objednat' });
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Orders a meal by its name
   * @param mealName The name of the meal to order
   */
  async orderMealByName(mealName: string): Promise<void> {
    const mealItem = this.page.getByText(mealName).first();
    await mealItem.click();
    await this.orderButton().click();
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Gets all available meals for the current day
   * @returns Array of meal names
   */
  async getAvailableMeals(): Promise<string[]> {
    const mealElements = await this.menuItemsList().locator('.meal-item').all();
    const mealNames: string[] = [];
    
    for (const element of mealElements) {
      const name = await element.locator('.meal-name').textContent();
      if (name) {
        mealNames.push(name.trim());
      }
    }
    
    return mealNames;
  }
}
