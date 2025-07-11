import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import {ListItemInterface} from '@shared-components/interfaces/list-item.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class DepartmentListItem
    extends BaseListItemComponent
    implements ListItemInterface
{
    async getName(): Promise<string | null> {
        const name = await this.itemLocator
            .getByTestId(SHARED_SELECTORS.LIST.ITEM.TEXT)
            .textContent();
        return name ? name.trim() : name;
    }
}
