import { Page, expect } from '@playwright/test';
import { selectors } from '../selectors';
import { WebPage } from './web-page.page';

import { waitForLoad, resetFilter, deletePage, goto, checkModuleHeading } from '../helpers/basic';
import { ensureExactPath } from '../helpers/navigation';

export class WebPagesList {
  constructor(private page: Page, private baseUrl: string) {}

  async goto(): Promise<void> {
    await goto(this.page, this.baseUrl, selectors.PathUrlAddresses.webPage, 'Webové stránky');
  }

  async deletePage(webPageName: string): Promise<void> {
    await deletePage(this.page, this.baseUrl, selectors.PathUrlAddresses.webPage, webPageName);
  }

  async createWebPage({
    name,
    contentTemplate,
    layoutTemplate
  }: {
    name: string;
    contentTemplate: string;
    layoutTemplate: string;
  }): Promise<WebPage> {
    //ensureExactPath(this.page, this.baseUrl, selectors.PathUrlAddresses.webPage);
    await resetFilter(this.page);
    await this.page.locator(selectors.webPage.addNewPageButton).first().click();
    await this.page.locator(selectors.webPage.pageNameInput).fill(name);
    await this.page.locator(selectors.webPage.contentTemplateSelect).selectOption({ label: contentTemplate });
    await this.page.locator(selectors.webPage.layoutTemplateSelect).selectOption({ label: layoutTemplate });
    await this.page.locator(selectors.webPage.addAndEditButton).click({timeout: 60000});
    const webPage = new WebPage(this.page, name);
    await waitForLoad(this.page);
    await checkModuleHeading(this.page, name);
    await webPage.fillHeading('Nadpis pro ' + name);

    return webPage;
  }

}
