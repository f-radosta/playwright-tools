import { Locator } from "@playwright/test";
import { BaseListComponent } from "@shared/components/base-list.component";
import { TrainingCompositeFilter, TrainingListItem } from "@training/components";
import { ListInterface } from "@shared/components/interfaces/list.interface";

export class TrainingsList extends BaseListComponent<TrainingListItem> implements ListInterface {
    public readonly trainingFilter: TrainingCompositeFilter;

    constructor(public readonly listAndFilterWrapperLocator: Locator) {
        super(listAndFilterWrapperLocator);
        this.trainingFilter = new TrainingCompositeFilter(this.listAndFilterWrapperLocator.getByTestId('filter'));
    }

    /**
     * @override
     * Override the createListItem method to return CategoryListItemComponent instances
     */
    protected createListItem(locator: Locator): TrainingListItem {
        return new TrainingListItem(locator);
    }

    async findTrainingByName(name: string): Promise<TrainingListItem | null> {
        const allItems = await this.getItems();
        const trimmedName = name.trim();

        // Search from last to first for faster search in most cases
        for (let i = allItems.length - 1; i >= 0; i--) {
            const item = allItems[i];
            const itemName = await item.getName();

            if (itemName && itemName.trim().localeCompare(trimmedName) === 0) {
                console.log(`Found training "${name}" at index ${i}`);
                return item;
            }
        }

        return null;
    }

    async deleteTrainingByName(name: string): Promise<void> {
        const training = await this.findTrainingByName(name);
        if (!training) {
            throw new Error(`Training "${name}" not found`);
        }
        await training.deleteItself();
    }

}
