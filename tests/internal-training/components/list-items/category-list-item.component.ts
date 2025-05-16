import { BaseListItemComponent } from "@shared/components/base-list-item.component";
import { withConfirmationDialog } from "@shared/utils/dialog-utils";
import { ListItemInterface } from "@shared/components/interfaces/list-item.interface";

/**
 * Specialized list item component for training categories
 */
export class CategoryListItemComponent extends BaseListItemComponent implements ListItemInterface {
  /**
   * Get the name of the category
   */
  async getName(): Promise<string | null> {
    const name = await this.itemLocator.getByTestId('list-item-text').textContent();
    return name ? name.trim() : name;
  }

  /**
   * Delete this category by clicking the delete button and confirming the dialog
   */
  async deleteItself(): Promise<void> {
    await withConfirmationDialog(
      this.itemLocator.page(),
      async () => {
        await this.itemLocator.getByTestId('trash').click();
      },
      true,
      'Opravdu chcete smazat záznam?'
    );
  }

}
