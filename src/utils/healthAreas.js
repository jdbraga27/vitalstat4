export const HEALTH_AREAS = [
  {
    id: "sleep",
    label: "Sleep",
    icon: "🌙",
    tagline: "Sleep quality, duration & recovery",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
    fields: [
      {
        key: "sleepDuration",
        label: "How many hours of sleep do you usually get each night?",
        type: "select",
        options: ["Less than 5 hours", "5–6 hours", "6–7 hours", "7–8 hours", "8–9 hours", "More than 9 hours"],
      },
      {
        key: "sleepQuality",
        label: "How would you describe your sleep quality overall?",
        type: "select",
        options: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
      },
      {
        key: "timeToFallAsleep",
        label: "How long does it usually take you to fall asleep?",
        type: "select",
        options: ["Under 5 minutes", "5–15 minutes", "15–30 minutes", "30–60 minutes", "More than 60 minutes"],
      },
      {
        key: "nightWaking",
        label: "How often do you wake up during the night?",
        type: "select",
        options: ["Never", "Occasionally", "Once most nights", "2–3 times a night", "More than 3 times a night"],
      },
      {
        key: "concerns",
        label: "Do you have any sleep concerns? List them or write None.",
        type: "text",
        placeholder: "e.g. insomnia, snoring, restless legs, nightmares, or None",
      },
      {
        key: "screenTime",
        label: "How often do you use screens (phone, TV, tablet) within an hour of bedtime?",
        type: "select",
        options: ["Never", "Rarely", "A few times a week", "Most nights", "Every night"],
      },
      {
        key: "caffeine",
        label: "What time of day do you have your last coffee, tea, or energy drink?",
        type: "select",
        options: [
          "I don't drink caffeine",
          "Before noon",
          "Early afternoon (noon–2pm)",
          "Mid afternoon (2–4pm)",
          "Late afternoon or evening (after 4pm)",
        ],
      },
      {
        key: "sleepSchedule",
        label: "How consistent is your sleep schedule (going to bed and waking at the same time)?",
        type: "select",
        options: ["Very consistent", "Mostly consistent", "Somewhat inconsistent", "Very inconsistent"],
      },
    ],
  },
  {
    id: "exercise",
    label: "Exercise",
    icon: "💪",
    tagline: "Movement, strength & physical activity",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
    fields: [
      {
        key: "cardioFrequency",
        label: "How many days per week do you do cardio (walking, running, cycling, swimming, etc.)?",
        type: "select",
        options: ["None", "1 day", "2 days", "3 days", "4 days", "5 or more days"],
      },
      {
        key: "cardioType",
        label: "What kind of cardio do you usually do? Write any or None.",
        type: "text",
        placeholder: "e.g. walking, cycling, swimming, or None",
      },
      {
        key: "strengthFrequency",
        label: "How many days per week do you do strength or resistance training?",
        type: "select",
        options: ["None", "1 day", "2 days", "3 days", "4 or more days"],
      },
      {
        key: "activityLevel",
        label: "How active are you during a typical day outside of exercise?",
        type: "select",
        options: [
          "Mostly sitting (desk job, minimal walking)",
          "Light movement (some walking, standing)",
          "Moderately active (on my feet often)",
          "Very active (physical job or lots of walking)",
        ],
      },
      {
        key: "flexibility",
        label: "Do you do any stretching, yoga, or flexibility work?",
        type: "select",
        options: ["Never", "Rarely", "1–2 times a week", "3–4 times a week", "Daily"],
      },
      {
        key: "painOrLimitations",
        label: "Do you have any pain or physical limitations that affect your exercise? Write any or None.",
        type: "text",
        placeholder: "e.g. knee pain, bad back, limited mobility, or None",
      },
      {
        key: "fitnessGoal",
        label: "What is your main fitness goal?",
        type: "select",
        options: [
          "Lose weight",
          "Build muscle",
          "Improve endurance",
          "Reduce pain or stiffness",
          "Stay healthy and active",
          "Manage stress or improve mood",
          "No specific goal",
        ],
      },
    ],
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: "🥗",
    tagline: "Diet, eating habits & nutritional balance",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    fields: [
      {
        key: "dietType",
        label: "How would you best describe how you eat?",
        type: "select",
        options: [
          "I eat everything (no restrictions)",
          "Mostly plant-based",
          "Vegetarian (no meat or fish)",
          "Vegan (no animal products at all)",
          "Low carb or keto",
          "Mediterranean style",
          "I skip meals often",
          "I'm not sure / it varies a lot",
        ],
      },
      {
        key: "fruitsVegetables",
        label: "About how many servings of fruits and vegetables do you eat each day?",
        type: "select",
        options: [
          "0–1 (very little)",
          "2–3 servings",
          "4–5 servings",
          "6 or more servings",
        ],
      },
      {
        key: "processedFood",
        label: "How often do you eat fast food, packaged snacks, or frozen meals?",
        type: "select",
        options: ["Rarely or never", "Once or twice a week", "3–4 times a week", "Daily", "Most of my meals"],
      },
      {
        key: "waterIntake",
        label: "How much water do you drink each day?",
        type: "select",
        options: [
          "Less than 2 cups",
          "2–4 cups",
          "4–6 cups",
          "6–8 cups",
          "More than 8 cups",
        ],
      },
      {
        key: "supplements",
        label: "Do you take any vitamins or supplements? List them or write None.",
        type: "text",
        placeholder: "e.g. Vitamin D, Omega-3, multivitamin, or None",
      },
      {
        key: "healthConditions",
        label: "Do you have any health conditions that affect what you eat? Write any or None.",
        type: "text",
        placeholder: "e.g. diabetes, celiac disease, high cholesterol, or None",
      },
      {
        key: "energyLevels",
        label: "How are your energy levels throughout the day?",
        type: "select",
        options: [
          "I feel great all day",
          "Good, with a small afternoon dip",
          "I feel tired most of the day",
          "I crash hard after meals",
          "I feel exhausted almost always",
        ],
      },
      {
        key: "mealPattern",
        label: "How would you describe your typical eating pattern?",
        type: "select",
        options: [
          "3 regular meals a day",
          "2 meals a day",
          "I snack throughout the day instead of meals",
          "I skip breakfast",
          "I eat one large meal a day",
          "It varies a lot day to day",
        ],
      },
    ],
  },
];

export const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
};

export const getAreaById = (id) => HEALTH_AREAS.find((a) => a.id === id);
