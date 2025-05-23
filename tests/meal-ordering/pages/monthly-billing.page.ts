import { BasePage } from '@shared/pages/base-page';

export class MonthlyBillingPage extends BasePage {

  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Měsíční vyúčtování restauracím' });

}
