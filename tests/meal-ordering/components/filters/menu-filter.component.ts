import {Locator} from '@playwright/test';
import {DropdownFilterComponent, DropdownType} from '@shared/components';
import {CompositeFilterInterface} from '@shared/components/interfaces/composite-filter.interface';
import {BaseCompositeFilterComponent} from '@shared/components/base-composite-filter.component';
import {trainingSelectors} from '@training/selectors/training.selectors';

export class MenuCompositeFilter
    extends BaseCompositeFilterComponent<MenuDTO>
    implements CompositeFilterInterface<MenuDTO>
{
    //public readonly menuFilter: DropdownFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        // this.menuFilter = new DropdownFilterComponent(
        //   this.compositeFilterLocator.locator(trainingSelectors.filter.category),
        //   DropdownType.TOMSELECT
        // );
    }

    async filter(menuDTO: MenuDTO): Promise<void> {
        //await this.menuFilter.select(menuDTO.menuName);
        await this.applyFilter();
    }
}

type MenuDTO = {
    //menuName: string;
};
