'use client';

import React from 'react';
import { X, ShieldCheck, Compass, Ruler, Droplets, Mountain, Sparkles } from 'lucide-react';

interface DevTakiBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevTakiBlueprintModal: React.FC<DevTakiBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-cyan-600/60 rounded-xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                WATER HERITAGE SURVEY: W-14 / DEV-01
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                YADAVA / KOLI PERIOD (12TH CENTURY CE)
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-cyan-100">
              देवटाके — Subterranean Rock-Cut Cistern Section
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Dev Taki (Sacred Spring Cistern) • Monolithic Pillared Cold Water Aquifer • 450,000 Liters
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CAD Blueprint SVG */}
        <div className="bg-stone-950 border border-stone-800 rounded-lg p-4 mb-6 flex flex-col items-center">
          <div className="w-full flex justify-between items-center text-xs font-mono text-stone-400 mb-2 px-1">
            <span className="flex items-center gap-1 text-cyan-400">
              <Droplets className="w-4 h-4" /> CROSS-SECTION: VERTICAL HYDROLOGICAL SCHEMATIC
            </span>
            <span>CAPACITY: 450,000 L</span>
            <span>ELEVATION: 1,304 m MSL</span>
          </div>

          <svg
            viewBox="0 0 760 360"
            className="w-full h-auto max-h-[340px] bg-[#07131d] rounded border border-cyan-900/40 font-mono select-none"
          >
            {/* Engineering Grid */}
            <defs>
              <pattern id="takiGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e2a3f" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <rect width="760" height="360" fill="url(#takiGrid)" />

            {/* Plateau Surface Ground Line */}
            <path
              d="M 20,70 L 220,70 L 260,110 L 320,110 L 360,70 L 740,70"
              fill="none"
              stroke="#78716c"
              strokeWidth="3"
            />
            <text x="50" y="55" fill="#a8a29e" fontSize="10">PLATEAU SURFACE (1,310m MSL)</text>
            <text x="245" y="95" fill="#38bdf8" fontSize="9">STONE STEPS DESCENT</text>

            {/* Living Basalt Rock Mass */}
            <rect x="20" y="72" width="200" height="268" fill="#1c1917" opacity="0.6" />
            <rect x="540" y="72" width="200" height="268" fill="#1c1917" opacity="0.6" />
            <text x="60" y="160" fill="#78716c" fontSize="11" fontWeight="bold">LIVING BASALT</text>
            <text x="60" y="175" fill="#57534e" fontSize="9">Dense Sahyadri Trap</text>

            {/* Excavated Subterranean Cavern */}
            <rect x="220" y="110" width="320" height="230" fill="url(#waterGrad)" stroke="#38bdf8" strokeWidth="2" />

            {/* Monolithic Living Rock Pillars */}
            <rect x="300" y="110" width="45" height="230" fill="#292524" stroke="#78716c" strokeWidth="1.5" />
            <text x="308" y="215" fill="#d6d3d1" fontSize="9" transform="rotate(90,308,215)">ROCK PILLAR 1</text>

            <rect x="420" y="110" width="45" height="230" fill="#292524" stroke="#78716c" strokeWidth="1.5" />
            <text x="428" y="215" fill="#d6d3d1" fontSize="9" transform="rotate(90,428,215)">ROCK PILLAR 2</text>

            {/* Natural Spring Aquifer Inflow */}
            <path d="M 540,240 Q 510,245 490,260" fill="none" stroke="#67e8f9" strokeWidth="2" strokeDasharray="3 3" />
            <text x="500" y="225" fill="#a5f3fc" fontSize="9">NATURAL SPRING VEIN</text>
            <text x="500" y="238" fill="#38bdf8" fontSize="8">Constant 16°C Water</text>

            {/* Water Dimension Labels */}
            <line x1="220" y1="350" x2="540" y2="350" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="340" y="345" fill="#bae6fd" fontSize="10" fontWeight="bold">LENGTH: 14.00m</text>

            <line x1="550" y1="110" x2="550" y2="340" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="560" y="230" fill="#bae6fd" fontSize="10" fontWeight="bold">DEPTH: 6.80m</text>
          </svg>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-2">
              <Ruler className="w-4 h-4" /> PHYSICAL CAPACITY
            </div>
            <ul className="text-xs text-stone-300 space-y-1 font-mono">
              <li>Length: <strong className="text-cyan-200">14.00 m</strong></li>
              <li>Width: <strong className="text-cyan-200">9.50 m</strong></li>
              <li>Depth to Basin: <strong className="text-cyan-200">6.80 m</strong></li>
              <li>Water Volume: <strong className="text-cyan-200">~450,000 Liters</strong></li>
              <li>Monolithic Pillars: <strong className="text-cyan-200">2 Living Basalt Columns</strong></li>
              <li>Water Temperature: <strong className="text-cyan-200">16°C – 18°C (Perennial)</strong></li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-4 h-4" /> HYDROLOGICAL GENIUS
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Natural mineral water filtered through deep basalt joints</li>
              <li>• Pillared cavern roof prevents solar evaporation</li>
              <li>• Remained crystal clear and potable for 900+ years</li>
              <li>• Key water lifeline during prolonged imperial sieges</li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-2">
              <Mountain className="w-4 h-4" /> HISTORIC SIGNIFICANCE
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Carved nearly a millennium ago during the Yadava and Koli chieftain eras, Dev Taki demonstrates how medieval Maratha fortifications prioritized self-contained rainwater harvesting and groundwater cisterns to sustain long garrisons during multi-year sieges.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-800 pt-3">
          <span>Source: Maharashtra State Water Heritage Survey & Kimaya Architects (2017) Sheet W-14</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-stone-900 font-semibold text-xs transition-colors"
          >
            Close Survey
          </button>
        </div>
      </div>
    </div>
  );
};
