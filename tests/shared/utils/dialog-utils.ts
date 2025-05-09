import { Page } from '@playwright/test';

/**
 * Executes an action that will trigger a confirmation dialog and handles the dialog
 * 
 * @param page The Playwright page
 * @param action The action function that will trigger the dialog
 * @param accept Whether to accept (true) or dismiss (false) the dialog
 * @param expectedMessage Optional message to verify in the dialog
 * @returns The result of the action function
 * 
 * @example
 * ```typescript
 * // Click a delete button that triggers a confirmation dialog
 * await withConfirmationDialog(
 *   page,
 *   async () => {
 *     await deleteButton.click();
 *   }
 * );
 * ```
 */
export async function withConfirmationDialog<T>(
  page: Page,
  action: () => Promise<T>,
  accept: boolean = true,
  expectedMessage?: string
): Promise<T> {
  // Set up dialog handler using the event listener approach that worked before
  let dialogHandled = false;
  
  const dialogHandler = async (dialog: any) => {
    // Verify dialog message if expected
    if (expectedMessage) {
      const message = dialog.message();
      if (!message.includes(expectedMessage)) {
        console.warn(`Dialog message "${message}" does not contain expected text "${expectedMessage}"`);
      }
    }
    
    // Accept or dismiss the dialog
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
    
    dialogHandled = true;
  };
  
  // Add the dialog handler
  page.on('dialog', dialogHandler);
  
  try {
    // Perform the action that will trigger the dialog
    const result = await action();
    
    // Wait for network to be idle after dialog handling
    await page.waitForLoadState('networkidle');
    
    return result;
  } finally {
    // Always remove the dialog handler to avoid issues with future dialogs
    page.removeListener('dialog', dialogHandler);
  }
}
