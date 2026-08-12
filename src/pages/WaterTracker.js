import React, { useState } from "react";

const QUICK_ADDS = [
  { label: "Glass", amount: 8 },
  { label: "Bottle", amount: 16 },
  { label: "Large bottle", amount: 24 },
];

const DAILY_GOAL_OZ = 64;

let idCounter = 0;

export default function WaterTracker({ onBack }) {
  const [entries, setEntries] = useState([]);
  const [customAmount, setCustomAmount] = useState("");

  const addAmount = (amount) => {
    if (!amount || amount <= 0) return;
    setEntries((e) => [...e, { id: ++idCounter, amount }]);
  };

  const addCustom = () => {
    const amt = parseFloat(customAmount);
    if (!amt || amt <= 0) return;
    addAmount(amt);
    setCustomAmount("");
  };

  const removeEntry = (id) => setEntries((e) => e.filter((it) => it.id !== id));

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const pct = Math.min(100, (total / DAILY_GOAL_OZ) * 100);
  const remaining = DAILY_GOAL_OZ - total;

  return (
    <div className="water-page">
      <div className="water-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="water-title-row">💧 Water Tracker</div>
      </div>

      <div className="water-container">
        <div className="water-card">
          <div className="water-card-title">Today's water</div>
          <div className="water-card-sub">General guideline: about {DAILY_GOAL_OZ}oz (8 cups) a day. Actual needs vary by body size, activity, and climate.</div>

          <div className="water-total-row">
            <span className="water-total-value">{total}oz</span>
            <span className="water-total-goal">of {DAILY_GOAL_OZ}oz goal</span>
          </div>
          <div className="water-bar-track">
            <div className="water-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="water-remaining">
            {remaining > 0
              ? `About ${remaining}oz left to reach today's goal.`
              : `You've reached today's goal${remaining < 0 ? `, ${Math.abs(remaining)}oz over` : ""}.`}
          </div>

          <div className="water-quick-adds">
            {QUICK_ADDS.map((q) => (
              <button key={q.label} className="water-quick-btn" onClick={() => addAmount(q.amount)}>
                <span className="water-quick-icon">💧</span>
                <span>{q.label}</span>
                <span className="water-quick-amount">{q.amount}oz</span>
              </button>
            ))}
          </div>

          <div className="water-custom-row">
            <input
              className="field-input water-custom-input"
              type="number"
              min="1"
              placeholder="Custom amount (oz)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
            />
            <button className="water-add-btn" onClick={addCustom}>Add</button>
          </div>

          {entries.length > 0 && (
            <div className="water-entries">
              {entries.map((e) => (
                <div key={e.id} className="water-entry">
                  <span>💧 {e.amount}oz</span>
                  <button className="remove-item-btn" onClick={() => removeEntry(e.id)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="water-source">Guideline from Mayo Clinic's general fluid-intake recommendations. Not personalized medical advice.</div>
        </div>
      </div>
    </div>
  );
}
