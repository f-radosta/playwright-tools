import { log } from '@shared/utils/config';
import {
    Restaurant,
    MealType,
    MealTime,
    type MealRowDTO,
    type OrderDTO
} from '@meal-models/meal-ordering.types';
import {
    combine,
    getEnumValues,
    generateSamples
} from '@shared/utils/combination-utils';

// Generate all possible meal rows
const generateMealRows = (): MealRowDTO[] => {
    const quantities = [1, 2, 3] as const;
    log(`DEBUG: Quantities: ${quantities.length}`);

    const restaurants = getEnumValues(Restaurant);
    log(`DEBUG: Restaurants: ${restaurants.length}`, restaurants);

    const mealTypes = getEnumValues(MealType);
    log(`DEBUG: MealTypes: ${mealTypes.length}`, mealTypes);

    const mealTimes = getEnumValues(MealTime);
    log(`DEBUG: MealTimes: ${mealTimes.length}`, mealTimes);

    const notes = ['', 'Do krabičky'] as const;
    log(`DEBUG: Notes: ${notes.length}`);

    // date -> tomorrow / the day after tomorrow / one week from now
    const dates = [
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ];
    log(`DEBUG: Dates: ${dates.length}`);

    // Generate all combinations of meal row properties
    log('DEBUG: About to generate combinations...');
    const combinations = combine(
        [...quantities],
        [...restaurants],
        [...mealTypes],
        [...mealTimes],
        [...notes],
        [...dates]
    ) as [number, Restaurant, MealType, MealTime, string, Date][];

    log(`DEBUG: Combinations generated: ${combinations.length}`);
    if (combinations.length === 0) {
        log(
            'DEBUG: No combinations generated, checking inputs to combine function...'
        );
        log(`DEBUG: Quantities count: ${quantities.length}`);
        log(`DEBUG: Restaurants count: ${restaurants.length}`);
        log(`DEBUG: MealTypes count: ${mealTypes.length}`);
        log(`DEBUG: MealTimes count: ${mealTimes.length}`);
        log(`DEBUG: Notes count: ${notes.length}`);
        log(`DEBUG: Dates count: ${dates.length}`);
    }

    const result = combinations.map(
        ([quantity, restaurantName, mealType, mealTime, note, date]) => {

            // Create base meal row without mealTime
            const mealRow: Omit<MealRowDTO, 'mealTime'> & { mealTime?: MealTime } = {
                quantity,
                restaurantName,
                pricePerUnit: undefined,
                totalRowPrice: undefined,
                mealType,
                note: note || undefined,
                date // Date is included to distinguish otherwise identical meals on different days
            };

            // Only add mealTime if restaurant is not Tommy's
            if (restaurantName !== Restaurant.Tommys) {
                mealRow.mealTime = mealTime;
            }

            return mealRow;
        }
    );

    log(`DEBUG: Final meal rows generated: ${result.length}`);
    return result;
};

const generateMealRowSamples = <T>(items: T[], sampleSize: number): T[][] => {
    if (items.length <= sampleSize) return [items];

    const result: T[][] = [];

    // Create some orders with single meal rows (for simple cases)
    for (let i = 0; i < Math.min(5, sampleSize); i++) {
        const index = Math.floor(i * (items.length / 5)) % items.length;
        result.push([items[index]]);
    }

    // Create orders with 2 meal rows (for testing multiple items)
    for (let i = 0; i < Math.min(5, sampleSize); i++) {
        const index1 = Math.floor(i * (items.length / 5)) % items.length;
        const index2 = (index1 + Math.floor(items.length / 2)) % items.length;
        result.push([items[index1], items[index2]]);
    }

    // Create a few orders with 3 meal rows (for more complex cases)
    for (let i = 0; i < Math.min(3, sampleSize); i++) {
        const index1 = Math.floor(i * (items.length / 3)) % items.length;
        const index2 = (index1 + Math.floor(items.length / 3)) % items.length;
        const index3 = (index2 + Math.floor(items.length / 3)) % items.length;
        result.push([items[index1], items[index2], items[index3]]);
    }

    // Create at least one order with 5 meal rows (for edge case testing)
    if (items.length >= 5 && sampleSize > result.length) {
        const indices = [
            0,
            Math.floor(items.length / 5),
            Math.floor((items.length * 2) / 5),
            Math.floor((items.length * 3) / 5),
            Math.floor((items.length * 4) / 5)
        ];
        result.push(indices.map(i => items[i]));
    }

    // Ensure we don't exceed the sample size
    return result.slice(0, sampleSize);
};

// Generate a set of orders with good coverage of combinations
export const generateAllOrderCombinations = (): OrderDTO[] => {
    const allMealRows = generateMealRows();
    const orders: OrderDTO[] = [];

    // Generate samples with good coverage (limit to ~15 samples for practicality)
    const samples = generateMealRowSamples(
        allMealRows,
        Math.min(15, allMealRows.length)
    );

    // Create orders from the samples
    for (const mealRows of samples) {
        orders.push({mealRows});
    }

    return orders;
};

// Generate combinations and add debug info
const generatedCombinations = generateAllOrderCombinations();

log(
    `DEBUG: Generated ${generatedCombinations.length} order combinations`
);
generatedCombinations.forEach((order, index) => {
    log(
        `DEBUG: Order ${index + 1} has ${
            order.mealRows.length
        } meals`
    );
});

// Export both as named export and default
export const allOrderCombinations = generatedCombinations;
export default generatedCombinations;
