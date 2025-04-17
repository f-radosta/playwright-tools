import { expect, Page } from '@playwright/test';
import { selectors } from '../selectors';
import { CubeIds } from '../data/cubeIds';
import { waitUntilIdle, addCube, saveComponent, openCubeSettings, checkModuleHeading } from '../helpers/basic';

export class WebPage {
  url(): string | URL {
    return this.page.url();
  }
  goto(arg0: string) {
    return this.page.goto(arg0);
  }
  constructor(private page: Page, public name: string) {}

  async publishAndSave() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(selectors.webPage.approveSelect).selectOption('approved');
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('link', { name: 'Uložit' }).click();
    await waitUntilIdle(this.page);
    await checkModuleHeading(this.page, this.name);
  }

  async fillHeading(heading: string) {
    await this.page.locator(selectors.webPage.webPageHeading).fill(heading);
  }

  async addAndFillCube(cubeId: string): Promise<void> {
    await addCube(this.page, selectors.webPage.getRow(1), selectors.webPage.topPlus, selectors.webPage.getCubeById(cubeId));

    switch (cubeId) {
      case CubeIds.TEXT_CUBE:
        await this.page.locator(selectors.components.textEditor).fill('lorem ipsum');
        break;

      case CubeIds.HR_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Výška horizontální linky (px)').fill('20');
        break;

      case CubeIds.HRLINE_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Velikost mezery').fill('20');
        break;

      case CubeIds.ANCHOR_CUBE:
        await this.page.getByLabel('Název kotvy').fill('kotva');
        break;

      case CubeIds.COUNTER_CUBE:
        await this.page.locator(selectors.components.titleCs).fill('Titulek');
        break;
      case CubeIds.HTML_VIDEO_CUBE:
        await this.page.getByLabel('Video na pozadí', { exact: true }).getByLabel('Titulek').fill('Titulek');
        break;

      case CubeIds.MAPSV2_CUBE:
        await this.page.getByRole('link', { name: 'Zobrazení' }).click();
        await this.page.locator('label').filter({ hasText: 'Povolit vyhledávání' }).locator('label').click();
        break;

      case CubeIds.SOURCECODE_CUBE:
        await this.page.locator(selectors.components.blockTabDefault).click();
        await this.page.locator(selectors.components.sourceCodeTextArea).fill('<h1>nadpis<h1>');
        break;

      case CubeIds.PRODUCTSFILTER_CUBE:
        await this.page.locator(selectors.components.buttonTextInFilterOfProducts).fill('btntxt');
        break;

      case CubeIds.AMPRODUCTSWIDGET_CUBE:
        await this.page.getByLabel('Kódy produktů').fill('12345');
        break;

      case CubeIds.CRUMBTRAIL_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Oddělovač', { exact: true }).selectOption({ value: '|' });
        break;

      case CubeIds.HEADING_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Úroveň nadpisu').selectOption({ label: 'Nadpis H2' });
        break;

      case CubeIds.SIMPLE_SELLING_BUTTON_CUBE:
        await this.page.locator(selectors.components.payButtonTitle).fill('Nadpis');
        break;

      case CubeIds.SHAREDBLOCKS_CUBE:
      case CubeIds.ORDER_CONVERSION_PAGE_COMPONENT_CUBE:
      case CubeIds.FTX_SEARCH_CUBE:
      case CubeIds.FTXRESULTS_CUBE:
        break;

      default:
        expect(this.page.locator(selectors.components.componentWindow)).toBeVisible();
        await this.page.locator(selectors.components.blockTabDefault).click();
        await this.page.locator(selectors.components.headingEnable).check();
        await this.page.locator(selectors.components.headingValue).fill('Nadpis');
    }

    await saveComponent(this.page);
  }

}
