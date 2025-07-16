import {Locator} from '@playwright/test';

export interface CompositeFilterInterface<T> {
    readonly locator: Locator;
    resetFilter(): Promise<void>;
    filter(DTO: T): Promise<void>;
}
