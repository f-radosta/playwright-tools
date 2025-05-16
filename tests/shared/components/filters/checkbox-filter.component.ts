import { Locator } from "@playwright/test";
import { SingleFilterInterface } from "../interfaces/single-filter.interface";

/**
 * Component for checkbox filter controls
 */
export class CheckboxFilterComponent implements SingleFilterInterface {

  /**
   * @param locator The locator for the checkbox
   */
  constructor(
    readonly locator: Locator
  ) {
  }

  /**
   * Sets the checkbox to the specified state
   * @param state The desired state of the checkbox (true for checked, false for unchecked)
   */
  async setState(state: boolean): Promise<void> {
    await this.toggleCheckbox(this.locator, state);
  }

  /**
   * Toggles the current state of the checkbox
   */
  async toggle(): Promise<void> {
    await this.toggleCheckbox(this.locator);
  }

  /**
   * Gets the current state of the checkbox
   * @returns true if checked, false if unchecked
   */
  async isChecked(): Promise<boolean> {
    return this.locator.isChecked();
  }

  /**
   * Toggles a checkbox filter
   * @param checkboxLocator The locator for the checkbox
   * @param state Optional desired state (checked/unchecked), toggles current state if not specified
   */
  private async toggleCheckbox(checkboxLocator: Locator, state?: boolean) {
    const checkbox = checkboxLocator;
    if (state !== undefined) {
      const isChecked = await checkbox.isChecked();
      if (isChecked !== state) {
        await checkbox.click();
      }
    } else {
      await checkbox.click();
    }
  }
}
