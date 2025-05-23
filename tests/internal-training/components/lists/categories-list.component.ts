import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared/components/base-list.component';
import {
    CategoryListItem,
    CategoriesCompositeFilter
} from '@training/components';
import {ListInterface} from '@shared/components/interfaces/list.interface';

export class CategoriesList
    extends BaseListComponent<CategoryListItem>
    implements ListInterface
{
    public readonly categoriesFilter: CategoriesCompositeFilter;

    constructor(public readonly listAndFilterWrapperLocator: Locator) {
        super(listAndFilterWrapperLocator);
        this.categoriesFilter = new CategoriesCompositeFilter(
            this.listAndFilterWrapperLocator.getByTestId('filter')
        );
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): CategoryListItem {
        return new CategoryListItem(locator);
    }

    async findCategoryByName(name: string): Promise<CategoryListItem | null> {
        const allItems = await this.getItems();
        const trimmedName = name.trim();

        // Search from last to first for faster search in most cases
        for (let i = allItems.length - 1; i >= 0; i--) {
            const item = allItems[i];
            const itemName = await item.getName();

            if (itemName && itemName.trim().localeCompare(trimmedName) === 0) {
                //console.log(`Found category "${name}" at index ${i}`);
                return item;
            }
        }

        return null;
    }

    async deleteCategoryByName(name: string): Promise<void> {
        const category = await this.findCategoryByName(name);
        if (!category) {
            throw new Error(`Category "${name}" not found`);
        }
        await category.deleteItself();
    }
}
