import {Locator} from '@playwright/test';
import {DailyMenuList, MenuCompositeFilter} from '@meal/components';

export class CompositeMenuList {
    public readonly menuFilter: MenuCompositeFilter;
    private listLocator: Locator;

    constructor(public readonly listAndFilterWrapperLocator: Locator) {
        this.menuFilter = new MenuCompositeFilter(
            this.listAndFilterWrapperLocator.getByTestId('filter')
        );
        this.listLocator = this.listAndFilterWrapperLocator.getByTestId('list');
    }

    /**
     * Get all DailyMenuLists in this composite
     */
    public async getDailyMenuLists(): Promise<DailyMenuList[]> {
        // Always fetch fresh locators
        const allListLocators = await this.listLocator.all();

        // Create a new array of DailyMenuList objects
        const lists: DailyMenuList[] = [];
        for (const locator of allListLocators) {
            lists.push(new DailyMenuList(locator));
        }

        // If no lists were found, create a single one from the main list locator
        if (lists.length === 0) {
            lists.push(
                new DailyMenuList(
                    this.listAndFilterWrapperLocator.getByTestId('list')
                )
            );
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
