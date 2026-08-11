// General adult reference guidelines, not personalized medical advice.
// Sources: FDA Nutrition Facts / Daily Values, USDA Dietary Guidelines for Americans,
// American Heart Association (AHA), and Mayo Clinic patient education materials.

export const NUTRIENTS = [
  {
    key: "caffeine", label: "Caffeine", unit: "mg", icon: "☕", color: "#B45309",
    goalType: "ceiling", max: 400,
    source: "Mayo Clinic", note: "Up to 400mg/day is considered safe for most healthy adults.",
  },
  {
    key: "sodium", label: "Sodium", unit: "mg", icon: "🧂", color: "#0EA5E9",
    goalType: "ceiling", max: 2300, idealMax: 1500,
    source: "FDA / American Heart Association", note: "FDA's general limit is 2,300mg/day; AHA notes 1,500mg is ideal for most adults.",
  },
  {
    key: "sugar", label: "Added sugar", unit: "g", icon: "🍬", color: "#DB2777",
    goalType: "ceiling", max: 36, idealMax: 25,
    source: "American Heart Association", note: "AHA suggests up to 25g/day for women, 36g/day for men. Totals here include natural sugars too (e.g. from fruit).",
  },
  {
    key: "protein", label: "Protein", unit: "g", icon: "🍗", color: "#B91C1C",
    goalType: "range", min: 50, max: 175,
    source: "USDA Dietary Guidelines", note: "General adult range from typical minimums to higher-activity intakes.",
  },
  {
    key: "fiber", label: "Fiber", unit: "g", icon: "🌾", color: "#65A30D",
    goalType: "floor", min: 25, idealMin: 38,
    source: "USDA Dietary Guidelines", note: "USDA recommends at least 25g/day (women) to 38g/day (men).",
  },
  {
    key: "calories", label: "Calories", unit: "kcal", icon: "🔥", color: "#EA580C",
    goalType: "reference", max: 2000,
    source: "FDA Nutrition Facts reference", note: "2,000 kcal is the general reference used on food labels — actual needs vary a lot by person.",
  },
  {
    key: "satFat", label: "Saturated fat", unit: "g", icon: "🧈", color: "#7C2D12",
    goalType: "ceiling", max: 13,
    source: "American Heart Association", note: "AHA recommends keeping saturated fat under ~6% of daily calories (about 13g on a 2,000-calorie diet).",
  },
  {
    key: "cholesterol", label: "Cholesterol", unit: "mg", icon: "🥚", color: "#9333EA",
    goalType: "ceiling", max: 300,
    source: "Mayo Clinic / American Heart Association", note: "No strict federal limit remains, but 300mg/day is still a common benchmark — especially with heart disease risk.",
  },
];

export function evaluateNutrient(nutrient, amount) {
  if (!amount || amount <= 0) return { status: "none", message: "Nothing logged yet." };
  const { goalType, max, min, idealMax, idealMin, unit } = nutrient;

  if (goalType === "ceiling") {
    const soft = idealMax || max;
    if (amount <= soft) return { status: "good", message: `Within the general guideline (${max}${unit} max).` };
    if (amount <= max) return { status: "watch", message: "Above the ideal range, but under the general max." };
    return { status: "over", message: `Above the general guideline of ${max}${unit}/day.` };
  }
  if (goalType === "floor") {
    const target = idealMin || min;
    if (amount >= target) return { status: "good", message: `Meeting or exceeding the recommended ${min}\u2013${idealMin || min}${unit}/day.` };
    if (amount >= min * 0.6) return { status: "watch", message: `Getting there — below the recommended ${min}${unit}/day.` };
    return { status: "under", message: `Below the recommended ${min}${unit}/day.` };
  }
  if (goalType === "range") {
    if (amount < min) return { status: "under", message: `Below the general range of ${min}\u2013${max}${unit}/day.` };
    if (amount > max) return { status: "watch", message: `Above the general range of ${min}\u2013${max}${unit}/day.` };
    return { status: "good", message: `Within the general range of ${min}\u2013${max}${unit}/day.` };
  }
  // reference (e.g. calories)
  if (amount > max * 1.15) return { status: "watch", message: `Above the ${max}${unit} reference used on nutrition labels.` };
  return { status: "good", message: `Around the ${max}${unit} reference used on nutrition labels.` };
}
