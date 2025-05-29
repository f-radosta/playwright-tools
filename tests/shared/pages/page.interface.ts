import {Locator} from '@playwright/test';

export interface PageInterface {
    pageTitle(): Locator;
}
