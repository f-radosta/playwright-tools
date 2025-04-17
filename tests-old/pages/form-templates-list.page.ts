import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitForLoad, deletePage, goto, checkModuleHeading } from '../helpers/basic';
import { FormTemplate } from './form-template.page';
import { ensureExactPath } from '../helpers/navigation';

export class FormTemplatesList {
  constructor(private page: Page, private baseUrl: string) {}

  async goto(): Promise<void> {
    await goto(this.page, this.baseUrl, selectors.PathUrlAddresses.formTemplates, 'Webové formuláře');
  }

  async deleteTemplate(templateName: string): Promise<void> {
    await deletePage(this.page, this.baseUrl, selectors.PathUrlAddresses.formTemplates, templateName);
  }

  async createFormTemplate({
    name,
  }: {
    name: string;
  }): Promise<FormTemplate> {
    //await ensureExactPath(this.page, this.baseUrl, selectors.PathUrlAddresses.formTemplates);
    if (await this.page.getByTestId('listModeNormalButton').isVisible()) {
      await this.page.getByTestId('listModeNormalButton').click();
    }
    await this.page.getByTestId('listGlobalActionAddButton').click();
    await this.page.getByLabel('Název').fill(name);
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'Přidat', exact: true }).click();
    const formTemplate = new FormTemplate(this.page, name);
    await waitForLoad(this.page);
    await checkModuleHeading(this.page, name);

    return formTemplate;
  }

}
