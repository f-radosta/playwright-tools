export function getComponentBatches(componentIds: string[], numberOfBatches: number) {
    if (!componentIds?.length || numberOfBatches <= 0) return [];
    
    numberOfBatches = Math.min(numberOfBatches, componentIds.length);
    const itemsPerBatch = Math.ceil(componentIds.length / numberOfBatches);
    const batches: string[][] = [];
    
    for (let i = 0; i < componentIds.length; i += itemsPerBatch) {
        batches.push(componentIds.slice(i, i + itemsPerBatch));
    }
    return batches;
}

export function getBatchNumber(batchIndex: number) {
    return `batch${(batchIndex + 1).toString().padStart(2, '0')}`;
}
