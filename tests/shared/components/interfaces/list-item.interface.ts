import { Locator } from "@playwright/test";

export interface ListItemInterface {
    readonly itemLocator: Locator;
    getText(): Promise<string | null>;
    click(): Promise<void>;
    clickEdit(): Promise<void>;
    clickDelete(): Promise<void>;
    isVisible(): Promise<boolean>;
    locator(selector: string): Locator;
}
