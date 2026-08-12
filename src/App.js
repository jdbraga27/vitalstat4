import React, { useState } from "react";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import Report from "./pages/Report";
import NutrientTracker from "./pages/NutrientTracker";
import WaterTracker from "./pages/WaterTracker";
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

  const handleOpenTracker = () => setScreen("tracker");
  const handleTrackerBack = () => setScreen("home");
  const handleOpenWater = () => setScreen("water");
  const handleWaterBack = () => setScreen("home");

  return (
    <div className="app">
      {screen === "home" && <Home onSelectArea={handleSelectArea} onOpenTracker={handleOpenTracker} onOpenWater={handleOpenWater} />}
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
      {screen === "tracker" && <NutrientTracker onBack={handleTrackerBack} />}
      {screen === "water" && <WaterTracker onBack={handleWaterBack} />}
    </div>
  );
}
