import { Page } from "@playwright/test";

export async function ensureOnPath(page: Page, baseUrl: string, expectedPath: string) {
  const currentPath = new URL(page.url()).pathname;
  if (!currentPath.startsWith(expectedPath)) {
    await page.goto(`${baseUrl}${expectedPath}`);
  }
}

export async function ensureExactPath(page: Page, baseUrl: string, expectedPath: string) {
  const currentPath = new URL(page.url()).pathname;

  if (currentPath !== baseUrl + expectedPath) {
    await page.goto(`${baseUrl}${expectedPath}`);
  }
}