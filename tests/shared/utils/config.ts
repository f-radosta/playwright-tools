// Shared config for debug logging and utilities

export const DEBUG = true; // Set to false to disable debug logs

export function log(...args: any[]) {
    if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log('[DEBUG]', ...args);
    }
}
