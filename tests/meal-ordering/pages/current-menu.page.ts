import { BasePage } from '@shared/pages/base-page';

export class CurrentMenuPage extends BasePage {

  readonly pageTitle = () => this.page.getByRole('heading', { name: 'Aktuální jídelní menu' });
}
