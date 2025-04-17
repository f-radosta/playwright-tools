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
  selector: string;
}

/**
 * Dropdown filter criteria
 */
export interface DropdownFilterCriteria extends BaseFilterCriteria {
  type: 'dropdown';
  value: string;
  selector: string;
}

/**
 * Date filter criteria
 */
export interface DateFilterCriteria extends BaseFilterCriteria {
  type: 'date';
  value: string;
  selector: string;
}

/**
 * Checkbox filter criteria
 */
export interface CheckboxFilterCriteria extends BaseFilterCriteria {
  type: 'checkbox';
  selector: string;
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
  addText(value: string, selector: string): FilterCriteria {
    this.criteria.push({
      type: 'text',
      value,
      selector
    });
    return this;
  }

  /**
   * Add a dropdown filter criterion
   */
  addDropdown(value: string, selector: string): FilterCriteria {
    this.criteria.push({
      type: 'dropdown',
      value,
      selector
    });
    return this;
  }

  /**
   * Add a date filter criterion
   */
  addDate(value: string, selector: string): FilterCriteria {
    this.criteria.push({
      type: 'date',
      value,
      selector
    });
    return this;
  }

  /**
   * Add a checkbox filter criterion
   */
  addCheckbox(selector: string, state?: boolean): FilterCriteria {
    this.criteria.push({
      type: 'checkbox',
      selector,
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
