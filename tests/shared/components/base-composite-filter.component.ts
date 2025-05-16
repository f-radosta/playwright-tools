import { Locator } from "@playwright/test";
import { listSelectors } from "@shared/selectors/list.selectors";

export class BaseCompositeFilterComponent {

  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  async resetFilter() {
    await this.locator.getByTitle(listSelectors.filter.titles.reset).click();
  }

  async applyFilter() {
    await this.locator.getByTitle(listSelectors.filter.titles.apply).click();
  }

}
