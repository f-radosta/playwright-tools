import { Locator } from "@playwright/test";
import { ListItemComponent } from "@shared/components/list-item.component";
import { withConfirmationDialog } from "@shared/utils/dialog-utils";

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

  /**
   * Delete this category by clicking the delete button and confirming the dialog
   */
  async deleteItself(): Promise<void> {
    await withConfirmationDialog(
      this.root.page(),
      async () => {
        await this.root.locator('.icon-trash').click();
      },
      true,
      'Opravdu chcete smazat záznam?'
    );
  }

}
