import {Locator} from '@playwright/test';
import {ListItemInterface} from '@shared-interfaces/list-item.interface';
import {TrainingPage} from '@training-pages/training.page';
import {BaseTrainingComponent} from '@training-components/base/base-training.component';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';
import {parseDateTimes, ParsedDateTimeInfo} from '@shared-utils/date-utils';

export class TrainingListItem
    extends BaseTrainingComponent
    implements ListItemInterface
{
    constructor(public readonly itemLocator: Locator) {
        super(itemLocator);
    }

    private async getCellText(cellId: string): Promise<string | null> {
        const cell = this.itemLocator.getByTestId(cellId);
        return this.safeGetText(cell);
    }

    async getName(): Promise<string | null> {
        return this.getCellText(TRAINING_SELECTORS.CELL.NAME);
    }

    async goToTrainingPage(): Promise<TrainingPage> {
        await this.clickOnElementByTestId(TRAINING_SELECTORS.CELL.EDIT);
        return new TrainingPage(this.itemLocator.page());
    }

    async getDateTime(): Promise<string | null> {
        return this.getCellText(TRAINING_SELECTORS.CELL.DATE);
    }

    async getTrainer(): Promise<string | null> {
        return this.getCellText(TRAINING_SELECTORS.CELL.TRAINER);
    }

    async getDepartment(): Promise<string | null> {
        return this.getCellText(TRAINING_SELECTORS.CELL.DEPARTMENT);
    }

    async getCategory(): Promise<string | null> {
        return this.getCellText(TRAINING_SELECTORS.CELL.CATEGORY);
    }

    async getCapacity(): Promise<number | null> {
        const capacityText = await this.getCellText(TRAINING_SELECTORS.CELL.CAPACITY);
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
        return this.getCellText(TRAINING_SELECTORS.CELL.ONLINE);
    }

    async clickCourseSignButton(): Promise<void> {
        await this.clickOnElementByTestId(TRAINING_SELECTORS.CELL.SIGN);
    }

    /**
     * Parse date and time information from different formats using shared utility
     *
     * @returns ParsedDateTimeInfo object with startDate, endDate, times and format info
     */
    async parseDateTimes(): Promise<ParsedDateTimeInfo> {
        const dateText = await this.getDateTime();
        return parseDateTimes(dateText);
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
