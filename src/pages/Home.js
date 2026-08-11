import React from "react";
import { HEALTH_AREAS } from "../utils/healthAreas";

export default function Home({ onSelectArea, onOpenTracker }) {
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

        <div className="tracker-divider">or</div>
        <button className="tracker-bar" onClick={onOpenTracker} aria-label="Track your nutrients">
          <span className="tracker-bar-icon">🥤</span>
          <div className="tracker-bar-info">
            <span className="tracker-bar-title">Track your nutrients</span>
            <span className="tracker-bar-sub">Log what you ate or drank and see how it stacks up — caffeine, sodium, sugar, and more.</span>
          </div>
          <span className="tracker-bar-arrow">→</span>
        </button>
      </main>

      <footer className="home-footer">
        <p>Reports reference FDA guidelines, AHA, ATS, AASM, USDA, APA, and ACSM standards alongside peer-reviewed research.</p>
      </footer>
    </div>
  );
}
