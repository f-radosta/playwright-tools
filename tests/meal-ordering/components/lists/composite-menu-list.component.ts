import {Locator} from '@playwright/test';
import {DailyMenuList, MenuCompositeFilter} from '@meal-components/index';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';

export class CompositeMenuList {
    public readonly menuFilter: MenuCompositeFilter;
    private listLocator: Locator;

    constructor(public readonly listAndFilterWrapperLocator: Locator) {
        this.menuFilter = new MenuCompositeFilter(
            this.listAndFilterWrapperLocator.getByTestId(SHARED_SELECTORS.LIST.FILTER)
        );

        this.listLocator =
            this.listAndFilterWrapperLocator.getByTestId(SHARED_SELECTORS.LIST);
    }

    /**
     * Get all DailyMenuLists in this composite
     * Always fetches fresh locators to ensure we have the latest data
     */
    public async getDailyMenuLists(): Promise<DailyMenuList[]> {
        // Always fetch fresh locators
        const allListLocators = await this.listLocator.all();

        // Create a new array of DailyMenuList objects
        const lists: DailyMenuList[] = [];
        for (const locator of allListLocators) {
            lists.push(new DailyMenuList(locator));
        }

        return lists;
    }

    /**
     * Get a specific DailyMenuList by index
     */
    public async getDailyMenuList(index: number): Promise<DailyMenuList> {
        const lists = await this.getDailyMenuLists();
        if (index < 0 || index >= lists.length) {
            throw new Error(`DailyMenuList index out of range: ${index}`);
        }
        return lists[index];
    }

    /**
     * Get today's menu list
     */
    public async getTodayList(): Promise<DailyMenuList | null> {
        const lists = await this.getDailyMenuLists();
        for (const list of lists) {
            if (await list.isToday()) {
                return list;
            }
        }
        return null;
    }

    /**
     * Get tomorrow's menu list
     */
    public async getTomorrowList(): Promise<DailyMenuList | null> {
        const lists = await this.getDailyMenuLists();
        for (const list of lists) {
            if (await list.isTomorrow()) {
                return list;
            }
        }
        return null;
    }

    /**
     * Get yesterday's menu list
     */
    public async getYesterdayList(): Promise<DailyMenuList | null> {
        const lists = await this.getDailyMenuLists();
        for (const list of lists) {
            if (await list.isYesterday()) {
                return list;
            }
        }
        return null;
    }

    /**
     * Get a menu list for a specific date
     * @param date The date to find a list for
     */
    public async getListByDate(date: Date): Promise<DailyMenuList | null> {
        const lists = await this.getDailyMenuLists();
        for (const list of lists) {
            const listDate = await list.getDate();
            if (
                listDate.getDate() === date.getDate() &&
                listDate.getMonth() === date.getMonth() &&
                listDate.getFullYear() === date.getFullYear()
            ) {
                return list;
            }
        }
        return null;
    }

    /**
     * Get the count of DailyMenuLists in this composite
     */
    public async getDailyMenuListCount(): Promise<number> {
        const lists = await this.getDailyMenuLists();
        return lists.length;
    }
}
