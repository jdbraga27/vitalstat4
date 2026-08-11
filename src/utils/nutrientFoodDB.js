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
  item("Mountain Dew", "1 can (12oz)", { caffeine: 54, sodium: 55, sugar: 46, calories: 170 }),
  item("Diet Mountain Dew", "1 can (12oz)", { caffeine: 54, sodium: 40 }),
  item("Coffee, brewed", "1 cup (8oz)", { caffeine: 95, sodium: 5, calories: 2 }),
  item("Espresso", "1 shot (1oz)", { caffeine: 63 }),
  item("Latte", "1 grande (16oz)", { caffeine: 150, sugar: 17, protein: 12, calories: 190, sodium: 150 }),
  item("Starbucks brewed coffee", "1 grande (16oz)", { caffeine: 310, calories: 5 }),
  item("Black tea", "1 cup (8oz)", { caffeine: 47 }),
  item("Green tea", "1 cup (8oz)", { caffeine: 28 }),
  item("Red Bull", "1 can (8.4oz)", { caffeine: 80, sugar: 27, calories: 110, sodium: 105 }),
  item("Monster Energy", "1 can (16oz)", { caffeine: 160, sugar: 54, calories: 210, sodium: 370 }),
  item("Water", "1 glass (8oz)", {}),
  item("Orange juice", "1 cup (8oz)", { sugar: 21, calories: 110, sodium: 2 }),
  item("Whole milk", "1 cup (8oz)", { protein: 8, sodium: 105, satFat: 4.6, sugar: 12, calories: 149 }),
  item("Chocolate milk", "1 cup (8oz)", { protein: 8, sugar: 24, calories: 190, sodium: 150 }),
  item("Dark chocolate (70-85%)", "1oz", { caffeine: 23, sugar: 7, satFat: 5, calories: 170 }),
  item("Milk chocolate bar", "1.5oz", { caffeine: 9, sugar: 24, satFat: 8, calories: 235 }),
  item("White bread", "1 slice", { sodium: 170, fiber: 0.8, calories: 75 }),
  item("Whole wheat bread", "1 slice", { sodium: 140, fiber: 1.9, calories: 70 }),
  item("Banana", "1 medium", { fiber: 3.1, sugar: 14, calories: 105, sodium: 1 }),
  item("Apple", "1 medium", { fiber: 4.4, sugar: 19, calories: 95, sodium: 2 }),
  item("Chicken breast, grilled", "4oz", { protein: 35, sodium: 74, satFat: 1, calories: 187, cholesterol: 96 }),
  item("Salmon fillet", "4oz", { protein: 25, satFat: 2, cholesterol: 62, calories: 233, sodium: 60 }),
  item("Egg", "1 large", { protein: 6, cholesterol: 186, satFat: 1.6, calories: 78, sodium: 62 }),
  item("Greek yogurt, plain", "1 cup", { protein: 20, sugar: 7, calories: 130, sodium: 65 }),
  item("Cheddar cheese", "1oz slice", { sodium: 180, satFat: 6, cholesterol: 30, calories: 115, protein: 7 }),
  item("Bacon", "2 slices", { sodium: 270, satFat: 3.3, cholesterol: 22, calories: 90 }),
  item("Potato chips", "1oz bag", { sodium: 170, satFat: 1, calories: 150 }),
  item("Pretzels", "1oz", { sodium: 390, calories: 110 }),
  item("Frozen pizza slice", "1/6 pizza", { sodium: 640, satFat: 5, calories: 285, cholesterol: 25 }),
  item("Instant ramen", "1 packet", { sodium: 1560, satFat: 3, calories: 380 }),
  item("Chicken noodle soup, canned", "1 cup", { sodium: 890, calories: 70, protein: 4 }),
  item("Fast food cheeseburger", "1 sandwich", { sodium: 990, satFat: 12, protein: 25, calories: 540, cholesterol: 90 }),
  item("French fries", "1 medium order", { sodium: 350, satFat: 3.5, calories: 365 }),
  item("Almonds", "1oz (~23 nuts)", { fiber: 3.5, protein: 6, satFat: 1, calories: 164 }),
  item("Black beans, cooked", "1 cup", { fiber: 15, protein: 15, sodium: 2, calories: 227 }),
  item("Broccoli, cooked", "1 cup", { fiber: 5, calories: 55, sodium: 64 }),
  item("Oatmeal, plain", "1 cup cooked", { fiber: 4, protein: 6, calories: 166, sodium: 9 }),
  item("Protein bar", "1 bar", { protein: 20, sugar: 9, fiber: 10, calories: 200, sodium: 200 }),
  item("Table salt", "1 tsp", { sodium: 2300 }),
  item("Soy sauce", "1 tbsp", { sodium: 900 }),
];

const norm = (s) => s.toLowerCase().trim();

export function findMatches(query, limit = 6) {
  const q = norm(query);
  if (!q) return [];
  return FOOD_DB.filter((f) => norm(f.name).includes(q)).slice(0, limit);
}

export function findExact(query) {
  const q = norm(query);
  return FOOD_DB.find((f) => norm(f.name) === q) || null;
}
