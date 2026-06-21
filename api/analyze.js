const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS = {
  sleep: `You are a sleep medicine physician. Your job is to write a two-part health report based on the patient's sleep data. Follow this EXACT format — do not deviate from it.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 1–3 plain-English sentences, under 50 words total, that any adult can understand. No jargon. Say what the main takeaway is and one thing they should do. If no profile was provided, write generic but still helpful advice.]

DETAILED:
## What We Found
[2–3 paragraphs explaining the patient's sleep patterns in plain language, referencing American Academy of Sleep Medicine (AASM) guidelines and National Sleep Foundation recommendations. If profile info was provided, personalize it. If not, keep it general but useful.]

## What You Can Do
[A clear list of 4–6 specific, actionable recommendations. Use plain language. Include timing details like "go to bed at the same time each night" or "avoid screens 60 minutes before sleep".]

## What the Research Says
[Reference 2 real peer-reviewed studies by full title and year. Then recommend this article for easy reading: "How Quality Sleep Impacts Your Lifespan" by Mayo Clinic Press (https://mcpress.mayoclinic.org/healthy-aging/how-quality-sleep-impacts-your-lifespan/). Format these as a numbered list.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you are experiencing serious sleep problems, please speak with your doctor.`,

  exercise: `You are a sports medicine physician and certified strength & conditioning specialist. Your job is to write a two-part health report based on the patient's exercise and movement data. Follow this EXACT format — do not deviate from it.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 1–3 plain-English sentences, under 50 words total, that any adult can understand. No jargon. Say what the main takeaway is and one thing they should do. If no profile was provided, write generic but still helpful advice.]

DETAILED:
## What We Found
[2–3 paragraphs explaining the patient's activity and movement patterns in plain language, referencing American College of Sports Medicine (ACSM) guidelines. If profile info was provided, personalize it. If not, keep it general but useful.]

## What You Can Do
[A clear list of 4–6 specific, actionable recommendations. Use plain language. Include specifics like "aim for 30 minutes of brisk walking, 5 days a week" or "try two strength sessions per week using bodyweight exercises".]

## What the Research Says
[Reference 2 real peer-reviewed studies by full title and year. Then recommend one plain-language article from a trusted source like Mayo Clinic or the CDC on exercise and health. Format these as a numbered list.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you have pain, injury, or a medical condition, please speak with your doctor before starting a new exercise program.`,

  nutrition: `You are a registered dietitian and nutrition scientist. Your job is to write a two-part health report based on the patient's diet and nutrition data. Follow this EXACT format — do not deviate from it.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 1–3 plain-English sentences, under 50 words total, that any adult can understand. No jargon. Say what the main takeaway is and one thing they should do. If no profile was provided, write generic but still helpful advice.]

DETAILED:
## What We Found
[2–3 paragraphs explaining the patient's dietary patterns in plain language, referencing USDA Dietary Guidelines for Americans 2020–2025. If profile info was provided, personalize it. If not, keep it general but useful.]

## What You Can Do
[A clear list of 4–6 specific, actionable recommendations. Use plain language. Include specifics like "add one serving of leafy greens per day" or "swap white bread for whole grain to increase fiber".]

## What the Research Says
[Reference 2 real peer-reviewed studies by full title and year. Then recommend one plain-language article from a trusted source like Mayo Clinic or the USDA on healthy eating. Format these as a numbered list.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you have a health condition affected by diet, please speak with your doctor or a registered dietitian.`,
};

const AREA_LABELS = {
  sleep: "Sleep",
  exercise: "Exercise & Movement",
  nutrition: "Nutrition & Diet",
};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { area, profile, areaData } = req.body;

  if (!area || !areaData) return res.status(400).json({ error: "Missing required fields" });
  if (!SYSTEM_PROMPTS[area]) return res.status(400).json({ error: "Invalid health area" });

  // Build profile section — fully optional
  const hasProfile = profile && (profile.age || profile.sex || profile.height || profile.weight);
  const profileSection = hasProfile
    ? `
**PATIENT PROFILE (provided):**
${profile.age ? `- Age: ${profile.age} years` : ""}
${profile.sex ? `- Biological Sex: ${profile.sex}` : ""}
${profile.height ? `- Height: ${profile.height}` : ""}
${profile.weight ? `- Weight: ${profile.weight}` : ""}
${profile.bmi ? `- BMI: ${profile.bmi}` : ""}
${profile.ethnicity ? `- Ethnicity: ${profile.ethnicity}` : ""}
    `.trim()
    : "**PATIENT PROFILE:** Not provided — please give general but helpful advice.";

  const userMessage = `
${profileSection}

**${AREA_LABELS[area].toUpperCase()} RESPONSES:**
${Object.entries(areaData)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

Please write the two-part report now, following the exact format in your instructions.
  `.trim();

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[area],
      messages: [{ role: "user", content: userMessage }],
    });

    const reportText = message.content[0].text;

    // Parse concern level and split summary vs detailed
    const concernMatch = reportText.match(/CONCERN_LEVEL:\s*(None|Mild|Moderate|Severe)/i);
    const concernLevel = concernMatch ? concernMatch[1] : "Mild";

    const summaryMatch = reportText.match(/SUMMARY:\s*([\s\S]*?)(?=DETAILED:|$)/i);
    const detailedMatch = reportText.match(/DETAILED:\s*([\s\S]*?)$/i);

    const summary = summaryMatch ? summaryMatch[1].trim() : "";
    const detailed = detailedMatch ? detailedMatch[1].trim() : reportText;

    res.status(200).json({
      report: detailed,
      summary,
      concernLevel,
      area,
      areaLabel: AREA_LABELS[area],
    });
  } catch (error) {
    console.error("Anthropic API error:", error);
    res.status(500).json({
      error: "Failed to generate report. Please check your API key and try again.",
      details: error.message,
    });
  }
};
