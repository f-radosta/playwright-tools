import { BaseListItemComponent } from "@shared/components/base-list-item.component";
import { withConfirmationDialog } from "@shared/utils/dialog-utils";
import { ListItemInterface } from "@shared/components/interfaces/list-item.interface";
import { trainingSelectors } from "@training/selectors/training.selectors";
import { Locator } from "@playwright/test";
import { TrainingPage } from "@training/pages/training.page";


export class TrainingListItem extends BaseListItemComponent implements ListItemInterface {

    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    async getName(): Promise<string | null> {
        return this.getTextOfItemContentByIndex(1);
    }

    async goToTrainingPage(): Promise<TrainingPage> {
        await this.clickOnItemContentByIndex(0);
        return new TrainingPage(this.itemLocator.page());
    }

    async getDateTime(): Promise<string | null> {
        return this.getTextOfItemContentByIndex(2);
    }

    async getTrainer(): Promise<string | null> {
        return this.getTextOfItemByIndex(0);
    }

    async getDepartment(): Promise<string | null> {
        return this.getTextOfItemContentByIndex(3);
    }

    async getCategory(): Promise<string | null> {
        return this.getTextOfItemContentByIndex(4);
    }

    async getCapacity(): Promise<string | null> {
        return this.getTextOfItemContentByIndex(5);
    }

    async getOnline(): Promise<string | null> {
        return this.getTextOfItemByIndex(1);
    }

    async clickCourseSignButton(): Promise<void> {
        await this.itemLocator.locator('//*[contains(@id, "courseSignButton")]').getByRole('button').click();
    }

}
