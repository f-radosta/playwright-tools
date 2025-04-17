import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  // Home page specific elements
  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Úvodní stránka' });
  readonly welcomeMessage = () => this.page.getByText('Vítejte v interních nástrojích');

  constructor(page: Page) {
    super(page);
  }

  // Home page specific methods
  async navigateToHomePage() {
    await this.page.goto('/');
  }

  async isHomePageVisible() {
    await this.pageTitle().isVisible();
    await this.welcomeMessage().isVisible();
  }
}