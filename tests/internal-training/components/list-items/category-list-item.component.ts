import {BaseListItemComponent} from '@shared/components/base-list-item.component';
import {ListItemInterface} from '@shared/components/interfaces/list-item.interface';

export class CategoryListItem
    extends BaseListItemComponent
    implements ListItemInterface
{
    async getName(): Promise<string | null> {
        const name = await this.itemLocator
            .getByTestId('list-item-text')
            .textContent();
        return name ? name.trim() : name;
    }
}
