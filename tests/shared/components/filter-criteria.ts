import { Locator } from "@playwright/test";

/**
 * Base interface for all filter criteria
 */
export interface BaseFilterCriteria {
  type: string;
  [key: string]: any;
}

/**
 * Text filter criteria
 */
export interface TextFilterCriteria extends BaseFilterCriteria {
  type: 'text';
  value: string;
  locator: Locator;
}

/**
 * Dropdown filter criteria
 */
export interface DropdownFilterCriteria extends BaseFilterCriteria {
  type: 'dropdown';
  value: string;
  locator: Locator;
}

/**
 * Date filter criteria
 */
export interface DateFilterCriteria extends BaseFilterCriteria {
  type: 'date';
  value: string;
  locator: Locator;
}

/**
 * Checkbox filter criteria
 */
export interface CheckboxFilterCriteria extends BaseFilterCriteria {
  type: 'checkbox';
  locator: Locator;
  state?: boolean;
}

/**
 * Union type of all filter criteria
 */
export type FilterCriterion = 
  | TextFilterCriteria 
  | DropdownFilterCriteria 
  | DateFilterCriteria 
  | CheckboxFilterCriteria;

/**
 * Class to manage filter criteria
 */
export class FilterCriteria {
  private criteria: FilterCriterion[] = [];

  /**
   * Add a text filter criterion
   */
  addText(value: string, locator: Locator): FilterCriteria {
    this.criteria.push({
      type: 'text',
      value,
      locator
    });
    return this;
  }

  /**
   * Add a dropdown filter criterion
   */
  addDropdown(value: string, locator: Locator): FilterCriteria {
    this.criteria.push({
      type: 'dropdown',
      value,
      locator
    });
    return this;
  }

  /**
   * Add a date filter criterion
   */
  addDate(value: string, locator: Locator): FilterCriteria {
    this.criteria.push({
      type: 'date',
      value,
      locator
    });
    return this;
  }

  /**
   * Add a checkbox filter criterion
   */
  addCheckbox(locator: Locator, state?: boolean): FilterCriteria {
    this.criteria.push({
      type: 'checkbox',
      locator,
      state
    });
    return this;
  }

  /**
   * Get all criteria
   */
  getCriteria(): FilterCriterion[] {
    return this.criteria;
  }

  /**
   * Clear all criteria
   */
  clear(): FilterCriteria {
    this.criteria = [];
    return this;
  }
}
