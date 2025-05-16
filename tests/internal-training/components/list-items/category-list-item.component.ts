import { BaseListItemComponent } from "@shared/components/base-list-item.component";
import { withConfirmationDialog } from "@shared/utils/dialog-utils";
import { ListItemInterface } from "@shared/components/interfaces/list-item.interface";

export class CategoryListItem extends BaseListItemComponent implements ListItemInterface {
  async getName(): Promise<string | null> {
    const name = await this.itemLocator.getByTestId('list-item-text').textContent();
    return name ? name.trim() : name;
  }

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
