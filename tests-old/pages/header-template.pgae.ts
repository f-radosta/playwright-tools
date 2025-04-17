import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitUntilIdle, checkModuleHeading } from '../helpers/basic';

export class HeaderTemplate {
  url(): string | URL {
    return this.page.url();
  }
  goto(arg0: string) {
    return this.page.goto(arg0);
  }
  constructor(private page: Page, public name: string) {}

  async publishAndSave() {
    await this.page.locator(selectors.layoutTemplate.finishCheckboxHeader).click();
    await this.page.getByLabel('Web', { exact: true }).selectOption({ index: 1 });
    await this.page.getByRole('link', { name: 'Uložit' }).click();
    await waitUntilIdle(this.page);
    await checkModuleHeading(this.page, this.name);
  }

}
