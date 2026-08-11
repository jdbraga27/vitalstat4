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

let itemIdCounter = 0;

export default function NutrientTracker({ onBack }) {
  const [step, setStep] = useState("setup");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [period, setPeriod] = useState("day");
  const [days, setDays] = useState(() => Array.from({ length: 7 }, () => []));
  const [activeDay, setActiveDay] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [qtyInput, setQtyInput] = useState(1);
  const [pickedDbItem, setPickedDbItem] = useState(null);
  const [error, setError] = useState("");

  const dayCount = period === "week" ? 7 : 1;
  const suggestions = nameInput.trim().length > 1 ? findMatches(nameInput, 6) : [];

  const toggleNutrient = (key) =>
    setSelectedKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]));

  const startTracking = () => {
    if (selectedKeys.length === 0) { setError("Pick at least one nutrient to track."); return; }
    setError("");
    setStep("log");
  };

  const pickSuggestion = (it) => { setNameInput(it.name); setPickedDbItem(it); };

  const addItem = async () => {
    const name = nameInput.trim();
    if (!name) return;
    const qty = parseFloat(qtyInput) || 1;
    const matched = (pickedDbItem && pickedDbItem.name === name) ? pickedDbItem : findExact(name);
    const id = ++itemIdCounter;

    if (matched) {
      const newItem = { id, name: matched.name, servingLabel: matched.servingLabel, qty, source: "db", nutrients: scaleNutrients(matched.nutrients, qty) };
      setDays((d) => d.map((arr, i) => (i === activeDay ? [...arr, newItem] : arr)));
    } else {
      const pendingItem = { id, name, servingLabel: "serving", qty, source: "pending", nutrients: { ...EMPTY_NUTRIENTS } };
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
    setNameInput(""); setQtyInput(1); setPickedDbItem(null);
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
                <input
                  className="field-input add-item-input"
                  placeholder="What did you eat or drink?"
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setPickedDbItem(null); }}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <input
                  className="field-input qty-input"
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                  title="Servings"
                />
                <button className="tracker-cta" style={{ width: "auto", marginTop: 0, padding: "10px 20px" }} onClick={addItem}>Add</button>

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
                const pct = Math.min(100, (value / cap) * 100);
                const barColor = evalResult.status === "good" ? "#22C55E"
                  : evalResult.status === "watch" ? "#F59E0B"
                  : evalResult.status === "over" ? "#EF4444"
                  : evalResult.status === "under" ? "#94A3B8" : "#CBD5E1";
                return (
                  <div key={key} className="result-row">
                    <div className="result-row-head">
                      <span className="result-row-label" style={{ color: n.color }}>{n.icon} {n.label}</span>
                      <span className="result-row-value">{value.toFixed(1)}{n.unit}</span>
                    </div>
                    <div className="result-bar-track"><div className="result-bar-fill" style={{ width: `${pct}%`, background: barColor }} /></div>
                    <div className={`result-status status-${evalResult.status}`}>{evalResult.message}</div>
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
