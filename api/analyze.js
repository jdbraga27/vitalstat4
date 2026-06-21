const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS = {
  lungs: `You are a board-certified pulmonologist and respiratory health expert. Analyze patient data using American Thoracic Society (ATS) and Global Initiative for Chronic Obstructive Lung Disease (GOLD) guidelines. Reference the CDC's smoking cessation research and WHO air quality standards. Always cite 2-3 real peer-reviewed studies by full title and year. Structure your report with: (1) Lung Health Score (Excellent/Good/Needs Attention/At Risk), (2) Key Findings, (3) Specific Actionable Recommendations (breathing exercises, cardio targets, cessation support if applicable), (4) Referenced Studies. Use evidence-based thresholds. Be specific with numbers. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,

  heart: `You are a board-certified cardiologist specializing in preventive cardiovascular medicine. Apply American Heart Association (AHA) and American College of Cardiology (ACC) guidelines including the 2019 ACC/AHA Primary Prevention Guidelines. Use Framingham Risk Score principles where applicable. Cite 2-3 real peer-reviewed studies by title and year. Structure: (1) Cardiovascular Health Score (Optimal/Good/Moderate Risk/High Risk), (2) Key Risk Factors Identified, (3) Specific Actionable Recommendations (BP targets, cholesterol goals, exercise prescriptions), (4) Referenced Studies. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,

  nutrition: `You are a registered dietitian and nutrition scientist. Apply USDA Dietary Guidelines for Americans 2020-2025, Institute of Medicine DRI values, and American Dietetic Association position papers. Cite 2-3 real peer-reviewed studies by title and year. Structure: (1) Nutritional Status Score (Optimal/Adequate/Some Gaps/Significant Gaps), (2) Identified Nutrient Gaps or Risks, (3) Specific Actionable Recommendations (foods with serving sizes, supplement dosages where appropriate), (4) Referenced Studies. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,

  sleep: `You are a sleep medicine physician and certified sleep scientist. Apply American Academy of Sleep Medicine (AASM) guidelines, National Sleep Foundation recommendations, and ICSD-3 diagnostic criteria. Cite 2-3 real peer-reviewed studies by title and year. Structure: (1) Sleep Health Score (Excellent/Good/Disrupted/Significantly Impaired), (2) Key Sleep Issues Identified, (3) Specific Actionable Recommendations (sleep hygiene protocol, CBT-I elements, environmental factors), (4) Referenced Studies. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,

  muscles: `You are an orthopedic sports medicine physician and certified strength & conditioning specialist (CSCS). Apply American College of Sports Medicine (ACSM) guidelines and NSCA standards. Cite 2-3 real peer-reviewed studies by title and year. Structure: (1) Musculoskeletal Health Score (Excellent/Good/Needs Attention/Rehabilitation Recommended), (2) Identified Weaknesses or Risk Areas, (3) Specific Actionable Recommendations (exercises with sets/reps/frequency, stretching protocols), (4) Referenced Studies. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,

  mental: `You are a licensed clinical psychologist and mental wellness expert. Apply American Psychological Association (APA) guidelines, DSM-5 screening thresholds, and evidence-based interventions including CBT, ACT, and mindfulness-based stress reduction (MBSR). Cite 2-3 real peer-reviewed studies by title and year. Structure: (1) Mental Wellness Score (Thriving/Good/Moderate Stress/Needs Support), (2) Key Patterns Identified, (3) Specific Actionable Recommendations (mindfulness practices, behavioral strategies, when to seek professional support), (4) Referenced Studies. Be compassionate. End with: "DISCLAIMER: This tool is for informational purposes only and is not a substitute for professional medical advice."`,
};

const AREA_LABELS = {
  lungs: "Lung Health",
  heart: "Cardiovascular Health",
  nutrition: "Nutritional Health",
  sleep: "Sleep Health",
  muscles: "Musculoskeletal Health",
  mental: "Mental Wellness",
};

module.exports = async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { area, profile, areaData } = req.body;

  if (!area || !profile || !areaData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!SYSTEM_PROMPTS[area]) {
    return res.status(400).json({ error: "Invalid health area" });
  }

  const userMessage = `
Please analyze this patient's ${AREA_LABELS[area]} based on the following data:

**PATIENT PROFILE:**
- Age: ${profile.age} years
- Biological Sex: ${profile.sex}
- Height: ${profile.height}
- Weight: ${profile.weight}
- BMI: ${profile.bmi} (calculated)
${profile.ethnicity ? `- Ethnicity: ${profile.ethnicity}` : ""}

**${AREA_LABELS[area].toUpperCase()} SPECIFIC DATA:**
${Object.entries(areaData)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

Please provide a comprehensive, personalized health report following the structured format in your instructions. Use specific numbers, clinical thresholds, and evidence-based recommendations tailored to this patient's demographics and inputs.
  `.trim();

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[area],
      messages: [{ role: "user", content: userMessage }],
    });

    const reportText = message.content[0].text;
    res.status(200).json({ report: reportText, area, areaLabel: AREA_LABELS[area] });
  } catch (error) {
    console.error("Anthropic API error:", error);
    res.status(500).json({
      error: "Failed to generate report. Please check your API key and try again.",
      details: error.message,
    });
  }
};
