import { Locator } from "@playwright/test";

// Define filter types as string constants first to ensure they exist at runtime
export const FILTER_TYPES = {
  TEXT: 'text',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  DATE: 'date'
} as const;

// Create a namespace object for FilterCriterion that will exist at runtime
export const FilterCriterion = {
  // Type guard to check if an object is a valid filter criterion
  isFilterCriterion: (obj: any): obj is any => {
    return obj && 
           typeof obj === 'object' && 
           'type' in obj && 
           Object.values(FILTER_TYPES).includes(obj.type);
  }
};

// Define the interfaces using the string constants
export interface BaseFilterCriteria {
  type: string;
  [key: string]: any;
}

export interface TextFilterCriteria extends BaseFilterCriteria {
  type: typeof FILTER_TYPES.TEXT;
  value: string;
  locator: Locator;
}

export interface DropdownFilterCriteria extends BaseFilterCriteria {
  type: typeof FILTER_TYPES.DROPDOWN;
  value: string;
  locator: Locator;
}

export interface CheckboxFilterCriteria extends BaseFilterCriteria {
  type: typeof FILTER_TYPES.CHECKBOX;
  locator: Locator;
  state?: boolean;
}

export interface DateFilterCriteria extends BaseFilterCriteria {
  type: typeof FILTER_TYPES.DATE;
  value: string;
  locator: Locator;
}

// Define the union type
export type FilterCriterion = 
  | TextFilterCriteria 
  | DropdownFilterCriteria 
  | CheckboxFilterCriteria 
  | DateFilterCriteria;

/**
 * Class for managing multiple filter criteria
 */
export class FilterCriteria {
  private criteria: FilterCriterion[] = [];

  /**
   * Add a filter criterion
   * @param criterion The criterion to add
   */
  addCriterion(criterion: FilterCriterion): FilterCriteria {
    this.criteria.push(criterion);
    return this;
  }
  
  /**
   * Add a text filter criterion
   */
  addText(value: string, locator: Locator): FilterCriteria {
    this.criteria.push({
      type: FILTER_TYPES.TEXT,
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
      type: FILTER_TYPES.DROPDOWN,
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
      type: FILTER_TYPES.DATE,
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
      type: FILTER_TYPES.CHECKBOX,
      locator,
      state
    });
    return this;
  }

  /**
   * Get all criteria
   * @returns Array of filter criteria
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
