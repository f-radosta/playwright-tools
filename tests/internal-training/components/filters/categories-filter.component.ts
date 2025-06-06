import {Locator} from '@playwright/test';
import {DropdownFilterComponent, DropdownType} from '@shared/components';
import {CompositeFilterInterface} from '@shared/components/interfaces/composite-filter.interface';
import {BaseCompositeFilterComponent} from '@shared/components/base-composite-filter.component';
import {trainingSelectors} from '@training/selectors/training.selectors';
import {CategoryDTO} from '@training/models/training.types';

export class CategoriesCompositeFilter
    extends BaseCompositeFilterComponent<CategoryDTO>
    implements CompositeFilterInterface<CategoryDTO>
{
    public readonly categoryFilter: DropdownFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.categoryFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                trainingSelectors.filter.category
            ),
            DropdownType.TOMSELECT
        );
    }

    async filter(categoryDTO: CategoryDTO): Promise<void> {
        await this.categoryFilter.select(categoryDTO.categoryName);
        await this.applyFilter();
    }
}
