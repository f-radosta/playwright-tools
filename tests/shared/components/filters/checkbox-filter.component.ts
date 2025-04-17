import { Locator } from "@playwright/test";
import { FilterComponent } from "@shared/components/filter.component";

/**
 * CheckboxFilterComponent provides a specialized interface for checkbox filters
 */
export class CheckboxFilterComponent extends FilterComponent {
  /**
   * @param root The root locator for the filter component
   * @param selector The selector for the checkbox element
   */
  constructor(
    root: Locator,
    private readonly selector: string
  ) {
    super(root);
  }

  /**
   * Sets the checkbox to the specified state
   * @param state The desired state of the checkbox (true for checked, false for unchecked)
   */
  async setState(state: boolean): Promise<void> {
    await this.toggleCheckbox(this.selector, state);
  }

  /**
   * Toggles the current state of the checkbox
   */
  async toggle(): Promise<void> {
    await this.toggleCheckbox(this.selector);
  }

  /**
   * Gets the current state of the checkbox
   * @returns true if checked, false if unchecked
   */
  async isChecked(): Promise<boolean> {
    return this.root.locator(this.selector).isChecked();
  }
}
