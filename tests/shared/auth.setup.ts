import { test as setup, expect } from '@playwright/test';
import path from 'path';

// Define paths to auth files using correct paths
const authDir = path.join('tests', '.auth');
const toolAdminFile = path.join(authDir, 'tool-admin.json');
const userFile = path.join(authDir, 'user.json');

// Create the auth files for different user types
setup('authenticate as tool-admin', async ({ page }) => {
    await page.goto('login_check?user=test-tool-admin&expires=33297865200&hash=hx-zSxVnaeiVWLmmE-1vdiiSXU_WOZfldT7vlDfH6a0~RVmHT5SCRm0uA0q9V-ghnDGpWORxvhFBGeQ9yJXs2T4~');
    await page.waitForURL('');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    // await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

    await page.context().storageState({ path: toolAdminFile });
});

setup('authenticate as user', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto('login_check?user=test-testovic&expires=33297865200&hash=uNdTW6_tQ9wDhe-xg27iumK-anWNx6rCntdQrIJYD7Q~gGd5DWPd2nsurngPvG9AYTz-FDuB1vaqUqcMCoQgoyI~');
    await page.waitForURL('');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    // await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

    await page.context().storageState({ path: userFile });
});

// Export auth file paths for use in tests
export const authFiles = {
  admin: toolAdminFile,
  user: userFile
};

/**
 * Simple helper to get the auth file path for a specific user type
 * 
 * @param authType The type of authentication to use ('admin', 'user', or undefined for no auth)
 * @returns The path to the auth file or undefined for no auth
 */
export function getAuthFile(authType?: 'admin' | 'user') {
  if (!authType) return undefined;
  return authFiles[authType];
}