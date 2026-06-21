import React, { useEffect, useRef } from "react";

const SCORE_COLORS = {
  Excellent: "#10B981",
  Good: "#10B981",
  Optimal: "#10B981",
  Thriving: "#10B981",
  Adequate: "#10B981",
  "Needs Attention": "#F59E0B",
  "Moderate Risk": "#F59E0B",
  "Moderate Stress": "#F59E0B",
  "Some Gaps": "#F59E0B",
  Disrupted: "#F59E0B",
  "At Risk": "#EF4444",
  "High Risk": "#EF4444",
  "Needs Support": "#EF4444",
  "Significant Gaps": "#EF4444",
  "Significantly Impaired": "#EF4444",
  "Rehabilitation Recommended": "#EF4444",
};

function extractScore(report) {
  for (const score of Object.keys(SCORE_COLORS)) {
    if (report.includes(score)) return score;
  }
  return null;
}

function inlineMd(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function formatReport(text) {
  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (const line of lines) {
    if (!line.trim()) {
      elements.push(<div key={key++} className="report-spacer" />);
    } else if (line.startsWith("## ")) {
      elements.push(<h3 key={key++} className="report-h2">{line.replace(/^## /, "")}</h3>);
    } else if (line.startsWith("### ") || line.match(/^\*\*[^*]+\*\*:?$/)) {
      elements.push(<h4 key={key++} className="report-h3">{line.replace(/^###? /, "").replace(/\*\*/g, "")}</h4>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.replace(/^[-•] /, "");
      elements.push(
        <div key={key++} className="report-bullet">
          <span className="bullet-dot">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(content) }} />
        </div>
      );
    } else if (line.includes("DISCLAIMER")) {
      elements.push(<div key={key++} className="report-disclaimer">{line.replace(/\*\*/g, "")}</div>);
    } else {
      elements.push(
        <p key={key++} className="report-p">
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
        </p>
      );
    }
  }
  return elements;
}

export default function Report({ data, area, onStartOver }) {
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const score = extractScore(data.report);
  const scoreColor = score ? SCORE_COLORS[score] : area.color;

  return (
    <div className="report-page" ref={topRef}>
      <div className="report-header" style={{ borderBottomColor: area.color }}>
        <div className="report-header-top">
          <div className="logo-mark small">
            <span className="logo-icon">⚕</span>
            <span className="logo-text">VitalCheck</span>
          </div>
          <button className="back-btn" onClick={onStartOver}>← Start over</button>
        </div>

        <div className="report-meta">
          <span className="report-area-badge" style={{ background: area.gradient, color: area.color }}>
            {area.icon} {data.areaLabel || area.label} Report
          </span>
          <div className="report-profile-summary">
            Age {data.profile.age} · {data.profile.sex} · {data.profile.height} · {data.profile.weight} · BMI {data.profile.bmi}
          </div>
        </div>

        {score && (
          <div className="score-badge" style={{ background: scoreColor + "18", borderColor: scoreColor + "40" }}>
            <div className="score-dot" style={{ background: scoreColor }} />
            <div>
              <div className="score-label">Health Status</div>
              <div className="score-value" style={{ color: scoreColor }}>{score}</div>
            </div>
          </div>
        )}
      </div>

      <div className="report-body">
        <div className="report-content">
          {formatReport(data.report)}
        </div>
      </div>

      <div className="report-actions">
        <div className="report-disclaimer-box">
          <span className="disclaimer-icon">i</span>
          <span>This report is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</span>
        </div>
        <button className="start-over-btn" onClick={onStartOver} style={{ borderColor: area.color, color: area.color }}>
          ← Analyze another area
        </button>
      </div>
    </div>
  );
}
