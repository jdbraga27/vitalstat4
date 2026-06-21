import React, { useState } from "react";
import { calculateBMI } from "../utils/healthAreas";

const ETHNICITIES = [
  "Prefer not to say",
  "White / Caucasian",
  "Hispanic / Latino",
  "Black / African American",
  "Asian / Pacific Islander",
  "South Asian",
  "Middle Eastern / North African",
  "Native American / Alaska Native",
  "Mixed / Multiracial",
  "Other",
];

export default function InputForm({ area, onReportReady, onBack }) {
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    age: "",
    sex: "",
    heightCm: "",
    heightFt: "",
    heightIn: "",
    weightKg: "",
    weightLbs: "",
    ethnicity: "",
  });

  const [areaData, setAreaData] = useState({});

  const updateProfile = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
  const updateArea = (key, val) => setAreaData((d) => ({ ...d, [key]: val }));

  const getHeightCm = () => {
    if (heightUnit === "cm") return parseFloat(profile.heightCm);
    return parseFloat(profile.heightFt) * 30.48 + parseFloat(profile.heightIn || 0) * 2.54;
  };

  const getWeightKg = () => {
    if (weightUnit === "kg") return parseFloat(profile.weightKg);
    return parseFloat(profile.weightLbs) * 0.453592;
  };

  const getHeightDisplay = () => {
    if (heightUnit === "cm") return `${profile.heightCm} cm`;
    return `${profile.heightFt}ft ${profile.heightIn || 0}in`;
  };

  const getWeightDisplay = () => {
    if (weightUnit === "kg") return `${profile.weightKg} kg`;
    return `${profile.weightLbs} lbs`;
  };

  const handleSubmit = async () => {
    setError("");
    const heightCm = getHeightCm();
    const weightKg = getWeightKg();

    if (!profile.age || !profile.sex || isNaN(heightCm) || isNaN(weightKg)) {
      setError("Please fill in all required profile fields (age, sex, height, weight).");
      return;
    }

    const missingAreaFields = area.fields.filter(
      (f) => f.type !== "text" && !areaData[f.key]
    );
    if (missingAreaFields.length > 0) {
      setError(`Please answer all health questions (${missingAreaFields.length} still needed).`);
      return;
    }

    setLoading(true);

    const bmi = calculateBMI(weightKg, heightCm);
    const profilePayload = {
      age: profile.age,
      sex: profile.sex,
      height: getHeightDisplay(),
      weight: getWeightDisplay(),
      bmi,
      ethnicity: profile.ethnicity || null,
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: area.id, profile: profilePayload, areaData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      onReportReady({ ...data, profile: profilePayload });
    } catch (err) {
      setError(`Failed to generate report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="form-area-label" style={{ color: area.color }}>
          {area.icon} {area.label} Assessment
        </div>
      </div>

      <div className="form-container">
        {/* Profile Section */}
        <section className="form-section">
          <h2 className="form-section-title">Your Profile</h2>
          <p className="form-section-sub">Used to calibrate clinical thresholds to your demographics.</p>

          <div className="field-grid">
            <div className="field-group">
              <label className="field-label">Age <span className="required">*</span></label>
              <input
                type="number"
                className="field-input"
                placeholder="e.g. 35"
                min="1"
                max="120"
                value={profile.age}
                onChange={(e) => updateProfile("age", e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Biological Sex <span className="required">*</span></label>
              <select
                className="field-input"
                value={profile.sex}
                onChange={(e) => updateProfile("sex", e.target.value)}
              >
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Intersex</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">
              Height <span className="required">*</span>
              <span className="unit-toggle">
                <button className={`unit-btn ${heightUnit === "cm" ? "active" : ""}`} onClick={() => setHeightUnit("cm")} type="button">cm</button>
                <button className={`unit-btn ${heightUnit === "ft" ? "active" : ""}`} onClick={() => setHeightUnit("ft")} type="button">ft/in</button>
              </span>
            </label>
            {heightUnit === "cm" ? (
              <input type="number" className="field-input" placeholder="e.g. 175" value={profile.heightCm} onChange={(e) => updateProfile("heightCm", e.target.value)} />
            ) : (
              <div className="dual-input">
                <input type="number" className="field-input" placeholder="ft" value={profile.heightFt} onChange={(e) => updateProfile("heightFt", e.target.value)} />
                <input type="number" className="field-input" placeholder="in" value={profile.heightIn} onChange={(e) => updateProfile("heightIn", e.target.value)} />
              </div>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">
              Weight <span className="required">*</span>
              <span className="unit-toggle">
                <button className={`unit-btn ${weightUnit === "kg" ? "active" : ""}`} onClick={() => setWeightUnit("kg")} type="button">kg</button>
                <button className={`unit-btn ${weightUnit === "lbs" ? "active" : ""}`} onClick={() => setWeightUnit("lbs")} type="button">lbs</button>
              </span>
            </label>
            {weightUnit === "kg" ? (
              <input type="number" className="field-input" placeholder="e.g. 75" value={profile.weightKg} onChange={(e) => updateProfile("weightKg", e.target.value)} />
            ) : (
              <input type="number" className="field-input" placeholder="e.g. 165" value={profile.weightLbs} onChange={(e) => updateProfile("weightLbs", e.target.value)} />
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Ethnicity <span className="optional">(optional)</span></label>
            <select className="field-input" value={profile.ethnicity} onChange={(e) => updateProfile("ethnicity", e.target.value)}>
              <option value="">Select or skip...</option>
              {ETHNICITIES.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
        </section>

        {/* Area-Specific Section */}
        <section className="form-section" style={{ borderTopColor: area.color }}>
          <h2 className="form-section-title" style={{ color: area.color }}>
            {area.icon} {area.label} Questions
          </h2>
          <p className="form-section-sub">Answer as accurately as possible for a more useful report.</p>

          {area.fields.map((field) => (
            <div key={field.key} className="field-group">
              <label className="field-label">{field.label}</label>
              {field.type === "select" ? (
                <select className="field-input" value={areaData[field.key] || ""} onChange={(e) => updateArea(field.key, e.target.value)}>
                  <option value="">Select...</option>
                  {field.options.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="field-input"
                  placeholder={field.placeholder}
                  value={areaData[field.key] || ""}
                  onChange={(e) => updateArea(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </section>

        {error && (
          <div className="form-error">
            <span>⚠</span> {error}
          </div>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: loading ? "#94A3B8" : area.color }}
        >
          {loading ? (
            <span className="loading-state">
              <span className="spinner" />
              Generating your report…
            </span>
          ) : (
            "Generate my report →"
          )}
        </button>

        <p className="form-disclaimer">
          This tool is for informational purposes only and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
