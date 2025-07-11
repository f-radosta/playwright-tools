import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared-components/base-list.component';
import {
    DepartmentListItem,
    DepartmentsCompositeFilter
} from '@training-components/index';
import {ListInterface} from '@shared-interfaces/list.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {findItemByName} from '@shared-helpers/shared-helper';

export class DepartmentsList
    extends BaseListComponent<DepartmentListItem>
    implements ListInterface
{
    public readonly departmentsFilter: DepartmentsCompositeFilter;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        this.departmentsFilter = new DepartmentsCompositeFilter(
            this.listLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
        );
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): DepartmentListItem {
        return new DepartmentListItem(locator);
    }

    async findDepartmentByName(name: string): Promise<DepartmentListItem | null> {
        return findItemByName<DepartmentListItem>(this, name);
    }

    async deleteDepartmentByName(name: string): Promise<void> {
        const department = await this.findDepartmentByName(name);
        if (!department) {
            throw new Error(`Department "${name}" not found`);
        }
        await department.deleteItself();
    }
}
