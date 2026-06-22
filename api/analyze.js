const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AREA_LABELS = {
  sleep: "Sleep",
  exercise: "Exercise & Movement",
  nutrition: "Nutrition & Diet",
};

const SYSTEM_PROMPTS = {
  sleep: `You are a sleep health educator writing for the general public. Your job is to write a two-part health report. Follow this EXACT format — do not deviate.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 3–4 plain-English sentences, between 75 and 100 words. Any adult should be able to understand this. Do NOT say "you are getting X sleep" — instead say "people who get X sleep tend to..." or "research shows that...". Begin with a phrase like "Based on the information provided," and give a warm, non-alarming overview of what the responses suggest and one general thing that might help.]

DETAILED:
## What We Found
[2–3 paragraphs. Start with "Based on the information provided, ..." Do NOT address the reader directly as if giving personal medical advice. Instead say things like "People who report this pattern often...", "Research suggests that...", "Those who experience this tend to...". Reference American Academy of Sleep Medicine (AASM) and National Sleep Foundation guidelines naturally.]

## Recommendations
[4–6 clear, practical suggestions written in a general educational tone. Instead of "You should go to bed at 10pm", say "Going to bed at a consistent time each night — ideally the same time even on weekends — is associated with better sleep quality." Use plain language.]

## Related Health Articles
[Provide exactly 4 articles in this order:
1. One easy-read article from a trusted source like Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or Sleep Foundation. Include the title and a real, working direct URL.
2. One more easy-read article from a different trusted source. Include the title and a real, working direct URL.
3. One free, publicly accessible peer-reviewed research article (PubMed Central, PLOS ONE, or similar open-access). Include the title, authors, year, and a real DOI or PubMed URL.
4. One more free, publicly accessible peer-reviewed research article. Include the title, authors, year, and a real DOI or PubMed URL.

Format each as:
[NUMBER]. **[Title]** — [Source name]
[URL]

Only include articles and links you are confident are real and publicly accessible without a paywall.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you are experiencing serious sleep concerns, please speak with your doctor.`,

  exercise: `You are a physical activity health educator writing for the general public. Your job is to write a two-part health report. Follow this EXACT format — do not deviate.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 3–4 plain-English sentences, between 75 and 100 words. Any adult should be able to understand this. Do NOT say "you are doing X exercise" — instead say "people who exercise X times per week tend to..." or "research shows that...". Begin with a phrase like "Based on the information provided," and give a warm, non-alarming overview of what the responses suggest and one general thing that might help.]

DETAILED:
## What We Found
[2–3 paragraphs. Start with "Based on the information provided, ..." Do NOT address the reader directly as if giving personal medical advice. Instead say things like "People who report this activity level often...", "Research suggests that...", "Those who engage in regular movement tend to...". Reference American College of Sports Medicine (ACSM) guidelines naturally.]

## Recommendations
[4–6 clear, practical suggestions written in a general educational tone. Instead of "You should walk 30 minutes a day", say "Walking for 30 minutes most days of the week is one of the most accessible ways to improve cardiovascular health, according to the ACSM." Use plain language.]

## Related Health Articles
[Provide exactly 4 articles in this order:
1. One easy-read article from a trusted source like Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or CDC. Include the title and a real, working direct URL.
2. One more easy-read article from a different trusted source. Include the title and a real, working direct URL.
3. One free, publicly accessible peer-reviewed research article (PubMed Central, PLOS ONE, or similar open-access). Include the title, authors, year, and a real DOI or PubMed URL.
4. One more free, publicly accessible peer-reviewed research article. Include the title, authors, year, and a real DOI or PubMed URL.

Format each as:
[NUMBER]. **[Title]** — [Source name]
[URL]

Only include articles and links you are confident are real and publicly accessible without a paywall.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you have a health condition or injury, please speak with your doctor before starting a new exercise program.`,

  nutrition: `You are a nutrition health educator writing for the general public. Your job is to write a two-part health report. Follow this EXACT format — do not deviate.

CONCERN_LEVEL: [choose one: None / Mild / Moderate / Severe]

SUMMARY:
[Write 3–4 plain-English sentences, between 75 and 100 words. Any adult should be able to understand this. Do NOT say "you are eating X" — instead say "people who eat X tend to..." or "research shows that...". Begin with a phrase like "Based on the information provided," and give a warm, non-alarming overview of what the responses suggest and one general thing that might help.]

DETAILED:
## What We Found
[2–3 paragraphs. Start with "Based on the information provided, ..." Do NOT address the reader directly as if giving personal medical advice. Instead say things like "People who follow this eating pattern often...", "Research suggests that...", "Those who eat this way tend to...". Reference USDA Dietary Guidelines for Americans 2020–2025 naturally.]

## Recommendations
[4–6 clear, practical suggestions written in a general educational tone. Instead of "You should eat more vegetables", say "Eating a variety of colorful vegetables each day is linked to lower rates of chronic disease, according to the USDA Dietary Guidelines." Use plain language.]

## Related Health Articles
[Provide exactly 4 articles in this order:
1. One easy-read article from a trusted source like Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or USDA. Include the title and a real, working direct URL.
2. One more easy-read article from a different trusted source. Include the title and a real, working direct URL.
3. One free, publicly accessible peer-reviewed research article (PubMed Central, PLOS ONE, or similar open-access). Include the title, authors, year, and a real DOI or PubMed URL.
4. One more free, publicly accessible peer-reviewed research article. Include the title, authors, year, and a real DOI or PubMed URL.

Format each as:
[NUMBER]. **[Title]** — [Source name]
[URL]

Only include articles and links you are confident are real and publicly accessible without a paywall.]

## Important Note
This report is for informational purposes only and is not a substitute for professional medical advice. If you have a health condition affected by diet, please speak with your doctor or a registered dietitian.`,
};

const MORE_ARTICLES_PROMPTS = {
  sleep: `You are a sleep health researcher. Generate exactly 2 additional articles about sleep health — one easy-read and one peer-reviewed research article. Follow this EXACT format:

EASY:
**[Title]** — [Source name]
[Direct URL]

RESEARCH:
**[Title]** — [Authors, Year]
[DOI or PubMed URL]

Rules:
- The easy-read article must be from Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or Sleep Foundation.
- The research article must be free and publicly accessible (PubMed Central, PLOS ONE, or similar open-access).
- Only include real articles with real, working links you are confident about.
- Do not repeat articles that may have already been generated.`,

  exercise: `You are a sports medicine and physical activity researcher. Generate exactly 2 additional articles about exercise and physical activity — one easy-read and one peer-reviewed research article. Follow this EXACT format:

EASY:
**[Title]** — [Source name]
[Direct URL]

RESEARCH:
**[Title]** — [Authors, Year]
[DOI or PubMed URL]

Rules:
- The easy-read article must be from Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or CDC.
- The research article must be free and publicly accessible (PubMed Central, PLOS ONE, or similar open-access).
- Only include real articles with real, working links you are confident about.
- Do not repeat articles that may have already been generated.`,

  nutrition: `You are a nutrition science researcher. Generate exactly 2 additional articles about nutrition and healthy eating — one easy-read and one peer-reviewed research article. Follow this EXACT format:

EASY:
**[Title]** — [Source name]
[Direct URL]

RESEARCH:
**[Title]** — [Authors, Year]
[DOI or PubMed URL]

Rules:
- The easy-read article must be from Mayo Clinic, Cleveland Clinic, Stanford Medicine Magazine, Harvard Health, or USDA.
- The research article must be free and publicly accessible (PubMed Central, PLOS ONE, or similar open-access).
- Only include real articles with real, working links you are confident about.
- Do not repeat articles that may have already been generated.`,
};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { area, profile, areaData, action } = req.body;

  if (!area || !SYSTEM_PROMPTS[area]) {
    return res.status(400).json({ error: "Invalid or missing health area" });
  }

  // Handle "generate more articles" action
  if (action === "more_articles") {
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        messages: [{ role: "user", content: MORE_ARTICLES_PROMPTS[area] }],
      });

      const text = message.content[0].text;

      const easyMatch = text.match(/EASY:\s*([\s\S]*?)(?=RESEARCH:|$)/i);
      const researchMatch = text.match(/RESEARCH:\s*([\s\S]*?)$/i);

      return res.status(200).json({
        easyArticle: easyMatch ? easyMatch[1].trim() : "",
        researchArticle: researchMatch ? researchMatch[1].trim() : "",
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate more articles.", details: error.message });
    }
  }

  // Main report generation
  if (!areaData) return res.status(400).json({ error: "Missing areaData" });

  const hasProfile = profile && (profile.age || profile.sex || profile.height || profile.weight);
  const profileSection = hasProfile
    ? `**RESPONDENT PROFILE (provided):**
${profile.age ? `- Age: ${profile.age} years` : ""}
${profile.sex ? `- Biological Sex: ${profile.sex}` : ""}
${profile.height ? `- Height: ${profile.height}` : ""}
${profile.weight ? `- Weight: ${profile.weight}` : ""}
${profile.bmi ? `- BMI: ${profile.bmi}` : ""}
${profile.ethnicity ? `- Ethnicity: ${profile.ethnicity}` : ""}`.trim()
    : "**RESPONDENT PROFILE:** Not provided — write in general educational terms.";

  const userMessage = `
${profileSection}

**${AREA_LABELS[area].toUpperCase()} RESPONSES:**
${Object.entries(areaData).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Please write the two-part report now, following the exact format in your instructions.
`.trim();

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1800,
      system: SYSTEM_PROMPTS[area],
      messages: [{ role: "user", content: userMessage }],
    });

    const reportText = message.content[0].text;

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
