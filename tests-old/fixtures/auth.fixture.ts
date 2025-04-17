import { test as base } from '@playwright/test';
import { getEnvironment } from '../config/environments';

export type AuthFixture = {
  login: () => Promise<void>;
  baseUrl: string;
};

export const test = base.extend<AuthFixture>({
  baseUrl: async ({}, use) => {
    const env = getEnvironment();
    await use(env.baseUrl);
  },
  login: async ({ page }, use) => {
    const env = getEnvironment();
    const login = async () => {
      // Create a new context for API request
      const context = page.context();
      
      // Prepare form data
      const formData = new URLSearchParams({
        username: env.credentials.username,
        password: env.credentials.password,
        adapter: '',
        referer: ''
      });

      // Make API login request
      const response = await context.request.post(`${env.baseUrl}/core/auth/login`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData.toString(),
        maxRedirects: 0, // Don't follow redirects as we expect 302
        timeout: 20000
      });

      // Verify login was successful (should get 302 redirect)
      if (response.status() !== 302) {
        throw new Error(`Login failed with status ${response.status()}`);
      }
    };
    await use(login);
  },
});
