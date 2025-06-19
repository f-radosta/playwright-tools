// Debug script to check what's happening with meal combinations
console.log('Starting debug of meal combinations');

// Mock the required enums first
const Restaurant = {
  RESTAURANT1: 'restaurant1',
  RESTAURANT2: 'restaurant2'
};

const MealType = {
  MAIN: 'main',
  SOUP: 'soup',
  DESSERT: 'dessert',
  SALAD: 'salad'
};

const MealTime = {
  LUNCH: 'lunch',
  DINNER: 'dinner'
};

// A simplified version of getEnumValues
const getEnumValues = (e) => Object.values(e).filter(v => typeof v === 'string');

// A simplified version of combine
const combine = (...arrays) => {
  return arrays.reduce(
    (results, array) => 
      results.flatMap(result => 
        array.map(value => [...result, value])
      ),
    [[]]
  );
};

// A simplified version of generateSamples
const generateSamples = (items, sampleSize) => {
  if (items.length <= sampleSize) return [...items];
  
  const samples = [];
  const step = Math.max(1, Math.floor(items.length / sampleSize));
  
  for (let i = 0; i < items.length && samples.length < sampleSize; i += step) {
    samples.push(items[i]);
  }
  
  return samples.slice(0, sampleSize);
};

// Simplified version of generateMealRows
const generateMealRows = () => {
  const quantities = [1, 2, 3];
  const restaurants = getEnumValues(Restaurant);
  const mealTypes = getEnumValues(MealType);
  const mealTimes = getEnumValues(MealTime);
  const notes = ['', 'Do krabičky'];
  const dates = [
    new Date(Date.now() + 24 * 60 * 60 * 1000), 
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ];

  console.log('Input arrays lengths:');
  console.log('quantities:', quantities.length);
  console.log('restaurants:', restaurants.length);
  console.log('mealTypes:', mealTypes.length);
  console.log('mealTimes:', mealTimes.length);
  console.log('notes:', notes.length);
  console.log('dates:', dates.length);

  // Generate all combinations
  const combinations = combine(
    quantities,
    restaurants,
    mealTypes,
    mealTimes,
    notes,
    dates
  );

  console.log('Total combinations generated:', combinations.length);

  // Map to meal row DTOs (simplified)
  return combinations.map(([quantity, restaurantName, mealType, mealTime, note, date]) => {
    const pricePerUnit = Math.floor(Math.random() * 200 + 50); // 50-250 CZK
    const totalRowPrice = pricePerUnit * quantity;
    
    return {
      quantity,
      restaurantName,
      pricePerUnit: pricePerUnit.toString(),
      totalRowPrice: totalRowPrice.toString(),
      mealType,
      mealTime,
      note: note || undefined,
      date
    };
  });
};

// Simplified meal row samples
const generateMealRowSamples = (items, sampleSize) => {
  console.log('Generating samples from', items.length, 'items with max size', sampleSize);
  
  if (items.length <= sampleSize) {
    console.log('Items <= sampleSize, returning all items');
    return [items];
  }
  
  const samples = new Set();
  const result = [];
  
  // Add single items
  const singleItems = generateSamples(items, sampleSize);
  console.log('Single items generated:', singleItems.length);
  
  singleItems.forEach(item => {
    const key = JSON.stringify([item]);
    if (!samples.has(key)) {
      samples.add(key);
      result.push([item]);
    }
  });
  
  console.log('Result after adding single items:', result.length);
  
  // Add some pairs if we have enough items
  if (items.length > 1) {
    const pairs = generateSamples(items, Math.min(5, items.length * 2));
    console.log('Pairs generated:', pairs.length);
    
    for (let i = 0; i < pairs.length - 1; i++) {
      const key = JSON.stringify([pairs[i], pairs[i + 1]]);
      if (!samples.has(key)) {
        samples.add(key);
        result.push([pairs[i], pairs[i + 1]]);
      }
    }
    
    console.log('Result after adding pairs:', result.length);
  }
  
  // Add a triple if we have enough items
  if (items.length >= 3) {
    const triple = items.slice(0, 3);
    const key = JSON.stringify(triple);
    if (!samples.has(key)) {
      samples.add(key);
      result.push(triple);
    }
    
    console.log('Result after adding triple:', result.length);
  }
  
  const finalResult = result.slice(0, sampleSize);
  console.log('Final result length:', finalResult.length);
  return finalResult;
};

// Generate all orders
const generateAllOrderCombinations = () => {
  console.log('Generating all meal rows...');
  const allMealRows = generateMealRows();
  console.log('Generated meal rows:', allMealRows.length);
  
  const orders = [];
  
  // Generate samples
  console.log('Generating meal row samples...');
  const samples = generateMealRowSamples(allMealRows, Math.min(15, allMealRows.length));
  console.log('Generated samples:', samples.length);
  console.log('Sample breakdown:');
  samples.forEach((sample, i) => {
    console.log(`- Sample ${i + 1}: ${sample.length} meal rows`);
  });
  
  // Create orders
  for (const mealRows of samples) {
    const totalOrderPrice = mealRows
      .reduce((sum, row) => sum + parseInt(row.totalRowPrice, 10), 0)
      .toString();
      
    orders.push({
      mealRows,
      totalOrderPrice
    });
  }
  
  console.log('Generated', orders.length, 'orders');
  return orders;
};

try {
  const orders = generateAllOrderCombinations();
  console.log('\nFINAL RESULTS:');
  console.log(`Generated ${orders.length} orders`);
  orders.forEach((order, i) => {
    console.log(`Order ${i + 1}: ${order.mealRows.length} meals, Total Price: ${order.totalOrderPrice}`);
  });
} catch (e) {
  console.error('Error during generation:', e);
}
