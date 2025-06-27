/**
 * Utility functions for generating combinations and samples for test data
 */

/**
 * Generates all combinations of array elements (Cartesian product)
 * @example
 * combine([1, 2], ['a', 'b']) => [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 */
export function combine<T extends any[]>(...arrays: { [K in keyof T]: readonly T[K][] }): T[] {
  return arrays.reduce<T[]>(
    (results, array) => 
      results.flatMap(result => 
        array.map((value): T[number] => [...result, value] as T[number])
      ),
    [[]] as unknown as T[]
  );
}

/**
 * Safely gets all string values from an enum
 */
export const getEnumValues = <T extends Record<string, string | number>>(e: T): T[keyof T][] => {
  // For string enums, we need to filter out numeric keys that TypeScript adds
  // to allow reverse mapping (e.g., { '0': 'Value', 'Key': 'Value', 'Value': 0 })
  return Object.values(e).filter((v): v is T[keyof T] => 
    // Keep string values and filter out numeric indices
    typeof v === 'string' && isNaN(Number(v))
  );
};

/**
 * Generates a deterministic sample of items with good coverage
 * @param items Array of items to sample from
 * @param sampleSize Maximum number of samples to return
 * @returns Array of sampled items
 */
export function generateSamples<T>(items: T[], sampleSize: number): T[] {
  if (items.length <= sampleSize) return [...items];
  
  const samples: T[] = [];
  const step = Math.max(1, Math.floor(items.length / sampleSize));
  
  // Take first, last, and evenly distributed samples
  for (let i = 0; i < items.length; i += step) {
    samples.push(items[i]);
    
    // Also include combinations with the first and last items
    if (i > 0 && i < items.length - 1) {
      samples.push(items[0]);
      samples.push(items[items.length - 1]);
    }
  }
  
  // Ensure we have at least one combination with a middle item
  if (items.length > 3) {
    samples.push(items[Math.floor(items.length / 2)]);
  }
  
  // Remove duplicates and limit to sampleSize
  return [...new Map(samples.map(item => [JSON.stringify(item), item])).values()]
    .slice(0, sampleSize);
}

/**
 * Generates combinations of array elements with a specified size
 * @param items Array of items to combine
 * @param size Size of each combination
 * @returns Array of combinations
 */
export function generateCombinations<T>(items: T[], size: number): T[][] {
  if (size <= 0 || size > items.length) return [];
  if (size === items.length) return [[...items]];
  if (size === 1) return items.map(item => [item]);
  
  const result: T[][] = [];
  
  for (let i = 0; i <= items.length - size; i++) {
    const head = items[i];
    const tail = items.slice(i + 1);
    const combinations = generateCombinations(tail, size - 1);
    combinations.forEach(combination => {
      result.push([head, ...combination]);
    });
  }
  
  return result;
}

/**
 * Generates all possible combinations of array elements
 * @param items Array of items to combine
 * @returns Array of all possible combinations
 */
export function generateAllCombinations<T>(items: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 1; i <= items.length; i++) {
    result.push(...generateCombinations(items, i));
  }
  return result;
}