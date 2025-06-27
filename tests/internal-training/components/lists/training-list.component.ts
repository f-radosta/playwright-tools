import {Locator} from '@playwright/test';
import {BaseListComponent} from '@shared-components/base-list.component';
import {TrainingCompositeFilter, TrainingListItem} from '@training-components/index';
import {findItemByName} from '@shared-helpers/shared-helper';
import {ListInterface} from '@shared-interfaces/list.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class TrainingsList
    extends BaseListComponent<TrainingListItem>
    implements ListInterface
{
    public readonly trainingFilter: TrainingCompositeFilter;

    constructor(public readonly listLocator: Locator) {
        super(listLocator);
        this.trainingFilter = new TrainingCompositeFilter(
            this.listLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
        );
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): TrainingListItem {
        return new TrainingListItem(locator);
    }

    async findTrainingByName(name: string): Promise<TrainingListItem | null> {
        return findItemByName<TrainingListItem>(this, name);
    }

    async deleteTrainingByName(name: string): Promise<void> {
        const training = await this.findTrainingByName(name);
        if (!training) {
            throw new Error(`Training "${name}" not found`);
        }
        await training.deleteItself();
    }
}
