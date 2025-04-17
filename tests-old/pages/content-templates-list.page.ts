import { Page } from '@playwright/test';
import { selectors } from '../selectors';
import { waitForLoad, deletePage, goto, checkModuleHeading } from '../helpers/basic';
import { ContentTemplate } from './content-template.page';
import { ensureExactPath } from '../helpers/navigation';

export class ContentTemplatesList {
  constructor(private page: Page, private baseUrl: string) {}

  async goto(): Promise<void> {
    await goto(this.page, this.baseUrl, selectors.PathUrlAddresses.contentTemplates, 'Obsahové šablony');
  }

  async deleteTemplate(templateName: string): Promise<void> {
    await deletePage(this.page, this.baseUrl, selectors.PathUrlAddresses.contentTemplates, templateName);
  }

  async createContentTemplate({
    name,
  }: {
    name: string;
  }): Promise<ContentTemplate> {
    //await ensureExactPath(this.page, this.baseUrl, selectors.PathUrlAddresses.contentTemplates);
    if (await this.page.getByTestId('listModeNormalButton').isVisible()) {
      await this.page.getByTestId('listModeNormalButton').click();
    }
    await this.page.getByTestId('listGlobalActionAddButton').click();
    await this.page.getByLabel('Název').fill(name);
    await this.page.getByLabel('Web').selectOption({ index: 1 });
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('link', { name: 'Přidat', exact: true }).click();
    const contentTemplate = new ContentTemplate(this.page, name);
    await waitForLoad(this.page);
    await checkModuleHeading(this.page, name);

    return contentTemplate;
  }

}
