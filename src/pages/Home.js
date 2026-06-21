import React from "react";
import { HEALTH_AREAS } from "../utils/healthAreas";

export default function Home({ onSelectArea }) {
  return (
    <div className="home">
      <header className="home-header">
        <div className="logo-mark">
          <span className="logo-icon">⚕</span>
          <span className="logo-text">VitalCheck</span>
        </div>
        <p className="home-tagline">
          Personalized health insights, grounded in clinical research.
          <br />
          <span className="tagline-sub">Choose a focus area to get your AI-powered report.</span>
        </p>
        <div className="disclaimer-banner">
          <span className="disclaimer-icon">i</span>
          For informational purposes only — not a substitute for professional medical advice.
        </div>
      </header>

      <main className="home-main">
        <h2 className="section-label">Choose your health focus</h2>
        <div className="area-grid">
          {HEALTH_AREAS.map((area) => (
            <button
              key={area.id}
              className="area-card"
              style={{ background: area.gradient, "--accent": area.color }}
              onClick={() => onSelectArea(area)}
              aria-label={`Analyze ${area.label}`}
            >
              <span className="area-icon">{area.icon}</span>
              <div className="area-info">
                <span className="area-name">{area.label}</span>
                <span className="area-tagline">{area.tagline}</span>
              </div>
              <span className="area-arrow" style={{ color: area.color }}>→</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="home-footer">
        <p>Reports reference FDA guidelines, AHA, ATS, AASM, USDA, APA, and ACSM standards alongside peer-reviewed research.</p>
      </footer>
    </div>
  );
}
