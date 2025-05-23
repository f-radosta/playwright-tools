import { BaseListItemComponent } from "@shared/components/base-list-item.component";
import { ListItemInterface } from "@shared/components/interfaces/list-item.interface";
import { Locator } from "@playwright/test";
import { TrainingPage } from "@training/pages/training.page";

export class TrainingListItem extends BaseListItemComponent implements ListItemInterface {

    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    async getName(): Promise<string | null> {
        return this.getTextOfElementByTestId('name-cell');
    }

    async goToTrainingPage(): Promise<TrainingPage> {
        await this.clickOnElementByTestId('edit-cell');
        return new TrainingPage(this.itemLocator.page());
    }

    async getDateTime(): Promise<string | null> {
        return this.getTextOfElementByTestId('date-cell');
    }

    async getTrainer(): Promise<string | null> {
        return this.getTextOfElementByTestId('trainer-cell');
    }

    async getDepartment(): Promise<string | null> {
        return this.getTextOfElementByTestId('department-cell');
    }

    async getCategory(): Promise<string | null> {
        return this.getTextOfElementByTestId('category-cell');
    }

    async getCapacity(): Promise<string | null> {
        return this.getTextOfElementByTestId('capacity-cell');
    }

    async getOnline(): Promise<string | null> {
        return this.getTextOfElementByTestId('online-cell');
    }

    async clickCourseSignButton(): Promise<void> {
        await this.clickOnElementByTestId('sign-cell');
    }

}
