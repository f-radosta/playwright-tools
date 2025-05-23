import { test as baseTest, chromium } from '@playwright/test';

// Import the unified App fixture
import { test as appTest } from '@shared/fixtures/app.fixture';

import fs from 'fs';
import path from 'path';

// Ensure auth directory exists
const authDir = './tests/.auth';
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Authentication functions
async function loginAsAdmin(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  // Perform actual login with full URL
  await page.goto('https://apimpa.loc/login_check?user=test-tool-admin&expires=33297865200&hash=hx-zSxVnaeiVWLmmE-1vdiiSXU_WOZfldT7vlDfH6a0~RVmHT5SCRm0uA0q9V-ghnDGpWORxvhFBGeQ9yJXs2T4~');
  await page.waitForTimeout(3000); // Longer wait for login
  
  // Save the authentication state
  const adminAuthFile = path.join(authDir, 'tool-admin.json');
  await context.storageState({ path: adminAuthFile });
  
  // Close browser after login
  await browser.close();
}

async function loginAsUser(): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  // Perform actual login with full URL
  await page.goto('https://apimpa.loc/login_check?user=test-testovic&expires=33297865200&hash=uNdTW6_tQ9wDhe-xg27iumK-anWNx6rCntdQrIJYD7Q~gGd5DWPd2nsurngPvG9AYTz-FDuB1vaqUqcMCoQgoyI~');
  await page.waitForTimeout(3000); // Longer wait for login
  
  // Save the authentication state
  const userAuthFile = path.join(authDir, 'user.json');
  await context.storageState({ path: userAuthFile });
  
  // Close browser after login
  await browser.close();
}

// Regular test without authentication
export const test = baseTest;

// Admin test - create a test function with admin auth
export function adminTest(title: string, testFn: Function) {
  appTest.describe('Admin', () => {
    // Run login before tests in this group
    appTest.beforeAll(async () => {
      await loginAsAdmin();
    });
    
    // Use the saved authentication state
    appTest.use({ storageState: path.join(authDir, 'tool-admin.json') });
    
    appTest(title, testFn as any);
  });
}

// User test - create a test function with user auth
export function userTest(title: string, testFn: Function) {
  appTest.describe('User', () => {
    // Run login before tests in this group
    appTest.beforeAll(async () => {
      await loginAsUser();
    });
    
    // Use the saved authentication state
    appTest.use({ storageState: path.join(authDir, 'user.json') });
    
    appTest(title, testFn as any);
  });
}

/**
 * Login as a specific user type
 * 
 * @param authType The type of authentication to use ('admin', 'user')
 */
export async function loginAs(authType: 'admin' | 'user'): Promise<void> {
  if (authType === 'admin') {
    await loginAsAdmin();
  } else if (authType === 'user') {
    await loginAsUser();
  }
}
