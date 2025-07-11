import { Restaurant, MealType, OrderDispatchFrequency, RestaurantOfferFormDTO } from '../models/meal-ordering.types';
import { generateOneMonthDateRange } from '@shared/utils/date-utils';


// Base meal entries for each meal type
const baseMeals = [
    {
        mealName: 'Kuřecí řízek s bramborami',
        mealType: MealType.MainCourse,
        price: 120,
        dailyLimit: 15
    },
    {
        mealName: 'Hovězí vývar s játrovými knedlíčky',
        mealType: MealType.Soup,
        price: 30,
        dailyLimit: 20
    },
    {
        mealName: 'Řecký salát',
        mealType: MealType.Salad,
        price: 45,
        dailyLimit: 10
    },
    {
        mealName: 'Jablečný závin se šlehačkou',
        mealType: MealType.Dessert,
        price: 35,
        dailyLimit: 15
    },
    {
        mealName: 'Domácí müsli s jogurtem',
        mealType: MealType.Breakfast,
        price: 50,
        dailyLimit: 10
    },
    {
        mealName: 'Ovocná přesnídávka',
        mealType: MealType.Snack,
        price: 25,
        dailyLimit: 15
    }
];

// Generate one offer for each restaurant
export const restaurantOffers: RestaurantOfferFormDTO[] = Object.values(Restaurant).map((restaurant, index) => ({
    restaurantName: restaurant,
    menuValidity: generateOneMonthDateRange(),
    includeWeekend: true,
    includeHoliday: true,
    name: `TestOffer${index + 1}`,
    orderDispatchFrequency: OrderDispatchFrequency.EbranaCanteen,
    orderDispatchTime: '10:00',
    meals: baseMeals.map(meal => ({
        ...meal,
        mealName: `${meal.mealName} (${restaurant})`
    }))
}));

export default {
    restaurantOffers
};
