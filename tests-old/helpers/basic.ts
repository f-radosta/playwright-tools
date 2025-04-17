import { expect, Page } from "@playwright/test";
import { selectors } from '../selectors';
import { ensureExactPath } from './navigation';

export async function waitUntilIdle(page: Page): Promise<void> {
  await expect(page.getByText('Pracuji')).not.toBeVisible({ timeout: 30000 });
}

export async function waitForLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

export async function goto(page: Page, baseUrl: string, path: string, moduleName: string): Promise<void> {
  await page.goto(`${baseUrl}${path}`);
  await expect(page.getByTestId('moduleHeading')).toContainText(moduleName);
}

export async function resetFilter(page: Page) {
  const filterResetButton = page.getByTestId('listQuickSearchResetButton');
  if (await filterResetButton.isVisible()) {
    await filterResetButton.click();
    await waitUntilIdle(page);
  }
}

export async function setFilter(page: Page, name: string) {
  await resetFilter(page);
  await page.locator(selectors.webPage.searchInput).first().fill(name);
  await page.keyboard.press('Enter');
  await waitForLoad(page);
  await waitUntilIdle(page);
}

export async function deletePage(page: Page, baseUrl: string, listPath: string, name: string) {
  await ensureExactPath(page, baseUrl, listPath);
  await setFilter(page, name);
  if (await page.getByTestId('listModeTrashButton').isVisible()) {
    if (await page.locator(selectors.webPage.toTrashButton(name)).count() > 1) {
      await setFilter(page, name);
    }
    await page.locator(selectors.webPage.toTrashButton(name)).click();
    await page.locator(selectors.webPage.toTrashConfirmButton).click();
    await waitUntilIdle(page);
    await expect(page.locator(selectors.webPage.toTrashButton(name))).not.toBeVisible({ timeout: 1000 });
    await page.getByTestId('listModeTrashButton').click();
    await waitUntilIdle(page);
    await setFilter(page, name);
    await page.locator(selectors.webPage.deleteButton(name)).click();
    await page.locator(selectors.webPage.toTrashConfirmButton).click();
    await waitUntilIdle(page);
    await expect(page.locator(selectors.webPage.toTrashButton(name))).not.toBeVisible({ timeout: 1000 });
    await page.getByTestId('listModeNormalButton').click();
    await waitUntilIdle(page);
  } else {
    await page.locator(selectors.webPage.deleteButton(name)).click();
    await page.locator(selectors.webPage.deleteConfirmButton).click();
    await waitUntilIdle(page);
    await expect(page.locator(selectors.webPage.deleteButton(name))).not.toBeVisible({ timeout: 1000 });
  }
}

export async function addCube(
  page: Page,
  rowSelector: string,
  plusSelector: string,
  cubeSelector: string
): Promise<void> {
  await waitUntilIdle(page);
  if (await page.locator(`${rowSelector}${selectors.webPage.containers}`).count() > 1) {
    await page.locator(rowSelector + plusSelector).click();
  } else {
    await page.locator(rowSelector + selectors.webPage.centrePlus).click();
  }
  await page.locator(cubeSelector).click();
  await waitForLoad(page);
  await waitUntilIdle(page);
}

export async function saveComponent(page: Page): Promise<void> {
  await waitUntilIdle(page);
  if (await page.locator(selectors.components.componentWindow).isVisible()) {
    await page.getByTestId('cube-modal-config-submit-button-send').click();
    await waitForLoad(page);
  }
}

export async function openCubeSettings(page: Page): Promise<void> {
  await waitUntilIdle(page);

  await page.getByTestId('cube-constructer-element-header').first().scrollIntoViewIfNeeded();
  await page.getByTestId('cube-constructer-element-header').first().hover();
  await page.getByTestId('constructer-edit-component').first().click();
  await waitForLoad(page);
}

export class PageCreationError extends Error {
  constructor(name: string) {
    super(`Page ${name} was not created`);
    this.name = 'PageCreationError';
  }
}

export async function checkModuleHeading(page: Page, moduleName: string) {
  const moduleHeading = await page.getByTestId('moduleHeading').textContent();
  if (moduleHeading?.includes('Chyba aplikace') || moduleHeading?.includes('Stránka nebyla nalezena')) {
    //await page.reload();
    //await expect(page.getByTestId('moduleHeading')).toContainText(moduleName, { timeout: 5000 });
    throw new PageCreationError(moduleName);
  } else {
    expect(moduleHeading).toContain(moduleName);
  }
}
