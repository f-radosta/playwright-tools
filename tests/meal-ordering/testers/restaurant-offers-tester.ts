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
        // Clear existing form data
        await form.deleteAllMeals();
    } else {
        // If offer doesn't exist, create a new one
        form = await restaurantOffersPage.goToAddForm();
    }
    
    // Fill and submit the form with the provided data
    await form.fillForm(offer);
    await form.saveForm();
    
    // Verify the operation was successful by checking the page title is visible
    await restaurantOffersPage.pageTitle().isVisible();
}