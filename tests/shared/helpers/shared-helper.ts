/**
 * Finds an enum value by its display text
 * @param enumObj The enum object to search in
 * @param displayText The display text to search for
 * @returns The matching enum value or null if not found
 */
export function getEnumValueByDisplayText<T extends Record<string, string | number>>(
    enumObj: T,
    displayText: string | null | undefined
): T[keyof T] | null {
    if (!displayText) return null;
    
    const trimmedText = displayText.trim();
    if (!trimmedText) return null;
    
    // Find the enum entry where the value matches the display text
    const entry = Object.entries(enumObj).find(([_, value]) => value === trimmedText);
    return entry ? entry[1] as T[keyof T] : null;
}

/**
 * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
 */
export function normalizeText(text: string | null): string {
    if (text === null) return '';
    return text.trim().replace(/\s+/g, ' ');
}