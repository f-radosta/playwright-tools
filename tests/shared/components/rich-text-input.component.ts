import {Locator} from '@playwright/test';

/**
 * A simplified component for interacting with Quill rich text editors
 */
export class RichTextInputComponent {
    private readonly editorLocator: Locator;
    private readonly textareaLocator: Locator;

    /**
     * @param parentLocator The locator for the parent element containing the Quill editor
     * @param fieldId Optional ID of the textarea field (without the # prefix)
     */
    constructor(
        private readonly parentLocator: Locator,
        private readonly fieldId?: string
    ) {
        // Find the Quill editor container
        const quillContainer = this.parentLocator.locator(
            '[data-controller="quill"]'
        );

        // The editor is the contenteditable div inside the ql-editor class
        this.editorLocator = quillContainer.locator('.ql-editor');

        // Find the hidden textarea either by ID or by data-quill-target attribute
        if (fieldId) {
            this.textareaLocator = this.parentLocator.locator(`#${fieldId}`);
        } else {
            this.textareaLocator = quillContainer.locator(
                'textarea[data-quill-target="input"]'
            );
        }
    }

    /**
     * Sets text content in the rich text editor using direct JavaScript injection
     * This is more reliable than trying to type into the editor
     * @param text The text to set in the editor
     */
    async setText(text: string): Promise<void> {
        // First focus the editor
        await this.editorLocator.click();

        // Set the text content in the editor
        await this.editorLocator.evaluate((element, textContent) => {
            // Clear existing content
            element.innerHTML = '';

            // Create a paragraph with the text
            const p = document.createElement('p');
            p.textContent = textContent;
            element.appendChild(p);

            // Dispatch input event to trigger any listeners
            element.dispatchEvent(new Event('input', {bubbles: true}));
        }, text);

        // Update the hidden textarea directly
        await this.textareaLocator.evaluate((element, textContent) => {
            (element as HTMLTextAreaElement).value = textContent;
            element.dispatchEvent(new Event('input', {bubbles: true}));
            element.dispatchEvent(new Event('change', {bubbles: true}));
        }, text);
    }

    /**
     * Gets the current text content from the editor
     * @returns The text content
     */
    async getText(): Promise<string> {
        const content = await this.editorLocator.textContent();
        return content || '';
    }
}
