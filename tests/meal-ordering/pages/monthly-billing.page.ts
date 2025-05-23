import { Page } from '@playwright/test';
import { BasePage } from '@shared/pages/base-page';

export class MonthlyBillingPage extends BasePage {
  // Page title locator
  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Měsíční vyúčtování' });
  
  // Billing table
  readonly billingTable = () => this.page.getByTestId('billing-table');
  
  // Month selector
  readonly monthSelector = () => this.page.getByTestId('month-selector');
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Selects a specific month for viewing billing information
   * @param month The month to select (format: 'MM/YYYY')
   */
  async selectMonth(month: string): Promise<void> {
    await this.monthSelector().selectOption(month);
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Gets the total amount for the selected month
   * @returns The total amount as a number
   */
  async getTotalAmount(): Promise<number> {
    const totalText = await this.page.getByTestId('total-amount').textContent();
    if (!totalText) {
      throw new Error('Could not find total amount');
    }
    
    // Extract the number from the text (e.g., "Total: 1250 Kč" -> 1250)
    const match = totalText.match(/\d+/);
    if (!match) {
      throw new Error(`Could not extract number from total amount text: ${totalText}`);
    }
    
    return parseInt(match[0], 10);
  }
  
  /**
   * Gets all ordered meals for the selected month
   * @returns Array of ordered meal objects with date and name
   */
  async getOrderedMeals(): Promise<Array<{date: string, name: string}>> {
    const rows = await this.billingTable().locator('tbody tr').all();
    const meals: Array<{date: string, name: string}> = [];
    
    for (const row of rows) {
      const date = await row.locator('td').nth(0).textContent();
      const name = await row.locator('td').nth(1).textContent();
      
      if (date && name) {
        meals.push({
          date: date.trim(),
          name: name.trim()
        });
      }
    }
    
    return meals;
  }
}
