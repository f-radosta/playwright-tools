import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitForLoad, deletePage, goto, checkModuleHeading } from '../helpers/basic';
import { LayoutTemplate } from './layout-template.page';
import { ensureExactPath } from '../helpers/navigation';

export class LayoutTemplatesList {
  constructor(private page: Page, private baseUrl: string) {}

  async goto(): Promise<void> {
    await goto(this.page, this.baseUrl, selectors.PathUrlAddresses.layoutTemplates, 'Konstrukční šablony');
  }

  async deleteTemplate(templateName: string): Promise<void> {
    await deletePage(this.page, this.baseUrl, selectors.PathUrlAddresses.layoutTemplates, templateName);
  }

  async createLayoutTemplate({
    name,
  }: {
    name: string;
  }): Promise<LayoutTemplate> {
    //await ensureExactPath(this.page, this.baseUrl, selectors.PathUrlAddresses.layoutTemplates);
    if (await this.page.getByTestId('listModeNormalButton').isVisible()) {
      await this.page.getByTestId('listModeNormalButton').click();
    }
    await this.page.getByTestId('listGlobalActionAddButton').click();
    await this.page.getByLabel('Název').fill(name);
    await this.page.getByLabel('Web').selectOption({ index: 1 });
    await this.page.waitForTimeout(1000); // TODO figure out how much time is needed
    await this.page.getByRole('link', { name: 'Přidat', exact: true }).click();
    const layoutTemplate = new LayoutTemplate(this.page, name);
    await waitForLoad(this.page);
    await checkModuleHeading(this.page, name);
    await layoutTemplate.prepareLayoutTemplate();

    return layoutTemplate;
  }

}
