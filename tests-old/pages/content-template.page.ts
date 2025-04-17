import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitUntilIdle, checkModuleHeading } from '../helpers/basic';

export class ContentTemplate {
  url(): string | URL {
    return this.page.url();
  }
  goto(arg0: string) {
    return this.page.goto(arg0);
  }
  constructor(private page: Page, public name: string) {}

  async publishAndSave() {
    await this.page.locator(selectors.layoutTemplate.finishCheckboxContent).click();
    await this.page.getByRole('link', { name: 'Uložit' }).click();
    await waitUntilIdle(this.page);
    await checkModuleHeading(this.page, this.name);
  }

}
