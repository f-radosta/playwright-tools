import { Locator } from "@playwright/test";

export interface ListItemInterface {
    readonly itemLocator: Locator;
    getAllText(): Promise<string | null>;
    click(): Promise<void>;
    clickEdit(): Promise<void>;
    clickDelete(): Promise<void>;
    isVisible(): Promise<boolean>;
    deleteItself(): Promise<void>;
    locator(selector: string): Locator;
}
