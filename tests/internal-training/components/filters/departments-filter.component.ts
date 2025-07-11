import {Locator} from '@playwright/test';
import {DropdownFilterComponent, DropdownType} from '@shared-filters/dropdown-filter.component';
import {CompositeFilterInterface} from '@shared-interfaces/composite-filter.interface';
import {BaseCompositeFilterComponent} from '@shared-components/base-composite-filter.component';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';
import {DepartmentDTO} from '@training-models/training.types';

export class DepartmentsCompositeFilter
    extends BaseCompositeFilterComponent<DepartmentDTO>
    implements CompositeFilterInterface<DepartmentDTO>
{
    public readonly departmentFilter: DropdownFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.departmentFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.DEPARTMENT
            ),
            DropdownType.TOMSELECT
        );
    }

    async filter(departmentDTO: DepartmentDTO): Promise<void> {
        await this.departmentFilter.select(departmentDTO.departmentName);
        await this.applyFilter();
    }
}
