import React, { useEffect, useRef, useState } from "react";

// Lavender/purple palette for ALL concern levels — calm, non-alarming
const CONCERN_CONFIG = {
  None:     { label: "No Concern",       dotColor: "#A78BFA" },
  Mild:     { label: "Mild Concern",     dotColor: "#8B5CF6" },
  Moderate: { label: "Moderate Concern", dotColor: "#7C3AED" },
  Severe:   { label: "Severe Concern",   dotColor: "#5B21B6" },
};

// Pull numbered articles out of the AI's "Related Health Articles" section
function parseArticles(text) {
  const sectionMatch = text.match(/## Related Health Articles([\s\S]*?)(?=## |$)/i);
  if (!sectionMatch) return [];

  const block = sectionMatch[1];
  const entries = [];

  // Match patterns like: 1. **Title** — Source\nhttps://...
  const regex = /\d+\.\s+\*\*([^*]+)\*\*\s*[—–\-]\s*([^\n]+)\n(https?:\/\/[^\s\n]+)/gi;
  let match;
  while ((match = regex.exec(block)) !== null) {
    entries.push({
      title: match[1].trim(),
      source: match[2].trim(),
      url: match[3].trim(),
    });
  }
  return entries;
}

// Strip the articles section out of the detailed report text (rendered separately)
function stripArticlesSection(text) {
  return text.replace(/## Related Health Articles[\s\S]*?(?=## [^R]|$)/i, "").trim();
}

function inlineMd(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="report-link">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
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

function ArticleCard({ article, isEasyRead }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-card">
      <div className="article-card-type">{isEasyRead ? "📰 Easy Read" : "🔬 Research"}</div>
      <div className="article-card-title">{article.title}</div>
      <div className="article-card-source">{article.source}</div>
      <div className="article-card-url">{article.url}</div>
    </a>
  );
}

export default function Report({ data, area, onStartOver }) {
  const topRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState("");

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setArticles(parseArticles(data.report));
  }, [data.report]);

  const concern = CONCERN_CONFIG[data.concernLevel] || CONCERN_CONFIG["Mild"];
  const cleanedReport = stripArticlesSection(data.report);

  const profileParts = [
    data.profile?.age ? `Age ${data.profile.age}` : null,
    data.profile?.sex || null,
    data.profile?.height || null,
    data.profile?.weight || null,
    data.profile?.bmi ? `BMI ${data.profile.bmi}` : null,
  ].filter(Boolean);

  const handleMoreArticles = async () => {
    setLoadingMore(true);
    setMoreError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: area.id, action: "more_articles" }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed");

      const newArticles = [];

      const easyMatch = result.easyArticle?.match(/\*\*([^*]+)\*\*\s*[—–\-]\s*([^\n]+)\n(https?:\/\/[^\s\n]+)/i);
      if (easyMatch) {
        newArticles.push({ title: easyMatch[1].trim(), source: easyMatch[2].trim(), url: easyMatch[3].trim(), isEasy: true });
      }

      const researchMatch = result.researchArticle?.match(/\*\*([^*]+)\*\*\s*[—–\-]\s*([^\n]+)\n(https?:\/\/[^\s\n]+)/i);
      if (researchMatch) {
        newArticles.push({ title: researchMatch[1].trim(), source: researchMatch[2].trim(), url: researchMatch[3].trim(), isEasy: false });
      }

      if (newArticles.length === 0) throw new Error("Could not parse new articles.");
      setArticles((prev) => [...prev, ...newArticles]);
    } catch (err) {
      setMoreError("Couldn't load more articles right now — please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="report-page" ref={topRef}>

      {/* Header */}
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

        {/* Concern badge — always lavender, never red/yellow */}
        <div className="concern-badge">
          <div className="concern-dot" style={{ background: concern.dotColor }} />
          <div>
            <div className="concern-label-text">Concern Level</div>
            <div className="concern-value">{concern.label}</div>
          </div>
        </div>
      </div>

      <div className="report-body">

        {/* Summary card — no "plain-language overview" label */}
        <div className="summary-card" style={{ borderLeftColor: area.color }}>
          <div className="summary-header">
            <span className="summary-icon">📋</span>
            <span className="summary-title">Your Summary</span>
          </div>
          <p className="summary-text">{data.summary}</p>
          <button
            className="read-more-btn"
            onClick={() => setExpanded((v) => !v)}
            style={{ color: area.color, borderColor: area.color + "50" }}
          >
            {expanded ? "▲ Show less" : "▼ Read the full report"}
          </button>
        </div>

        {/* Expandable full report */}
        {expanded && (
          <div className="report-content">
            {formatDetailed(cleanedReport)}
          </div>
        )}

        {/* Articles — always shown, expandable with Load More */}
        {articles.length > 0 && (
          <div className="articles-section">
            <h3 className="articles-section-title">📚 Related Health Articles</h3>
            <p className="articles-section-sub">
              Easy-read articles first, followed by free peer-reviewed research.
            </p>

            <div className="articles-grid">
              {articles.map((article, i) => {
                // Original articles: first 2 are easy-read, next 2 are research
                // Newly loaded articles have an explicit isEasy flag
                const isEasy = "isEasy" in article ? article.isEasy : i < 2;
                return <ArticleCard key={i} article={article} isEasyRead={isEasy} />;
              })}
            </div>

            {moreError && (
              <div className="form-error" style={{ marginTop: "12px" }}>
                <span>⚠</span> {moreError}
              </div>
            )}

            <button
              className="more-articles-btn"
              onClick={handleMoreArticles}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <span className="loading-state">
                  <span className="spinner" style={{ borderTopColor: "#7C3AED", borderColor: "#DDD6FE" }} />
                  Finding more articles…
                </span>
              ) : (
                "+ Load more related articles"
              )}
            </button>
          </div>
        )}

      </div>

      {/* Footer disclaimer */}
      <div className="report-actions">
        <div className="report-disclaimer-box">
          <span className="disclaimer-icon">i</span>
          <span>This report is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</span>
        </div>
        <button className="start-over-btn" onClick={onStartOver} style={{ borderColor: area.color, color: area.color }}>
          ← Check another area
        </button>
      </div>

    </div>
  );
}
