/**
 * Centralized selectors for filter components
 * This allows for easier maintenance and updates to selectors
 */
export const filterSelectors = {
  // Text input selectors
  textInput: '//input[@type="text"]',
  
  // Dropdown selectors
  dropdown: 'select[aria-label="Kategorie školení"]',
  
  // Date filter selectors
  dateFrom: '//input[@placeholder="Od"]',
  dateTo: '//input[@placeholder="Do"]',
  
  // Checkbox selectors
  checkbox: '//input[@type="checkbox"]',
  
  // Button selectors
  resetButton: '//button[@title="Resetovat filtr"]',
  
  // Title attributes for accessibility
  titles: {
    reset: 'Resetovat filtr',
    apply: 'Aplikovat filtr'
  }
};