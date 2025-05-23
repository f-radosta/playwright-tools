import {BasePage} from '@shared/pages/base-page';
import {Page} from '@playwright/test';
import {CompositeMenuList} from '@meal/components';

export class CurrentMenuPage extends BasePage {
    readonly pageTitle = () =>
        this.page.getByRole('heading', {name: 'Aktuální jídelní menu'});

    // Component instances
    private _menuList: CompositeMenuList | null = null;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the menu list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get menuList(): CompositeMenuList {
        if (!this._menuList) {
            this._menuList = new CompositeMenuList(
                this.page.getByTestId('list-and-filter-wrapper')
            );
        }
        return this._menuList;
    }
}
