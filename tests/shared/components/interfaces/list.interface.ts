import { Locator } from "@playwright/test";
import { ListItemInterface } from "./list-item.interface";

export interface ListInterface {
    readonly itemLocators: Locator;
    getItemLocators(): Promise<Locator[]>;
    getItems(): Promise<ListItemInterface[]>;
    getItem(index: number): Promise<ListItemInterface>;
    getItemText(index: number): Promise<string | null>;
    clickItem(index: number): Promise<void>;
    clickEdit(index: number): Promise<void>;
    clickDelete(index: number): Promise<void>;
    getItemCount(): Promise<number>;
}
