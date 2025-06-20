import {
    OrderDTO,
    OrdersWithFilterCriteriaDTO,
    FilterCriteriaCombinationDTO
} from '../models/meal-ordering.types';

/**
 * Generate appropriate filter criteria for a meal row
 * @param mealRow The meal row to generate filter criteria for
 * @param filterType The type of filtering to apply: 'none', 'all', 'mixed'
 * @param index Optional index to create deterministic mixed filters
 */
const generateFilterForMealRow = (
    mealRow: OrderDTO['mealRows'][0],
    filterType: 'none' | 'all' | 'mixed',
    index: number = 0
): FilterCriteriaCombinationDTO => {
    // Calculate meal date offset from today in days (using a fixed base date for determinism)
    const today = new Date();
    const baseDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
    const dateOffset = Math.floor(
        (mealRow.date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    // Determine date filter parameters based on the offset
    // Different strategies based on how far in future the meal is
    let startOffset = 0;
    let daysToInclude = 0; // 0 means don't include date filter

    // Strategy:
    // - For tomorrow (+1): No date filter
    // - For day after tomorrow (+2): Filter from tomorrow to one week
    // - For one week later (+7): Exact filter for that day
    if (dateOffset === 1) {
        // Tomorrow - No date filter
        daysToInclude = 0; // Will disable date filtering
    } else if (dateOffset === 2) {
        // Day after tomorrow - Filter from tomorrow to one week
        startOffset = 1; // Start from tomorrow
        daysToInclude = 7; // Include a full week
    } else if (dateOffset === 7) {
        // One week from now - Exact day filter
        startOffset = 7; // Start from one week
        daysToInclude = 1; // Just that one day
    }

    switch (filterType) {
        case 'none':
            // No filters applied
            return {
                includeRestaurant: false,
                includeFoodType: false,
                includeDateRange: false
            };

        case 'all':
            // All filters that match this meal
            // Only include date range filter if we have days to include
            return {
                includeRestaurant: true,
                includeFoodType: true,
                includeDateRange: daysToInclude > 0,
                restaurant: mealRow.restaurantName,
                foodType: mealRow.mealType,
                daysToInclude: daysToInclude > 0 ? daysToInclude : undefined,
                startOffset: daysToInclude > 0 ? startOffset : undefined
            };

        case 'mixed':
            // Deterministic filter selection based on index
            // Create different combinations based on modulo
            const pattern = index % 4;

            // Define filter patterns deterministically
            let useRestaurant = false;
            let useFoodType = false;
            let useDateRange = false;

            switch (pattern) {
                case 0: // Restaurant only
                    useRestaurant = true;
                    break;
                case 1: // Food type only
                    useFoodType = true;
                    break;
                case 2: // Date range only
                    useDateRange = true;
                    break;
                case 3: // Restaurant + Food Type
                    useRestaurant = true;
                    useFoodType = true;
                    break;
            }

            // Only apply date range filter if we have days to include AND useDateRange is true
            const applyDateFilter = useDateRange && daysToInclude > 0;

            return {
                includeRestaurant: useRestaurant,
                includeFoodType: useFoodType,
                includeDateRange: applyDateFilter,
                // Only include filter values if the filter is enabled
                restaurant: useRestaurant ? mealRow.restaurantName : undefined,
                foodType: useFoodType ? mealRow.mealType : undefined,
                daysToInclude: applyDateFilter ? daysToInclude : undefined,
                startOffset: applyDateFilter ? startOffset : undefined
            };
    }
};

/**
 * Generates filter criteria for each meal in an order
 * @param order The order to generate filter criteria for
 * @returns Orders with associated filter criteria
 */
export const generateFiltersForOrder = (
    order: OrderDTO
): OrdersWithFilterCriteriaDTO => {
    const filterTypes: Array<'none' | 'all' | 'mixed'> = [
        'none',
        'all',
        'mixed'
    ];
    const ordersWithFilters: OrdersWithFilterCriteriaDTO = {};

    // Process each meal row in the order
    order.mealRows.forEach((mealRow, index) => {
        // Cycle through filter types for variety
        const filterType = filterTypes[index % filterTypes.length];

        // Generate appropriate filter criteria for this meal
        const filterCriteria = generateFilterForMealRow(mealRow, filterType);

        // Add to the result
        ordersWithFilters[`meal-${index}`] = {
            mealRow,
            filterCriteria
        };
    });

    return ordersWithFilters;
};

// Export the main function as default
export default generateFiltersForOrder;
