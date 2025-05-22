import { Locator } from "@playwright/test";
import { DropdownFilterComponent, DropdownType, TextFilterComponent, CheckboxFilterComponent } from '@shared/components';
import { CompositeFilterInterface } from "@shared/components/interfaces/composite-filter.interface";
import { BaseCompositeFilterComponent } from "@shared/components/base-composite-filter.component";
import { trainingSelectors } from "@training/selectors/training.selectors";

export class TrainingCompositeFilter
  extends BaseCompositeFilterComponent<TrainingFilterDTO>
  implements CompositeFilterInterface<TrainingFilterDTO> {

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
        this.compositeFilterLocator.locator(trainingSelectors.filter.category),
        DropdownType.TOMSELECT
    );
    this.nameFilter = new TextFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.name)
    );
    this.trainerFilter = new DropdownFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.trainer),
        DropdownType.TOMSELECT
    );
    this.participantFilter = new DropdownFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.participant),
        DropdownType.TOMSELECT
    );
    this.departmentFilter = new DropdownFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.department),
        DropdownType.TOMSELECT
    );
    this.onlineFilter = new CheckboxFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.online)
    );
    this.includePastFilter = new CheckboxFilterComponent(
        this.compositeFilterLocator.locator(trainingSelectors.filter.includePast)
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

export type TrainingFilterDTO = {
    category?: string;
    name?: string;
    trainer?: string;
    participant?: string;
    department?: string;
    online?: boolean;
    includePast?: boolean;
}
