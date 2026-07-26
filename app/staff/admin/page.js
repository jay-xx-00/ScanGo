"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_CONFIG = {
  baselineRandomPct: 15,
  flagScoreThreshold: 72,
  weightVarianceTolerance: 50,
  autoEscalateHighRisk: true,
};

export default function AdminPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved

  function handleChange(key, value) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveStatus("saving");
    // TODO: save to Firestore config document
    await new Promise((r) => setTimeout(r, 800));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  return (
    <main className="flex-grow pt-24 pb-32 px-container-margin max-w-2xl mx-auto w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/5 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-container-margin">
        <div>
          <span className="font-bold text-primary text-[18px]">ScanGo</span>
          <span className="text-on-surface-variant text-[10px] tracking-widest uppercase ml-2">Admin Config</span>
        </div>
      </header>

      <div className="mb-8">
        <h1 className="font-headline-lg-mobile text-on-surface font-bold mb-1">Admin Settings</h1>
        <p className="font-body-md text-on-surface-variant/80">Spot-check algorithm configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Baseline Random % */}
        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <label className="font-body-md text-on-surface font-medium">Baseline Random Check %</label>
            <span className="font-price-display text-primary text-lg">{config.baselineRandomPct}%</span>
          </div>
          <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-4">Percentage of transactions randomly selected for manual review, regardless of AI score.</p>
          <input
            type="range" min="1" max="50" step="1"
            value={config.baselineRandomPct}
            onChange={(e) => handleChange("baselineRandomPct", Number(e.target.value))}
            className="w-full accent-primary"
            style={{ accentColor: "#7cd9a1" }}
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant/40 mt-1">
            <span>1%</span><span>50%</span>
          </div>
        </div>

        {/* Flag Score Threshold */}
        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <label className="font-body-md text-on-surface font-medium">Flag Score Threshold</label>
            <span className="font-price-display text-primary text-lg">{config.flagScoreThreshold}</span>
          </div>
          <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-4">AI confidence score (0–100) above which a transaction is auto-flagged for review.</p>
          <input
            type="range" min="50" max="99" step="1"
            value={config.flagScoreThreshold}
            onChange={(e) => handleChange("flagScoreThreshold", Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "#7cd9a1" }}
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant/40 mt-1">
            <span>50 (Sensitive)</span><span>99 (Strict)</span>
          </div>
        </div>

        {/* Weight Variance Tolerance */}
        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <label className="font-body-md text-on-surface font-medium">Weight Variance Tolerance</label>
            <span className="font-price-display text-primary text-lg">{config.weightVarianceTolerance}g</span>
          </div>
          <p className="font-label-sm text-on-surface-variant/60 text-[11px] mb-4">Maximum allowed weight difference (grams) before a variance triggers a flag.</p>
          <input
            type="range" min="10" max="500" step="10"
            value={config.weightVarianceTolerance}
            onChange={(e) => handleChange("weightVarianceTolerance", Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "#7cd9a1" }}
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant/40 mt-1">
            <span>10g</span><span>500g</span>
          </div>
        </div>

        {/* Auto-Escalate Toggle */}
        <div className="glass-card rounded-2xl p-5 bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="font-body-md text-on-surface font-medium mb-1">Auto-Escalate HIGH RISK</p>
            <p className="font-label-sm text-on-surface-variant/60 text-[11px]">When enabled, HIGH RISK flags are immediately escalated and cannot be self-cleared without a supervisor PIN.</p>
          </div>
          <button
            type="button"
            onClick={() => handleChange("autoEscalateHighRisk", !config.autoEscalateHighRisk)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${config.autoEscalateHighRisk ? "bg-primary" : "bg-surface-container-high"}`}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
              animate={{ left: config.autoEscalateHighRisk ? "calc(100% - 24px)" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Save Button */}
        <motion.button
          type="submit"
          disabled={saveStatus === "saving"}
          className="w-full h-14 rounded-2xl font-headline-md font-bold text-base flex items-center justify-center gap-2 transition-all"
          style={{
            background: saveStatus === "saved" ? "#0f7a4b" : "#7cd9a1",
            color: "#00391f",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {saveStatus === "saving" ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 rounded-full"
                style={{ borderColor: "#00391f transparent #00391f transparent" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Saving…
            </>
          ) : saveStatus === "saved" ? (
            <>
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Config Saved!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              Save Configuration
            </>
          )}
        </motion.button>
      </form>
    </main>
  );
}
