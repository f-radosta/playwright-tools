import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  // Navigation selectors - using data-test attributes
  private get navItems() {
    return this.page.getByTestId('navtab');
  }

  // Main navigation elements
  readonly homeLink = () => this.navItems.filter({ hasText: 'Úvodní stránka' });
  readonly trainingLink = () => this.navItems.filter({ hasText: 'Interní školení' });
  readonly lunchOrderLink = () => this.navItems.filter({ hasText: 'Objednání obědů' });

  // Training submenu elements
  readonly trainingListLink = () => this.navItems.filter({ hasText: 'Seznam školení' });
  readonly trainingCategoriesLink = () => this.navItems.filter({ hasText: 'Kategorie školení' });
  
  // Lunch ordering submenu elements
  readonly currentMenuLink = () => this.navItems.filter({ hasText: 'Aktuální menu' });
  readonly monthlyBillingLink = () => this.navItems.filter({ hasText: 'Měsíční vyúčtování' });

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Gets the page title locator - to be overridden by subclasses
   * @returns Locator for the page title
   */
  pageTitle(): Locator {
    throw new Error('pageTitle() method must be implemented by subclass');
  }

  /**
   * Verifies that the page is visible by checking the page title in the header
   * This is a common method for all pages except home page
   */
  async expectPageHeaderVisible(): Promise<void> {
    await expect(this.pageTitle()).toBeVisible();
  }

  /**
   * Click on a dropdown toggle button to open a submenu
   * @param menuText The text of the menu item to expand
   */
  async clickDropdownToggle(menuText: string): Promise<void> {
    // The dropdown toggle button should have data-test="nav-dropdown-toggle"
    const menuItem = this.navItems.filter({ hasText: menuText }).first();
    const parentContainer = menuItem.locator('xpath=./ancestor::li');
    
    // Find the toggle button within the parent container
    await parentContainer.getByTestId('nav-dropdown-toggle').click();
  }

  /**
   * Navigate to a submenu item by first clicking its parent dropdown toggle
   * @param parentText The text of the parent menu item
   * @param childText The text of the submenu item to click
   */
  async navigateToSubmenuItem(parentText: string, childText: string): Promise<void> {
    // First click the dropdown toggle to expand the menu
    await this.clickDropdownToggle(parentText);
    
    // Then click the submenu item
    await this.navItems.filter({ hasText: childText }).click();
  }
}