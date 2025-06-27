import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared-components/base-list.component';
import {
    CategoryListItem,
    CategoriesCompositeFilter
} from '@training-components/index';
import {ListInterface} from '@shared-interfaces/list.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {findItemByName} from '@shared-helpers/shared-helper';

export class CategoriesList
    extends BaseListComponent<CategoryListItem>
    implements ListInterface
{
    public readonly categoriesFilter: CategoriesCompositeFilter;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        this.categoriesFilter = new CategoriesCompositeFilter(
            this.listLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
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
        return findItemByName<CategoryListItem>(this, name);
    }

    async deleteCategoryByName(name: string): Promise<void> {
        const category = await this.findCategoryByName(name);
        if (!category) {
            throw new Error(`Category "${name}" not found`);
        }
        await category.deleteItself();
    }
}
