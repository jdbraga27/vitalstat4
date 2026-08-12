// Small curated food/drink database with approximate public nutrition-facts values
// (USDA FoodData Central / manufacturer labels), per one typical serving.
// Values are approximate and for general informational use only.

export const EMPTY_NUTRIENTS = {
  caffeine: 0, sodium: 0, sugar: 0, protein: 0, fiber: 0, calories: 0, satFat: 0, cholesterol: 0,
};

const item = (name, servingLabel, n) => ({
  name, servingLabel, nutrients: { ...EMPTY_NUTRIENTS, ...n },
});

export const FOOD_DB = [
  item("Diet Coke", "1 can (12oz)", { caffeine: 46, sodium: 40 }),
  item("Coca-Cola Classic", "1 can (12oz)", { caffeine: 34, sodium: 45, sugar: 39, calories: 140 }),
  item("Pepsi", "1 can (12oz)", { caffeine: 38, sodium: 30, sugar: 41, calories: 150 }),
  item("Dr Pepper", "1 can (12oz)", { caffeine: 42, sodium: 55, sugar: 40, calories: 150 }),
  item("Sprite", "1 can (12oz)", { sodium: 65, sugar: 38, calories: 140 }),
  item("Fanta Orange", "1 can (12oz)", { sodium: 45, sugar: 44, calories: 160 }),
  item("Root beer", "1 can (12oz)", { sodium: 45, sugar: 39, calories: 150 }),
  item("Ginger ale", "1 can (12oz)", { sodium: 35, sugar: 32, calories: 125 }),
  item("Mountain Dew", "1 can (12oz)", { caffeine: 54, sodium: 55, sugar: 46, calories: 170 }),
  item("Diet Mountain Dew", "1 can (12oz)", { caffeine: 54, sodium: 40 }),
  item("Coffee, brewed", "1 cup (8oz)", { caffeine: 95, sodium: 5, calories: 2 }),
  item("Decaf coffee", "1 cup (8oz)", { caffeine: 3, calories: 2 }),
  item("Espresso", "1 shot (1oz)", { caffeine: 63 }),
  item("Cappuccino", "1 cup (8oz)", { caffeine: 75, sugar: 6, protein: 4, calories: 60, sodium: 55 }),
  item("Cold brew coffee", "1 cup (12oz)", { caffeine: 155, calories: 5 }),
  item("Latte", "1 grande (16oz)", { caffeine: 150, sugar: 17, protein: 12, calories: 190, sodium: 150 }),
  item("Starbucks Grande Latte", "1 grande (16oz)", { caffeine: 150, sugar: 17, protein: 12, calories: 190, sodium: 150 }),
  item("Starbucks Caramel Macchiato", "1 grande (16oz)", { caffeine: 150, sugar: 34, protein: 10, calories: 250, sodium: 150 }),
  item("Starbucks Cold Brew", "1 grande (16oz)", { caffeine: 205, calories: 5 }),
  item("Starbucks brewed coffee", "1 grande (16oz)", { caffeine: 310, calories: 5 }),
  item("Dunkin' Iced Coffee", "1 medium (24oz)", { caffeine: 297, calories: 15 }),
  item("Chai latte", "1 grande (16oz)", { caffeine: 95, sugar: 42, protein: 8, calories: 240, sodium: 115 }),
  item("Black tea", "1 cup (8oz)", { caffeine: 47 }),
  item("Green tea", "1 cup (8oz)", { caffeine: 28 }),
  item("Matcha latte", "1 grande (16oz)", { caffeine: 80, sugar: 32, protein: 8, calories: 240, sodium: 115 }),
  item("Herbal tea", "1 cup (8oz)", {}),
  item("Iced tea, sweetened", "1 cup (12oz)", { caffeine: 35, sugar: 32, calories: 120 }),
  item("Red Bull", "1 can (8.4oz)", { caffeine: 80, sugar: 27, calories: 110, sodium: 105 }),
  item("Monster Energy", "1 can (16oz)", { caffeine: 160, sugar: 54, calories: 210, sodium: 370 }),
  item("Gatorade", "1 bottle (20oz)", { sodium: 270, sugar: 34, calories: 140 }),
  item("Powerade", "1 bottle (20oz)", { sodium: 150, sugar: 34, calories: 130 }),
  item("Coconut water", "1 cup (8oz)", { sodium: 252, sugar: 6, calories: 45 }),
  item("Kombucha", "1 bottle (16oz)", { sugar: 8, calories: 60 }),
  item("Sparkling water", "1 can (12oz)", {}),
  item("Water", "1 glass (8oz)", {}),
  item("Lemonade", "1 cup (8oz)", { sugar: 25, calories: 100, sodium: 7 }),
  item("Orange juice", "1 cup (8oz)", { sugar: 21, calories: 110, sodium: 2 }),
  item("Apple juice", "1 cup (8oz)", { sugar: 24, calories: 114, sodium: 10 }),
  item("Whole milk", "1 cup (8oz)", { protein: 8, sodium: 105, satFat: 4.6, sugar: 12, calories: 149 }),
  item("Chocolate milk", "1 cup (8oz)", { protein: 8, sugar: 24, calories: 190, sodium: 150 }),
  item("Almond milk, unsweetened", "1 cup (8oz)", { calories: 30, sodium: 170, protein: 1 }),
  item("Oat milk", "1 cup (8oz)", { calories: 120, sugar: 7, sodium: 100, protein: 3 }),
  item("Dark chocolate (70-85%)", "1oz", { caffeine: 23, sugar: 7, satFat: 5, calories: 170 }),
  item("Milk chocolate bar", "1.5oz", { caffeine: 9, sugar: 24, satFat: 8, calories: 235 }),
  item("White bread", "1 slice", { sodium: 170, fiber: 0.8, calories: 75 }),
  item("Whole wheat bread", "1 slice", { sodium: 140, fiber: 1.9, calories: 70 }),
  item("Bagel with cream cheese", "1 bagel", { sodium: 460, satFat: 5, calories: 350, protein: 11 }),
  item("Donut", "1 glazed", { sugar: 12, satFat: 3.5, calories: 240, sodium: 205 }),
  item("Banana", "1 medium", { fiber: 3.1, sugar: 14, calories: 105, sodium: 1 }),
  item("Apple", "1 medium", { fiber: 4.4, sugar: 19, calories: 95, sodium: 2 }),
  item("Avocado", "1/2 medium", { fiber: 5, satFat: 2, calories: 120, sodium: 5 }),
  item("Sweet potato, baked", "1 medium", { fiber: 4, sugar: 7, calories: 103, sodium: 41 }),
  item("Chicken breast, grilled", "4oz", { protein: 35, sodium: 74, satFat: 1, calories: 187, cholesterol: 96 }),
  item("Chicken wings", "6 wings", { sodium: 700, satFat: 6, protein: 30, calories: 430, cholesterol: 150 }),
  item("Turkey breast, sliced", "3oz", { protein: 24, sodium: 900, calories: 90 }),
  item("Salmon fillet", "4oz", { protein: 25, satFat: 2, cholesterol: 62, calories: 233, sodium: 60 }),
  item("Sushi roll (California)", "8 pieces", { sodium: 400, protein: 9, calories: 255, fiber: 2 }),
  item("Egg", "1 large", { protein: 6, cholesterol: 186, satFat: 1.6, calories: 78, sodium: 62 }),
  item("Greek yogurt, plain", "1 cup", { protein: 20, sugar: 7, calories: 130, sodium: 65 }),
  item("Cheddar cheese", "1oz slice", { sodium: 180, satFat: 6, cholesterol: 30, calories: 115, protein: 7 }),
  item("Bacon", "2 slices", { sodium: 270, satFat: 3.3, cholesterol: 22, calories: 90 }),
  item("Tofu", "1/2 cup", { protein: 10, calories: 94, sodium: 7, fiber: 1 }),
  item("Peanut butter", "2 tbsp", { protein: 7, fiber: 2, satFat: 3, calories: 190, sodium: 150 }),
  item("Potato chips", "1oz bag", { sodium: 170, satFat: 1, calories: 150 }),
  item("Pretzels", "1oz", { sodium: 390, calories: 110 }),
  item("Popcorn, air-popped", "3 cups", { fiber: 3.5, calories: 93, sodium: 1 }),
  item("Granola bar", "1 bar", { sugar: 12, fiber: 3, calories: 190, sodium: 105 }),
  item("Ice cream", "1/2 cup", { sugar: 14, satFat: 4.5, calories: 137, sodium: 53, cholesterol: 29 }),
  item("Frozen pizza slice", "1/6 pizza", { sodium: 640, satFat: 5, calories: 285, cholesterol: 25 }),
  item("Instant ramen", "1 packet", { sodium: 1560, satFat: 3, calories: 380 }),
  item("Chicken noodle soup, canned", "1 cup", { sodium: 890, calories: 70, protein: 4 }),
  item("Fast food cheeseburger", "1 sandwich", { sodium: 990, satFat: 12, protein: 25, calories: 540, cholesterol: 90 }),
  item("French fries", "1 medium order", { sodium: 350, satFat: 3.5, calories: 365 }),
  item("Tacos, beef", "2 tacos", { sodium: 700, satFat: 6, protein: 18, calories: 340, cholesterol: 55 }),
  item("Burrito, chicken", "1 burrito", { sodium: 1400, protein: 32, calories: 650, fiber: 8, satFat: 6 }),
  item("Caesar salad with chicken", "1 bowl", { sodium: 1100, protein: 30, calories: 470, satFat: 6, cholesterol: 90 }),
  item("Rice, white cooked", "1 cup", { calories: 205, sodium: 2 }),
  item("Pasta, cooked", "1 cup", { calories: 220, sodium: 1, protein: 8, fiber: 2.5 }),
  item("Almonds", "1oz (~23 nuts)", { fiber: 3.5, protein: 6, satFat: 1, calories: 164 }),
  item("Black beans, cooked", "1 cup", { fiber: 15, protein: 15, sodium: 2, calories: 227 }),
  item("Broccoli, cooked", "1 cup", { fiber: 5, calories: 55, sodium: 64 }),
  item("Oatmeal, plain", "1 cup cooked", { fiber: 4, protein: 6, calories: 166, sodium: 9 }),
  item("Protein bar", "1 bar", { protein: 20, sugar: 9, fiber: 10, calories: 200, sodium: 200 }),
  item("Table salt", "1 tsp", { sodium: 2300 }),
  item("Soy sauce", "1 tbsp", { sodium: 900 }),
];

const norm = (s) => s.toLowerCase().trim();

export function findMatches(query, limit = 10) {
  const q = norm(query);
  if (!q) return [];
  return FOOD_DB.filter((f) => norm(f.name).includes(q)).slice(0, limit);
}

export function findExact(query) {
  const q = norm(query);
  return FOOD_DB.find((f) => norm(f.name) === q) || null;
}
