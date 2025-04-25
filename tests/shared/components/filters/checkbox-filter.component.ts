import { Locator, Page } from "@playwright/test";
import { SingleFilterComponent } from "../filter.component";

/**
 * Component for checkbox filter controls
 */
export class CheckboxFilterComponent extends SingleFilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param locator The locator for the checkbox element
   */
  constructor(
    root: Locator | Page,
    locator: Locator
  ) {
    super(root, locator);
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
}
