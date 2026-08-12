import React, { useState } from "react";
import { NUTRIENTS, evaluateNutrient } from "../utils/nutrientGuidelines";
import { findMatches, findExact, EMPTY_NUTRIENTS } from "../utils/nutrientFoodDB";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayLabel(offset) {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return WEEKDAYS[d.getDay()];
}

function scaleNutrients(nutrients, qty) {
  const out = {};
  for (const k in EMPTY_NUTRIENTS) out[k] = (nutrients[k] || 0) * qty;
  return out;
}

function addNutrients(a, b) {
  const out = {};
  for (const k in EMPTY_NUTRIENTS) out[k] = (a[k] || 0) + (b[k] || 0);
  return out;
}

function remainingText(n, value, periodWord) {
  const { goalType, max, min, unit } = n;
  if (goalType === "ceiling") {
    const diff = max - value;
    if (diff >= 0) return `You have about ${diff.toFixed(1)}${unit} of room left ${periodWord}.`;
    return `You're about ${Math.abs(diff).toFixed(1)}${unit} over the guideline ${periodWord}.`;
  }
  if (goalType === "floor") {
    const diff = min - value;
    if (diff > 0) return `About ${diff.toFixed(1)}${unit} more would reach the daily minimum.`;
    return `You've passed the daily minimum by ${Math.abs(diff).toFixed(1)}${unit}.`;
  }
  if (goalType === "range") {
    if (value < min) return `About ${(min - value).toFixed(1)}${unit} more would reach the low end of the range.`;
    if (value > max) return `About ${(value - max).toFixed(1)}${unit} over the top of the range.`;
    return `About ${(max - value).toFixed(1)}${unit} of room left in the range ${periodWord}.`;
  }
  const diff = max - value;
  if (diff >= 0) return `About ${diff.toFixed(1)}${unit} under the ${max}${unit} reference.`;
  return `About ${Math.abs(diff).toFixed(1)}${unit} over the ${max}${unit} reference.`;
}

const SEGMENT_COLORS = ["#0D9488", "#F59E0B", "#7C3AED", "#DB2777", "#0EA5E9", "#65A30D", "#EA580C", "#9333EA"];

// Approximate real-world colors for common items, matched by keyword (checked in order).
const FOOD_COLOR_RULES = [
  [/matcha/, "#5B8C3A"],
  [/green tea/, "#8BAF4B"],
  [/black tea|\btea\b/, "#A6763F"],
  [/latte|cappuccino|americano|espresso|coffee/, "#6F4E37"],
  [/diet coke|coca-cola|\bcoke\b/, "#C1272D"],
  [/pepsi/, "#004B93"],
  [/dr pepper/, "#7B241C"],
  [/mountain dew/, "#A4C639"],
  [/sprite/, "#8BC34A"],
  [/fanta/, "#FF6F00"],
  [/monster/, "#1B5E20"],
  [/red bull/, "#274B8E"],
  [/\bwater\b/, "#4FC3F7"],
  [/orange juice/, "#FFA726"],
  [/chocolate milk/, "#5D4037"],
  [/whole milk|\bmilk\b/, "#F5F0E1"],
  [/dark chocolate|chocolate bar|chocolate/, "#3C1F1A"],
  [/white bread|wheat bread|\bbread\b/, "#DEB887"],
  [/banana/, "#FBC02D"],
  [/apple/, "#D6412D"],
  [/chicken/, "#D2A679"],
  [/salmon|fish/, "#FA8072"],
  [/\begg\b/, "#F3D67A"],
  [/greek yogurt|yogurt/, "#F5F5F0"],
  [/cheddar|cheese/, "#F0B429"],
  [/bacon/, "#A0522D"],
  [/potato chips|\bchips\b/, "#D4A017"],
  [/pretzels/, "#C68E3F"],
  [/pizza/, "#E85D28"],
  [/ramen/, "#D9B382"],
  [/chicken noodle soup|\bsoup\b/, "#C9A66B"],
  [/cheeseburger|burger/, "#8B4513"],
  [/french fries|\bfries\b/, "#E8C15C"],
  [/almonds|\bnuts?\b/, "#A1662F"],
  [/black beans|\bbeans\b/, "#3E2723"],
  [/broccoli/, "#3F8F3F"],
  [/oatmeal/, "#E8D9B5"],
  [/protein bar/, "#B08968"],
  [/\bsalt\b/, "#4E342E"],
  [/soy sauce/, "#2E1A0F"],
  [/salad|lettuce|greens|spinach|kale/, "#4CAF50"],
  [/beef|steak|taco/, "#7B3F1D"],
  [/root beer/, "#5C3A21"],
  [/ginger ale/, "#E8C468"],
  [/gatorade|powerade/, "#2E86DE"],
  [/coconut water/, "#E8F6F3"],
  [/kombucha/, "#B8860B"],
  [/sparkling water/, "#B3E5FC"],
  [/lemonade/, "#F9E24B"],
  [/apple juice/, "#D98E2B"],
  [/almond milk/, "#EFE6D8"],
  [/oat milk/, "#E6D8B8"],
  [/bagel/, "#C9A15A"],
  [/donut/, "#C98A5B"],
  [/avocado/, "#6B8E4E"],
  [/sweet potato/, "#E07A2C"],
  [/turkey/, "#C9A876"],
  [/sushi/, "#F2B6C1"],
  [/tofu/, "#F0EAD6"],
  [/peanut butter/, "#8B5A2B"],
  [/popcorn/, "#F3E5AB"],
  [/granola bar/, "#B98A4D"],
  [/ice cream/, "#FDF6EC"],
  [/burrito/, "#D9A441"],
  [/caesar salad/, "#6BA84F"],
  [/\brice\b/, "#EDE6D6"],
  [/pasta/, "#E8C97A"],
];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// For a repeated/colliding color, nudge hue and lightness so it stays in the same
// family but is visibly distinguishable from the original.
function shiftColor(hex, n) {
  const [h, s, l] = hexToHsl(hex);
  const newL = Math.min(82, Math.max(18, l + (n % 2 === 0 ? 1 : -1) * (14 + n * 6)));
  const newH = h + n * 22;
  return hslToHex(newH, Math.max(35, s), newL);
}

function getFoodColor(name) {
  const lower = name.toLowerCase();
  for (const [pattern, color] of FOOD_COLOR_RULES) {
    if (pattern.test(lower)) return color;
  }
  return SEGMENT_COLORS[hashString(lower) % SEGMENT_COLORS.length];
}

function trimNum(n) {
  return Number(n.toFixed(2)).toString();
}

// Pulls a leading numeric amount + unit out of a serving label, preferring a
// parenthetical like "(12oz)" over a leading count like "1 can".
function parseSize(label) {
  if (!label) return null;
  let m = label.match(/\(([\d.]+)\s*([a-zA-Z]+)\)/);
  if (!m) m = label.match(/([\d.]+)\s*([a-zA-Z%]+)/);
  if (!m) return null;
  return { amount: parseFloat(m[1]), unit: m[2] };
}

const SERVINGS_OPTIONS = Array.from({ length: 24 }, (_, i) => trimNum(0.25 * (i + 1)));

let itemIdCounter = 0;

export default function NutrientTracker({ onBack }) {
  const [step, setStep] = useState("setup");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [period, setPeriod] = useState("day");
  const [days, setDays] = useState(() => Array.from({ length: 7 }, () => []));
  const [activeDay, setActiveDay] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [qtyInput, setQtyInput] = useState(1);
  const [sizeInput, setSizeInput] = useState("");
  const [pickedDbItem, setPickedDbItem] = useState(null);
  const [error, setError] = useState("");

  const dayCount = period === "week" ? 7 : 1;
  const suggestions = nameInput.trim().length > 1 ? findMatches(nameInput, 10) : [];

  const matchedForSize = (pickedDbItem && pickedDbItem.name === nameInput) ? pickedDbItem : findExact(nameInput);
  const baseSizeForOptions = matchedForSize ? parseSize(matchedForSize.servingLabel) : null;
  const sizeOptions = baseSizeForOptions
    ? [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((m) => `${trimNum(baseSizeForOptions.amount * m)} ${baseSizeForOptions.unit}`)
    : [];

  const toggleNutrient = (key) =>
    setSelectedKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]));

  const startTracking = () => {
    if (selectedKeys.length === 0) { setError("Pick at least one nutrient to track."); return; }
    setError("");
    setStep("log");
  };

  const pickSuggestion = (it) => {
    setNameInput(it.name);
    setPickedDbItem(it);
    const sz = parseSize(it.servingLabel);
    setSizeInput(sz ? `${trimNum(sz.amount)} ${sz.unit}` : it.servingLabel);
  };

  const addItem = async () => {
    const name = nameInput.trim();
    if (!name) return;
    const qty = parseFloat(qtyInput) || 1;
    const matched = (pickedDbItem && pickedDbItem.name === name) ? pickedDbItem : findExact(name);
    const baseSize = matched ? parseSize(matched.servingLabel) : null;
    const sizeNum = parseFloat(sizeInput);
    const sizeScale = (baseSize && baseSize.amount && !isNaN(sizeNum) && sizeNum > 0) ? sizeNum / baseSize.amount : 1;
    const effectiveQty = qty * sizeScale;
    const sizeLabel = sizeInput.trim() || (matched ? matched.servingLabel : "serving");
    const id = ++itemIdCounter;

    // Clear the inputs right away so the form feels responsive even while an AI estimate is pending.
    setNameInput(""); setQtyInput(1); setSizeInput(""); setPickedDbItem(null);

    if (matched) {
      const newItem = { id, name: matched.name, servingLabel: sizeLabel, qty, source: "db", nutrients: scaleNutrients(matched.nutrients, effectiveQty) };
      setDays((d) => d.map((arr, i) => (i === activeDay ? [...arr, newItem] : arr)));
    } else {
      const pendingItem = { id, name, servingLabel: sizeLabel, qty, source: "pending", nutrients: { ...EMPTY_NUTRIENTS } };
      setDays((d) => d.map((arr, i) => (i === activeDay ? [...arr, pendingItem] : arr)));
      try {
        const res = await fetch("/api/estimate-nutrients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: [{ name }] }),
        });
        const data = await res.json();
        if (!res.ok || !data.estimates?.[0]) throw new Error(data.error || "Estimate failed");
        const est = data.estimates[0];
        setDays((d) => d.map((arr, i) => i === activeDay
          ? arr.map((it) => (it.id === id ? { ...it, source: "estimated", nutrients: scaleNutrients(est, qty) } : it))
          : arr));
      } catch {
        setDays((d) => d.map((arr, i) => i === activeDay
          ? arr.map((it) => (it.id === id ? { ...it, source: "error" } : it))
          : arr));
      }
    }
  };

  const removeItem = (dayIdx, id) =>
    setDays((d) => d.map((arr, i) => (i === dayIdx ? arr.filter((it) => it.id !== id) : arr)));

  const activeDays = days.slice(0, dayCount);
  const loggedDayCount = activeDays.filter((arr) => arr.length > 0).length;
  const weekTotal = activeDays.reduce(
    (acc, arr) => addNutrients(acc, arr.reduce((a, it) => addNutrients(a, it.nutrients), { ...EMPTY_NUTRIENTS })),
    { ...EMPTY_NUTRIENTS }
  );
  const perDay = period === "week"
    ? Object.fromEntries(Object.keys(EMPTY_NUTRIENTS).map((k) => [k, weekTotal[k] / Math.max(loggedDayCount, 1)]))
    : weekTotal;

  const hasAnyItems = activeDays.some((arr) => arr.length > 0);

  return (
    <div className="tracker-page">
      <div className="tracker-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="tracker-title-row">🥤 Nutrient Tracker</div>
      </div>

      <div className="tracker-container">
        {step === "setup" && (
          <div className="tracker-card">
            <div className="tracker-card-title">What do you want to check?</div>
            <div className="tracker-card-sub">Pick one or more — you can always add more later.</div>
            <div className="chip-row">
              {NUTRIENTS.map((n) => (
                <button
                  key={n.key}
                  className={`nutrient-chip ${selectedKeys.includes(n.key) ? "active" : ""}`}
                  style={selectedKeys.includes(n.key) ? { "--nutrient-color": n.color, "--nutrient-bg": n.color + "1A" } : undefined}
                  onClick={() => toggleNutrient(n.key)}
                >
                  <span>{n.icon}</span>{n.label}
                </button>
              ))}
            </div>

            <div className="period-toggle">
              <button className={`period-btn ${period === "day" ? "active" : ""}`} onClick={() => setPeriod("day")}>Today</button>
              <button className={`period-btn ${period === "week" ? "active" : ""}`} onClick={() => setPeriod("week")}>This week</button>
            </div>

            {error && <div className="form-error" style={{ marginTop: 16 }}><span>⚠</span> {error}</div>}

            <button className="tracker-cta" onClick={startTracking}>Start tracking →</button>
          </div>
        )}

        {step === "log" && (
          <>
            {period === "week" && (
              <div className="day-tabs">
                {Array.from({ length: 7 }, (_, i) => (
                  <button
                    key={i}
                    className={`day-tab ${activeDay === i ? "active" : ""} ${days[i].length ? "has-items" : ""}`}
                    onClick={() => setActiveDay(i)}
                  >
                    {dayLabel(i)}
                  </button>
                ))}
              </div>
            )}

            <div className="tracker-card">
              <div className="tracker-card-title">Add what you had</div>
              <div className="tracker-card-sub">Try "Diet Coke", "coffee", or "bag of chips" — we'll match it if we can, or estimate it if not.</div>

              <div className="add-item-row">
                <div className="add-item-field add-item-field-name">
                  <span className="add-item-field-label">Item</span>
                  <input
                    className="field-input add-item-input"
                    placeholder="What did you eat or drink?"
                    value={nameInput}
                    onChange={(e) => { setNameInput(e.target.value); setPickedDbItem(null); }}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                  />
                  {suggestions.length > 0 && (
                    <div className="suggestion-list">
                      {suggestions.map((s) => (
                        <div key={s.name} className="suggestion-item" onClick={() => pickSuggestion(s)}>
                          <span>{s.name}</span>
                          <span className="suggestion-item-serving">{s.servingLabel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="add-item-field add-item-field-servings">
                  <span className="add-item-field-label">Servings</span>
                  <input
                    className="field-input servings-input"
                    list="servings-options"
                    value={qtyInput}
                    onChange={(e) => setQtyInput(e.target.value)}
                  />
                  <datalist id="servings-options">
                    {SERVINGS_OPTIONS.map((v) => <option key={v} value={v} />)}
                  </datalist>
                </div>

                <div className="add-item-field add-item-field-size">
                  <span className="add-item-field-label">Size</span>
                  <input
                    className="field-input size-input"
                    list="size-options"
                    placeholder="e.g. 12 oz"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                  />
                  <datalist id="size-options">
                    {sizeOptions.map((v) => <option key={v} value={v} />)}
                  </datalist>
                </div>

                <button className="tracker-cta add-item-submit" onClick={addItem}>Add</button>
              </div>

              <div className="logged-items">
                {activeDays[activeDay].map((it) => (
                  <div key={it.id} className="logged-item">
                    <span className="logged-item-name">{it.name}</span>
                    <span className="logged-item-qty">{it.qty}× {it.servingLabel}</span>
                    <span className={`logged-item-tag ${it.source}`}>
                      {it.source === "db" ? "matched" : it.source === "estimated" ? "estimated" : it.source === "pending" ? "estimating…" : "couldn't estimate"}
                    </span>
                    <button className="remove-item-btn" onClick={() => removeItem(activeDay, it.id)}>✕</button>
                  </div>
                ))}
                {activeDays[activeDay].length === 0 && (
                  <div className="results-empty">Nothing logged for {period === "week" ? dayLabel(activeDay).toLowerCase() : "today"} yet.</div>
                )}
              </div>
            </div>

            <div className="tracker-card">
              <div className="tracker-card-title">Your totals</div>
              <div className="tracker-card-sub">
                {period === "week"
                  ? `Daily average across ${loggedDayCount || 0} logged day${loggedDayCount === 1 ? "" : "s"}, compared to general daily guidelines.`
                  : "Compared to general daily guidelines."}
              </div>

              {!hasAnyItems && <div className="results-empty">Add something above to see how it stacks up.</div>}

              {hasAnyItems && selectedKeys.map((key) => {
                const n = NUTRIENTS.find((x) => x.key === key);
                const value = perDay[key] || 0;
                const evalResult = evaluateNutrient(n, value);
                const cap = n.max || n.idealMin || n.min || value || 1;

                const divisor = period === "week" ? Math.max(loggedDayCount, 1) : 1;
                const contribMap = {};
                activeDays.forEach((arr) => arr.forEach((it) => {
                  const v = it.nutrients[key] || 0;
                  if (!v) return;
                  contribMap[it.name] = (contribMap[it.name] || 0) + v;
                }));
                const usedColors = [];
                const contributions = Object.entries(contribMap)
                  .map(([name, total]) => ({ name, value: total / divisor }))
                  .sort((a, b) => b.value - a.value)
                  .map((c) => {
                    let color = getFoodColor(c.name);
                    let collision = 0;
                    while (usedColors.includes(color)) { collision++; color = shiftColor(getFoodColor(c.name), collision); }
                    usedColors.push(color);
                    return { ...c, color };
                  });

                let used = 0;
                const segments = contributions.map((c) => {
                  const rawPct = (c.value / cap) * 100;
                  const avail = Math.max(0, 100 - used);
                  const width = Math.min(rawPct, avail);
                  used += width;
                  return { ...c, width };
                }).filter((s) => s.width > 0);

                const periodWord = period === "week" ? "on an average day" : "today";

                return (
                  <div key={key} className="result-row">
                    <div className="result-row-head">
                      <span className="result-row-label" style={{ color: n.color }}>{n.icon} {n.label}</span>
                      <span className="result-row-value">{value.toFixed(1)}{n.unit}</span>
                    </div>
                    <div className="result-bar-track">
                      {segments.map((s) => (
                        <div
                          key={s.name}
                          className="result-bar-segment"
                          style={{ width: `${s.width}%`, background: s.color }}
                          title={`${s.name}: ${s.value.toFixed(1)}${n.unit}`}
                        />
                      ))}
                    </div>
                    <div className={`result-status status-${evalResult.status}`}>{evalResult.message}</div>
                    <div className="result-remaining">{remainingText(n, value, periodWord)}</div>
                    {contributions.length > 0 && (
                      <div className="result-legend">
                        {contributions.map((c) => (
                          <span key={c.name} className="result-legend-item">
                            <span className="result-legend-dot" style={{ background: c.color }} />
                            {c.name} ({c.value.toFixed(1)}{n.unit})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="tracker-sources">
                Guidelines from the FDA, USDA, and American Heart Association. Item estimates come from a small built-in food database, or an AI estimate when we don't recognize something — treat both as approximate, not lab-verified.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
