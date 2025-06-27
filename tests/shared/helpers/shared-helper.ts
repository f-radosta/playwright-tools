import {BaseListComponent} from '@shared-components/base-list.component';
import {BaseListItemComponent} from '@shared-components/base-list-item.component';
import { Locator } from '@playwright/test';

type ItemWithName = {
    getName(): Promise<string | null>;
} & BaseListItemComponent;

export async function findItemByName<T extends ItemWithName>(
    list: BaseListComponent<T>,
    name: string
): Promise<T | null> {
    if (!name?.trim()) {
        return null;
    }

    const allItems = await list.getItems();
    const trimmedName = name.trim();

    // Search from last to first for faster search in most cases
    for (let i = allItems.length - 1; i >= 0; i--) {
        const item = allItems[i];
        const itemName = await item.getName();

        if (itemName && itemName.trim().localeCompare(trimmedName) === 0) {
            return item;
        }
    }

    return null;
}

/**
 * Finds an enum value by its display text
 * @param enumObj The enum object to search in
 * @param displayText The display text to search for
 * @returns The matching enum value or null if not found
 */
export function getEnumValueByDisplayText<
    T extends Record<string, string | number>
>(enumObj: T, displayText: string | null | undefined): T[keyof T] | null {
    if (!displayText) return null;

    const trimmedText = displayText.trim();
    if (!trimmedText) return null;

    // Find the enum entry where the value matches the display text
    const entry = Object.entries(enumObj).find(
        ([_, value]) => value === trimmedText
    );
    return entry ? (entry[1] as T[keyof T]) : null;
}

/**
 * Helper method to normalize text content by trimming whitespace and replacing multiple spaces with a single space
 */
export function normalizeText(text: string | null): string {
    if (text === null) return '';
    return text.trim().replace(/\s+/g, ' ');
}

/**
 * Helper to safely extract text content and normalize it
 */
export async function safeGetText(locator: Locator): Promise<string | null> {
    try {
        const text = await locator.textContent();
        if (text === null || text.trim() === '') return null;
        return normalizeText(text);
    } catch (error) {
        console.error('Failed to get text content:', error);
        return null;
    }
}