import {Locator} from '@playwright/test';
import {ListItemInterface} from '@shared/components/interfaces/list-item.interface';
import {TrainingPage} from '@training/pages/training.page';
import {BaseTrainingComponent} from '@training/components/base/base-training.component';
import {DateTimeUtils, ParsedDateTimeInfo} from '@shared/utils/date-utils';

export class TrainingListItem
    extends BaseTrainingComponent
    implements ListItemInterface
{
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    async getName(): Promise<string | null> {
        const nameCell = this.itemLocator.getByTestId('name-cell');
        return this.safeGetText(nameCell);
    }

    async goToTrainingPage(): Promise<TrainingPage> {
        await this.clickOnElementByTestId('edit-cell');
        return new TrainingPage(this.itemLocator.page());
    }

    async getDateTime(): Promise<string | null> {
        const dateCell = this.itemLocator.getByTestId('date-cell');
        return this.safeGetText(dateCell);
    }

    async getTrainer(): Promise<string | null> {
        const trainerCell = this.itemLocator.getByTestId('trainer-cell');
        return this.safeGetText(trainerCell);
    }

    async getDepartment(): Promise<string | null> {
        const departmentCell = this.itemLocator.getByTestId('department-cell');
        return this.safeGetText(departmentCell);
    }

    async getCategory(): Promise<string | null> {
        const categoryCell = this.itemLocator.getByTestId('category-cell');
        return this.safeGetText(categoryCell);
    }

    async getCapacity(): Promise<number | null> {
        const capacityCell = this.itemLocator.getByTestId('capacity-cell');
        const capacityText = await this.safeGetText(capacityCell);
        if (!capacityText) return null;

        // Extract numeric value from text (e.g., "10 / 20" -> 20)
        const match = capacityText.match(/\d+\s*\/\s*(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        } else if (match) {
            return parseInt(match[0], 10);
        }
        return null;
    }

    async getOnline(): Promise<string | null> {
        const onlineCell = this.itemLocator.getByTestId('online-cell');
        return this.safeGetText(onlineCell);
    }

    async clickCourseSignButton(): Promise<void> {
        await this.clickOnElementByTestId('sign-cell');
    }

    /**
     * Parse date and time information from different formats using shared utility
     *
     * @returns ParsedDateTimeInfo object with startDate, endDate, times and format info
     */
    async parseDateTimes(): Promise<ParsedDateTimeInfo> {
        const dateText = await this.getDateTime();
        return DateTimeUtils.parseDateTimes(dateText);
    }

    async getStartDate(): Promise<Date | null> {
        const {startDate} = await this.parseDateTimes();
        return startDate;
    }

    async getEndDate(): Promise<Date | null> {
        const {endDate} = await this.parseDateTimes();
        return endDate;
    }
}
