const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing items" });
  }

  const prompt = `You are a nutrition data assistant. For each food or drink item described below, estimate its nutrition content as accurately as you can using standard public nutrition data (USDA FoodData Central style values) for the serving size described. If no serving size is given, assume one typical serving.

Items:
${items.map((it, i) => `${i + 1}. ${it.name}`).join("\n")}

Respond with ONLY a JSON array (no other text), one object per item, in the same order, with this exact shape:
[{"caffeine":number (mg),"sodium":number (mg),"sugar":number (g, includes natural+added),"protein":number (g),"fiber":number (g),"calories":number (kcal),"satFat":number (g, saturated fat),"cholesterol":number (mg)}]

Use 0 for any nutrient the item doesn't meaningfully contain. Give your best real-world estimate — do not refuse.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not parse nutrition estimate.");
    const parsed = JSON.parse(jsonMatch[0]);

    res.status(200).json({ estimates: parsed });
  } catch (error) {
    console.error("Nutrient estimate error:", error);
    res.status(500).json({ error: "Failed to estimate nutrients.", details: error.message });
  }
};
