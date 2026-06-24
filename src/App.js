import React, { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import Report from "./pages/Report";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedArea, setSelectedArea] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setScreen("input");
  };

  const handleReportReady = (data) => {
    setReportData(data);
    setScreen("report");
  };

  const handleStartOver = () => {
    setSelectedArea(null);
    setReportData(null);
    setScreen("home");
  };

  const handleBack = () => {
    setScreen("home");
    setSelectedArea(null);
  };

  return (
    <div className="app">
      {screen === "home" && <Home onSelectArea={handleSelectArea} />}
      {screen === "input" && (
        <InputForm
          area={selectedArea}
          onReportReady={handleReportReady}
          onBack={handleBack}
        />
      )}
      {screen === "report" && (
        <Report data={reportData} area={selectedArea} onStartOver={handleStartOver} />
      )}
      <Analytics />
    </div>
  );
}
