import {Locator, Page} from '@playwright/test';
import {BasePage} from '@shared-pages/base-page';
import {DepartmentsList} from '@training-components/index';
import {PageInterface} from '@shared-pages/page.interface';
import {SHARED_SELECTORS} from '@shared-selectors/shared.selectors';
import {TRAINING_SELECTORS} from '@training-selectors/training.selectors';

export class DepartmentsPage extends BasePage implements PageInterface {
    pageTitle(): Locator {
        return this.page
            .getByRole('heading', {name: 'Číselník kategorie školení'})
            .locator('span');
    }
    readonly createButton = () => this.page.getByRole('link', {name: 'Přidat'});

    private _departmentsList: DepartmentsList | null = null;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Get the categories list component
     * Lazy-loaded to ensure the component is only created when needed
     */
    get departmentsList(): DepartmentsList {
        if (!this._departmentsList) {
            this._departmentsList = new DepartmentsList(
                this.page.getByTestId(
                    SHARED_SELECTORS.LIST.LIST_AND_FILTER_WRAPPER
                )
            );
        }
        return this._departmentsList;
    }

    async createNewDepartment(name: string): Promise<void> {
       await this.createButton().click();
       await this.page.getByLabel('Název oddělení').fill(name);
       await this.page.getByRole('button', {name: 'Přidat'}).click();
       await this.page.getByText('Výpis oddělení').waitFor({state: 'visible'});
    }

    async deleteDepartmentByName(name: string): Promise<void> {
        const department = await this.departmentsList.findDepartmentByName(name);
        if (!department) {
            throw new Error(`Department "${name}" not found`);
        }
        await department.deleteItself();
    }
}
