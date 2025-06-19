// Simple debug script for order combinations
const fs = require('fs');
const path = require('path');

// Check if the allOrderCombinations.ts file exists
const combinationsPath = path.join(
  __dirname, 
  'tests', 
  'meal-ordering', 
  'test-data', 
  'all-combinations-data-provider.ts'
);

console.log(`Checking file: ${combinationsPath}`);
console.log(`File exists: ${fs.existsSync(combinationsPath)}`);

// Read the file content
try {
  const content = fs.readFileSync(combinationsPath, 'utf8');
  
  console.log('\nFile content analysis:');
  console.log(`- File size: ${content.length} bytes`);
  
  // Look for the allOrderCombinations export
  const hasExport = content.includes('export const allOrderCombinations');
  console.log(`- Has export declaration: ${hasExport}`);
  
  // Check if it's being calculated
  const hasCalculation = content.includes('allOrderCombinations = generateAllOrderCombinations()');
  console.log(`- Has calculation: ${hasCalculation}`);
  
  // Check for any empty array initializations
  const hasEmptyArray = content.includes('const orders: OrderDTO[] = []');
  console.log(`- Has empty array initialization: ${hasEmptyArray}`);
  
  // Look for key function definitions
  console.log('\nKey function presence check:');
  console.log(`- generateMealRows: ${content.includes('const generateMealRows')}`);
  console.log(`- generateMealRowSamples: ${content.includes('const generateMealRowSamples')}`);
  console.log(`- generateAllOrderCombinations: ${content.includes('export const generateAllOrderCombinations')}`);
  
  // Check return statements
  const returnSamples = content.match(/return result\.slice\(0,\s*sampleSize\)/g);
  console.log(`- Return samples: ${returnSamples ? 'found' : 'not found'}`);
  
  const returnOrders = content.match(/return orders/g);
  console.log(`- Return orders: ${returnOrders ? 'found' : 'not found'}`);

  // Let's look for default export
  console.log(`- Default export: ${content.includes('export default allOrderCombinations')}`);
  
  // Extract the generateAllOrderCombinations function to see its content
  const functionMatch = content.match(/export const generateAllOrderCombinations[\s\S]+?return orders;[\s\S]+?\}/);
  if (functionMatch) {
    console.log('\nFunction content:');
    console.log(functionMatch[0]);
  }

} catch (err) {
  console.error(`Error reading file: ${err.message}`);
}
