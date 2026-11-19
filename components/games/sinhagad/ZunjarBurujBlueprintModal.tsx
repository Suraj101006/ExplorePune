'use client';

import React from 'react';
import { X, ShieldCheck, Compass, Ruler, Mountain, Flag, Camera } from 'lucide-react';

interface ZunjarBurujBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZunjarBurujBlueprintModal: React.FC<ZunjarBurujBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-orange-600/60 rounded-xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                ARCHITECTURAL SURVEY SHEET: W-1 / SEC-ZB
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED WITH DRONE RECON (FRAMES 15-18)
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-orange-100">
              झुंजार बुरुज — Measured Plan & Ridge Cross-Section
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Zunjar Buruj (Eastern Bulwark & Prow Bastion) • Strategic Bulwark Overlooking Purandar
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
            <span className="flex items-center gap-1 text-orange-400">
              <Compass className="w-4 h-4" /> ORIENTATION: EAST (95° AZIMUTH)
            </span>
            <span>SCALE: 1:150</span>
            <span>ELEVATION: 1,280 m MSL</span>
          </div>

          <svg
            viewBox="0 0 760 360"
            className="w-full h-auto max-h-[340px] bg-[#0d1620] rounded border border-cyan-900/40 font-mono select-none"
          >
            {/* Engineering Grid */}
            <defs>
              <pattern id="zunjarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#162e42" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="760" height="360" fill="url(#zunjarGrid)" />

            {/* Precipice Drop Labels */}
            <text x="80" y="50" fill="#f87171" fontSize="10" fontWeight="bold">NORTH FLANK PRECIPICE (DROP: 250m)</text>
            <text x="80" y="325" fill="#f87171" fontSize="10" fontWeight="bold">SOUTH FLANK PRECIPICE (DROP: 280m)</text>

            {/* Razor Ridge Bottleneck Approach */}
            <path
              d="M 40,110 L 220,135 L 420,140 L 520,120 L 640,150 L 680,180 L 640,210 L 520,240 L 420,220 L 220,225 L 40,250 Z"
              fill="#1b2a3a"
              stroke="#0284c7"
              strokeWidth="2.5"
            />

            {/* Stepped Ramparts */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={100 + i * 70}
                y1={120 + i * 4}
                x2={100 + i * 70}
                y2={240 - i * 4}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            ))}
            <text x="140" y="185" fill="#bae6fd" fontSize="10">DESCENDING STEPPED RAMPARTS (32m)</text>

            {/* Terminal Prow Bastion (Dressed Basalt) */}
            <path
              d="M 520,120 L 640,145 L 680,180 L 640,215 L 520,240 Z"
              fill="#334155"
              stroke="#ea580c"
              strokeWidth="3"
            />
            <text x="540" y="175" fill="#fed7aa" fontSize="11" fontWeight="bold">PROW BASTION</text>
            <text x="545" y="195" fill="#fdba74" fontSize="9">Height: 14.20m</text>

            {/* Cannon Embrasures */}
            <circle cx="635" cy="145" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="678" cy="180" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="635" cy="215" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <text x="690" y="175" fill="#fde047" fontSize="8">3 Cannon Embrasures</text>

            {/* Saffron Flag at Apex */}
            <line x1="680" y1="180" x2="680" y2="120" stroke="#f97316" strokeWidth="2" />
            <polygon points="680,120 715,132 680,144" fill="#ea580c" stroke="#f97316" strokeWidth="1" />
            <text x="685" y="115" fill="#fb923c" fontSize="9" fontWeight="bold">BHAGWA JHENDA</text>

            {/* Total Length Dimension */}
            <line x1="40" y1="280" x2="680" y2="280" stroke="#f59e0b" strokeWidth="1.8" />
            <text x="310" y="300" fill="#f59e0b" fontSize="11" fontWeight="bold">TOTAL SPUR LENGTH: 45.00m</text>
          </svg>
        </div>

        {/* Technical Data Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-orange-300 text-xs font-semibold mb-2">
              <Ruler className="w-4 h-4" /> METRIC MEASUREMENTS
            </div>
            <ul className="text-xs text-stone-300 space-y-1 font-mono">
              <li>Spur Length: <strong className="text-orange-200">45.00 m</strong></li>
              <li>Neck Width: <strong className="text-orange-200">12.00 m</strong></li>
              <li>Bastion Vertical Relief: <strong className="text-orange-200">14.20 m</strong></li>
              <li>Curtain Wall Thickness: <strong className="text-orange-200">2.20 m</strong></li>
              <li>Platform Surface: <strong className="text-orange-200">540.00 m²</strong></li>
              <li>Cannon Embrasures: <strong className="text-orange-200">3 Verified Ports</strong></li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-orange-300 text-xs font-semibold mb-2">
              <Camera className="w-4 h-4" /> DRONE GROUND-TRUTH
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Drone Frame 15: Razor ridge approach wall</li>
              <li>• Drone Frame 16: Two-sided sheer drop abyss</li>
              <li>• Drone Frame 17: Bhagwa Jhenda & ashlar paving</li>
              <li>• Drone Frame 18: Full aerial spur perspective</li>
              <li>• Confirms no modern concrete alters the prow</li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-orange-300 text-xs font-semibold mb-2">
              <Flag className="w-4 h-4" /> MILITARY FUNCTION
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Meaning "The Stubborn Fighter", Zunjar Buruj was built to completely deny any flanking access from the eastern Purandar ridgeline. With sheer drops on both sides, a single small squad of Maratha musketeers could hold off an entire army battalion.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-800 pt-3">
          <span>Source: Kimaya Architects 2017 Survey Sheet W-1 & 4K Drone Photogrammetry</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-stone-900 font-semibold text-xs transition-colors"
          >
            Close Survey
          </button>
        </div>
      </div>
    </div>
  );
};
