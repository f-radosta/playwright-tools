import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitForLoad, deletePage, goto, checkModuleHeading } from '../helpers/basic';
import { HeaderTemplate } from './header-template.pgae';
import { ensureExactPath } from '../helpers/navigation';

export class HeaderTemplatesList {
  constructor(private page: Page, private baseUrl: string) {}

  async goto(): Promise<void> {
    await goto(this.page, this.baseUrl, selectors.PathUrlAddresses.headerTemplates, 'Webové hlavičky');
  }

  async deleteTemplate(templateName: string): Promise<void> {
    await deletePage(this.page, this.baseUrl, selectors.PathUrlAddresses.headerTemplates, templateName);
  }

  async createHeaderTemplate({
    name,
  }: {
    name: string;
  }): Promise<HeaderTemplate> {
    //await ensureExactPath(this.page, this.baseUrl, selectors.PathUrlAddresses.headerTemplates);
    if (await this.page.getByTestId('listModeNormalButton').isVisible()) {
      await this.page.getByTestId('listModeNormalButton').click();
    }
    await this.page.getByTestId('listGlobalActionAddButton').click();
    await this.page.getByLabel('Název').fill(name);
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'Přidat', exact: true }).click();
    const headerTemplate = new HeaderTemplate(this.page, name);
    await waitForLoad(this.page);
    await checkModuleHeading(this.page, name);

    return headerTemplate;
  }

}
