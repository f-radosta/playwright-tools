import {BaseListComponent} from '@shared-components/base-list.component';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';

type ItemWithName = {
    getName(): Promise<string | null>;
} & BaseListItemComponent;

export async function findItemByName<T extends ItemWithName>(
    list: BaseListComponent<T>,
    name: string
): Promise<T | null> {
    if (!name?.trim()) {
        return null;
    }

    const allItems = await list.getItems();
    const trimmedName = name.trim();

    // Search from last to first for faster search in most cases
    for (let i = allItems.length - 1; i >= 0; i--) {
        const item = allItems[i];
        const itemName = await item.getName();

        if (itemName && itemName.trim().localeCompare(trimmedName) === 0) {
            return item;
        }
    }

    return null;
}
