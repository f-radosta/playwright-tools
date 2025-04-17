import { Locator } from "@playwright/test";
import { ListItemComponent } from "@shared/components/list-item.component";

/**
 * Specialized list item component for training categories
 */
export class CategoryListItemComponent extends ListItemComponent {
  /**
   * Get the name of the category
   */
  async getName(): Promise<string | null> {
    return this.root.locator('.category-name').textContent();
  }

  /**
   * Get the description of the category
   */
  async getDescription(): Promise<string | null> {
    return this.root.locator('.category-description').textContent();
  }

  /**
   * Get the number of trainings in this category
   */
  async getTrainingCount(): Promise<number> {
    const countText = await this.root.locator('.training-count').textContent();
    return countText ? parseInt(countText.replace(/\D/g, ''), 10) : 0;
  }

  /**
   * Check if the category is active
   */
  async isActive(): Promise<boolean> {
    const statusElement = this.root.locator('.category-status');
    const statusText = await statusElement.textContent();
    return statusText?.toLowerCase().includes('active') || false;
  }

  /**
   * Click the view trainings button for this category
   */
  async clickViewTrainings(): Promise<void> {
    await this.root.locator('.view-trainings-button').click();
  }

  /**
   * Click the add training button for this category
   */
  async clickAddTraining(): Promise<void> {
    await this.root.locator('.add-training-button').click();
  }
}
