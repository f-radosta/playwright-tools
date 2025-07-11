import {Locator, Page, expect} from '@playwright/test';
import {BasePage} from '@shared-pages/base-page';
import {TrainingsList} from '@training-components/index';
import {
    DateFilterComponent,
    DropdownFilterComponent,
    DropdownType,
    RichTextInputComponent
} from '@shared-components/index';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';
import {PageInterface} from '@shared-pages/page.interface';
import {NewTrainingFormDTO} from '@training-models/training.types';

export class TrainingListPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page
            .getByRole('heading', {name: 'Vypsaná školení'})
            .locator('span');
    }
    readonly createButton = () =>
        this.page.getByRole('link', {name: 'Vytvořit školení'});
    readonly formSaveButton = () =>
        this.page.getByRole('button', {name: 'Uložit'});

    private _trainingsList: TrainingsList | null = null;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the trainings list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get trainingsList(): TrainingsList {
        if (!this._trainingsList) {
            this._trainingsList = new TrainingsList(
                this.page.getByTestId(
                    SHARED_SELECTORS.LIST.LIST_AND_FILTER_WRAPPER
                )
            );
        }
        return this._trainingsList;
    }

    /**
     * Create a new training
     * @param trainingDTO The training data to create
     */
    async createNewTraining(trainingDTO: NewTrainingFormDTO): Promise<void> {
        await this.createButton().click();

        const formContainer = this.page.locator('form[name="training_course"]');

        const categoryDropdown = new DropdownFilterComponent(
            formContainer.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.CATEGORY
            ),
            DropdownType.TOMSELECT
        );
        const trainerDropdown = new DropdownFilterComponent(
            formContainer.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.TRAINER
            ),
            DropdownType.TOMSELECT
        );
        const departmentDropdown = new DropdownFilterComponent(
            formContainer.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.DEPARTMENT
            ),
            DropdownType.TOMSELECT
        );
        const startDateInput = new DateFilterComponent(
            formContainer.getByLabel('Začátek školení')
        );
        const endDateInput = new DateFilterComponent(
            formContainer.getByLabel('Konec školení')
        );

        await categoryDropdown.select(trainingDTO.category);
        await formContainer.getByLabel('Název školení').fill(trainingDTO.name);

        const descriptionEditor = new RichTextInputComponent(
            formContainer,
            'training_course_description'
        );
        await descriptionEditor.setText(trainingDTO.description);

        await trainerDropdown.select(trainingDTO.trainer);
        await departmentDropdown.select(trainingDTO.department);
        await formContainer
            .getByLabel('Kapacita')
            .fill(trainingDTO.capacity.toString());
        await startDateInput.setDate(trainingDTO.startDate);
        await endDateInput.setDate(trainingDTO.endDate);

        await this.formSaveButton().click();
        await this.expectPageHeaderVisible();
    }
}
