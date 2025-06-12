import {Locator} from '@playwright/test';
import {
    DropdownFilterComponent,
    DropdownType,
    TextFilterComponent,
    CheckboxFilterComponent
} from '@shared-filters/index';
import {CompositeFilterInterface} from '@shared-interfaces/index';
import {BaseCompositeFilterComponent} from '@shared-components/index';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';
import {TrainingFilterDTO} from '@training-models/training.types';

export class TrainingCompositeFilter
    extends BaseCompositeFilterComponent<TrainingFilterDTO>
    implements CompositeFilterInterface<TrainingFilterDTO>
{
    public readonly categoryFilter: DropdownFilterComponent;
    public readonly nameFilter: TextFilterComponent;
    public readonly trainerFilter: DropdownFilterComponent;
    public readonly participantFilter: DropdownFilterComponent;
    public readonly departmentFilter: DropdownFilterComponent;
    public readonly onlineFilter: CheckboxFilterComponent;
    public readonly includePastFilter: CheckboxFilterComponent;

    constructor(public readonly compositeFilterLocator: Locator) {
        super(compositeFilterLocator);

        this.categoryFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.CATEGORY
            ),
            DropdownType.TOMSELECT
        );
        this.nameFilter = new TextFilterComponent(
            this.compositeFilterLocator.locator(TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.NAME)
        );
        this.trainerFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.TRAINER
            ),
            DropdownType.TOMSELECT
        );
        this.participantFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.PARTICIPANT
            ),
            DropdownType.TOMSELECT
        );
        this.departmentFilter = new DropdownFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.DEPARTMENT
            ),
            DropdownType.TOMSELECT
        );
        this.onlineFilter = new CheckboxFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.ONLINE
            )
        );
        this.includePastFilter = new CheckboxFilterComponent(
            this.compositeFilterLocator.locator(
                TRAINING_SELECTORS.XPATH_SELECTOR.FILTER.INCLUDE_PAST
            )
        );
    }

    async filter(trainingDTO: TrainingFilterDTO): Promise<void> {
        if (trainingDTO.name) {
            await this.nameFilter.filterBy(trainingDTO.name);
        }
        if (trainingDTO.category) {
            await this.categoryFilter.select(trainingDTO.category);
        }
        if (trainingDTO.trainer) {
            await this.trainerFilter.select(trainingDTO.trainer);
        }
        if (trainingDTO.participant) {
            await this.participantFilter.select(trainingDTO.participant);
        }
        if (trainingDTO.department) {
            await this.departmentFilter.select(trainingDTO.department);
        }
        if (trainingDTO.online) {
            await this.onlineFilter.setState(trainingDTO.online);
        }
        if (trainingDTO.includePast) {
            await this.includePastFilter.setState(trainingDTO.includePast);
        }
        await this.applyFilter();
    }
}
