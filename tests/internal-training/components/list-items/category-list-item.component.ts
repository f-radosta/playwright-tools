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
    // The root should already be the specific TR element for this item
    // So we just need to get the 2nd TD (index 1) within this TR
    const name = await this.root.locator('td').nth(1).textContent();
    
    // Trim the name to remove any leading/trailing whitespace
    return name ? name.trim() : name;
  }

  // /**
  //  * Click the edit button for this category
  //  */
  // async clickEditCategory(): Promise<void> {
  //   await this.root.getByRole('row', { name: 'Upravit kategorii' }).getByLabel('Upravit kategorii').click();
  // }

  /**
   * Click the add training button for this category
   */
  async deleteItself(): Promise<void> {
    // Use page.on('dialog') instead of waitForEvent for more reliable dialog handling
    const page = this.root.page();
    
    // Set up a ONE-TIME dialog handler before clicking
    const dialogHandler = async (dialog: any) => {
      console.log('Dialog appeared with message:', dialog.message());
      await dialog.accept();
      console.log('Dialog accepted');
      // Remove the handler after it's used
      page.removeListener('dialog', dialogHandler);
    };
    
    // Add the one-time handler
    page.on('dialog', dialogHandler);
    
    try {
      // Try to find the delete button using multiple strategies
      console.log('Looking for delete button...');
      
      // Check if the trash icon exists and is visible
      const trashIcon = this.root.locator('.icon-trash');
      if (await trashIcon.isVisible()) {
        console.log('Found visible trash icon, clicking it...');
        await trashIcon.click({ timeout: 10000 });
        console.log('Trash icon clicked');
      } 
      
      // Wait for the deletion to complete
      await page.waitForLoadState('networkidle');
      console.log('Deletion completed');
      
    } catch (error) {
      console.error('Error during deletion:', error);
      throw error;
    }
  }

}
