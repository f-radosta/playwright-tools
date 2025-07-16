import {Locator} from '@playwright/test';
import {DropdownFilterComponent, DropdownType} from '@shared-filters/dropdown-filter.component';
import {CompositeFilterInterface} from '@shared-interfaces/composite-filter.interface';
import {BaseCompositeFilterComponent} from '@shared-components/base-composite-filter.component';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';
import {CategoryDTO} from '@training-models/training.types';

export class CategoriesCompositeFilter
    extends BaseCompositeFilterComponent<CategoryDTO>
    implements CompositeFilterInterface<CategoryDTO>
{
    public readonly categoryFilter: DropdownFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.categoryFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.CATEGORY
            ),
            DropdownType.TOMSELECT
        );
    }

    async filter(categoryDTO: CategoryDTO): Promise<void> {
        await this.categoryFilter.select(categoryDTO.categoryName);
        await this.applyFilter();
    }
}
