import React, { useEffect, useRef, useState } from "react";

const CONCERN_CONFIG = {
  None: { label: "No Concern", color: "#10B981", bg: "#ECFDF5", border: "#6EE7B7" },
  Mild: { label: "Mild Concern", color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
  Moderate: { label: "Moderate Concern", color: "#F97316", bg: "#FFF7ED", border: "#FDBA74" },
  Severe: { label: "Severe Concern", color: "#EF4444", bg: "#FFF5F5", border: "#FCA5A5" },
};

function inlineMd(text) {
  // Convert markdown links to real anchor tags
  let result = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="report-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return result;
}

function formatDetailed(text) {
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
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(
        <div key={key++} className="report-numbered">
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
        </div>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.replace(/^[-•] /, "");
      elements.push(
        <div key={key++} className="report-bullet">
          <span className="bullet-dot">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(content) }} />
        </div>
      );
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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const concern = CONCERN_CONFIG[data.concernLevel] || CONCERN_CONFIG["Mild"];

  // Build profile summary line only with what was provided
  const profileParts = [
    data.profile?.age ? `Age ${data.profile.age}` : null,
    data.profile?.sex || null,
    data.profile?.height || null,
    data.profile?.weight || null,
    data.profile?.bmi ? `BMI ${data.profile.bmi}` : null,
  ].filter(Boolean);

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
          {profileParts.length > 0 && (
            <div className="report-profile-summary">{profileParts.join(" · ")}</div>
          )}
        </div>

        {/* Concern Badge */}
        <div
          className="concern-badge"
          style={{ background: concern.bg, borderColor: concern.border }}
        >
          <div className="concern-dot" style={{ background: concern.color }} />
          <div>
            <div className="concern-label-text">Concern Level</div>
            <div className="concern-value" style={{ color: concern.color }}>{concern.label}</div>
          </div>
        </div>
      </div>

      <div className="report-body">

        {/* Summary Card */}
        <div className="summary-card" style={{ borderLeftColor: area.color }}>
          <div className="summary-header">
            <span className="summary-icon">📋</span>
            <span className="summary-title">Your Summary</span>
            <span className="summary-note">Plain-language overview</span>
          </div>
          <p className="summary-text">{data.summary}</p>

          {/* Read More Toggle */}
          <button
            className="read-more-btn"
            onClick={() => setExpanded((v) => !v)}
            style={{ color: area.color, borderColor: area.color + "40" }}
          >
            {expanded ? "▲ Show less" : "▼ Read the full report"}
          </button>
        </div>

        {/* Detailed Report — expandable */}
        {expanded && (
          <div className="report-content">
            {formatDetailed(data.report)}
          </div>
        )}

      </div>

      <div className="report-actions">
        <div className="report-disclaimer-box">
          <span className="disclaimer-icon">i</span>
          <span>This report is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</span>
        </div>
        <button
          className="start-over-btn"
          onClick={onStartOver}
          style={{ borderColor: area.color, color: area.color }}
        >
          ← Check another area
        </button>
      </div>
    </div>
  );
}
