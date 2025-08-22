"use client";

import { useEffect, useState } from "react";

export default function TestAmbientPage() {
  const [motionMode, setMotionMode] = useState<string>("loading...");
  const [isToggling, setIsToggling] = useState(false);

  const checkMotionMode = () => {
    const attr = document.documentElement.getAttribute("data-motion");
    setMotionMode(attr || "not set");
  };

  const toggleMotion = async (on: boolean) => {
    setIsToggling(true);
    try {
      const response = await fetch("/api/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on }),
      });
      const data = await response.json();
      console.log("Motion toggle response:", data);

      // Reîncarcă pagina pentru a aplica schimbarea
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error toggling motion:", error);
      setIsToggling(false);
    }
  };

  useEffect(() => {
    checkMotionMode();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎮 Ambient Mode Test Page
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#5a5a5a]/30">
            <h2 className="text-xl font-bold mb-4 text-[#d1a954]">
              Current Status
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Motion Mode:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    motionMode === "off"
                      ? "bg-green-900 text-green-200"
                      : motionMode === "on"
                        ? "bg-blue-900 text-blue-200"
                        : "bg-gray-900 text-gray-200"
                  }`}
                >
                  {motionMode}
                </span>
              </p>
              <p>
                <strong>Background:</strong>{" "}
                {motionMode === "off" ? "Static Grid Only" : "Normal Mode"}
              </p>
              <p>
                <strong>Animations:</strong>{" "}
                {motionMode === "off" ? "Disabled (CSS)" : "Enabled"}
              </p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#5a5a5a]/30">
            <h2 className="text-xl font-bold mb-4 text-[#d1a954]">Controls</h2>
            <div className="space-y-3">
              <button
                onClick={() => toggleMotion(false)}
                disabled={isToggling || motionMode === "off"}
                className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-mono text-sm transition-colors"
              >
                {isToggling ? "⏳ Switching..." : "🔇 Ambient Mode (Static)"}
              </button>
              <button
                onClick={() => toggleMotion(true)}
                disabled={isToggling || motionMode === "on"}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-mono text-sm transition-colors"
              >
                {isToggling ? "⏳ Switching..." : "🌊 Normal Mode"}
              </button>
              <button
                onClick={checkMotionMode}
                className="w-full bg-[#d1a954] hover:bg-[#b8954a] text-black px-4 py-2 rounded font-mono text-sm transition-colors"
              >
                🔄 Refresh Status
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#5a5a5a]/30 mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#d1a954]">
            What You Should See
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-green-400 mb-2">
                🔇 Ambient Mode (OFF)
              </h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Minimal static grid background</li>
                <li>• Zero animations/transitions</li>
                <li>• No matrix tokens</li>
                <li>• No orange quotes</li>
                <li>• No geometric figures</li>
                <li>• Pure black stable background</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-blue-400 mb-2">
                🌊 Normal Mode (ON)
              </h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Static grid (no drift/parallax)</li>
                <li>• Subtle animations enabled</li>
                <li>• Respects prefers-reduced-motion</li>
                <li>• Industrial aesthetic preserved</li>
                <li>• Controlled visual effects</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#5a5a5a]/30">
          <h2 className="text-xl font-bold mb-4 text-[#d1a954]">
            Technical Details
          </h2>
          <div className="text-sm space-y-2 font-mono">
            <p>
              <strong>CSS Rule:</strong>{" "}
              <code>
                html[data-motion="off"] * {`{`} animation: none !important;
                transition: none !important; {`}`}
              </code>
            </p>
            <p>
              <strong>Background:</strong>{" "}
              <code>&lt;BackgroundRoot ambient /&gt;</code>
            </p>
            <p>
              <strong>API:</strong> <code>POST /api/motion</code> with{" "}
              <code>{`{"on": false}`}</code>
            </p>
            <p>
              <strong>Cookie:</strong> <code>motion=off|on</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
