import { expect, Page } from '@playwright/test';
import { selectors } from '../selectors';
import { CubeIds, LayoutCubeIds } from '../data/cubeIds';
import { waitUntilIdle, addCube, saveComponent, openCubeSettings, checkModuleHeading } from '../helpers/basic';

export class LayoutTemplate {
  url(): string | URL {
    return this.page.url();
  }
  goto(arg0: string) {
    return this.page.goto(arg0);
  }
  constructor(private page: Page, public name: string) {}

  async publishAndSave() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(selectors.layoutTemplate.finishCheckboxLayout).click();
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('link', { name: 'Uložit' }).click();
    await waitUntilIdle(this.page);
    await checkModuleHeading(this.page, this.name);
  }

  async prepareLayoutTemplate() {
    const numOfRow = 3;
    const rowCode = Array(numOfRow)
      .fill("{row cols='0' rowtype='row'}\n{column}\n{/column}\n{/row}\n")
      .join("");
    
    const rowEditLocator = this.page.locator(selectors.layoutTemplate.rowEdit);
    
    if (!(await rowEditLocator.isVisible())) {
      await this.page.reload();
      await rowEditLocator.waitFor({ state: 'visible', timeout: 5000 });
    }
    
    await rowEditLocator.click();
    await this.page.locator(selectors.layoutTemplate.codeTextArea).fill(rowCode);
    await this.page.locator(selectors.layoutTemplate.rowEditClose).click();

    await addCube(this.page, selectors.webPage.getRow(2), selectors.webPage.centrePlus, selectors.webPage.getCubeById('btnComponenttemplate'));
  }

  async addAndFillLayoutCube(cubeId: string): Promise<void> {
    await addCube(this.page, selectors.webPage.getRow(1), selectors.webPage.topPlus, selectors.webPage.getCubeById(cubeId));

    switch (cubeId) {
      case LayoutCubeIds.HEADER_CUBE:
        await this.page.getByLabel('Varianta hlavičky').selectOption({ index: 1 });
        break;
      case LayoutCubeIds.HEADERS_CUBE:
        await this.page.getByLabel('Hlavičky').selectOption({ index: 1 });
        break;
      case LayoutCubeIds.LANG_SWITCH_CUBE:
        await this.page.getByLabel('Šablona', { exact: true }).selectOption({ index: 1 });
        break;
      case CubeIds.CRUMBTRAIL_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Oddělovač', { exact: true }).selectOption({ value: '|' });
        break;
      case CubeIds.HEADING_CUBE:
        await openCubeSettings(this.page);
        await this.page.getByLabel('Úroveň nadpisu').selectOption({ label: 'Nadpis H2' });
        break;
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
        await this.page.getByLabel('Titulek').fill('Titulek');
        break;
      case CubeIds.SIMPLE_SELLING_BUTTON_CUBE:
        await this.page.locator(selectors.components.payButtonTitle).fill('Nadpis');
        break;
      case CubeIds.MAPSV2_CUBE:
        await this.page.getByRole('link', { name: 'Zobrazení' }).click();
        await this.page.locator('label').filter({ hasText: 'Povolit vyhledávání' }).locator('label').click();
        break;
      case CubeIds.SOURCECODE_CUBE:
        await this.page.locator(selectors.components.blockTabDefault).click();
        await this.page.locator(selectors.components.sourceCodeTextArea).fill('<h1>nadpis<h1>');
        break;
      case LayoutCubeIds.IMAGESLIDER_CUBE:
      case LayoutCubeIds.HTMLSLIDER_CUBE:
          await this.page.getByRole('textbox', { name: 'Název slidu' }).fill('Nadpis');
          break;
      case CubeIds.PRODUCTSFILTER_CUBE:
          await this.page.locator(selectors.components.filterButtonTextInput).fill('btntxt');
          break;
      case CubeIds.AMPRODUCTSWIDGET_CUBE:
          await this.page.locator(selectors.components.productsIdsInput).fill('12345');
          break;
      case LayoutCubeIds.USER_FULLNAME_CUBE:
          await this.page.locator('label').filter({ hasText: 'Křestní jméno' }).locator('label').click();
          break;
      case CubeIds.FTXRESULTS_CUBE:
      case CubeIds.SHAREDBLOCKS_CUBE:
      case CubeIds.FTX_SEARCH_CUBE:
      case LayoutCubeIds.USER_EMAIL_CUBE:
      case LayoutCubeIds.USER_FILES_CUBE:
      case LayoutCubeIds.USER_PEREX_CUBE:
      case LayoutCubeIds.USER_PHOTO_CUBE:
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
