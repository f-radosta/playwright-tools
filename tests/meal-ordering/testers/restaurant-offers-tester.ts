import { RestaurantOfferFormPage } from '@meal-pages/restaurant-offers-form';
import { RestaurantOfferFormDTO } from '@meal-models/meal-ordering.types';
import { AppFactory } from '@shared/pages/app.factory';

/**
 * Creates or updates a restaurant offer
 * @param app The AppFactory instance
 * @param offer The offer data to create or update
 * @returns A promise that resolves when the operation is complete
 */
export async function createOrUpdateRestaurantOffer(
    app: AppFactory,
    offer: RestaurantOfferFormDTO
): Promise<void> {

    // Initialize the restaurant offers page
    const restaurantOffersPage = await app.gotoRestaurantOffers();
    
    // Try to find an existing offer with the same name
    const existingOffer = await restaurantOffersPage.restaurantOffersList.findRestaurantOfferByName(offer.name);
    
    let form: RestaurantOfferFormPage;
    
    if (existingOffer) {
        // If offer exists, go to edit form
        form = await existingOffer.goToEditForm(app.page.page);
    } else {
        // If offer doesn't exist, create a new one
        form = await restaurantOffersPage.goToAddForm();
    }
    await form.fillForm(offer);
    
    // Verify the operation was successful by checking the page title is visible
    await restaurantOffersPage.pageTitle().isVisible();
}

export async function moveAllRestaurantOffersToPast(app: AppFactory): Promise<void> {
    const restaurantOffersPage = await app.gotoRestaurantOffers();
    const offers = await restaurantOffersPage.restaurantOffersList.getItems();
    const offersLength = offers.length;

    for (let i = 0; i < offersLength; i) {
        const item = await restaurantOffersPage.restaurantOffersList.getItem(i);
        if (await item.isDateIn2020()) {
            i++;
            continue;
        }
        const editForm = await item.goToEditForm(app.page.page);
        try {
            await editForm.moveToPast();
        } catch (error) {
            i++;
            await editForm.page.getByRole('link', {name: 'Zpět na výpis'}).click();
        } finally {
            await app.page.reloadPage();
        }
    }
}
