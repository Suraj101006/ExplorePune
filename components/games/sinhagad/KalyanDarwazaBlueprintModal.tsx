'use client';

import React from 'react';
import { X, ShieldCheck, Compass, Ruler, Mountain, AlertTriangle, Layers } from 'lucide-react';

interface KalyanDarwazaBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KalyanDarwazaBlueprintModal: React.FC<KalyanDarwazaBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-amber-600/60 rounded-xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ARCHITECTURAL SURVEY SHEET: W-1 / SEC-KD
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                DOCUMENTED GROUND TRUTH
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-amber-100">
              कल्याण दरवाजा — Measured Architectural Plan & Section
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Kalyan Darwaza (Southwest Main Gateway) • Historic Portal to Kalyan Village & Torna Fort
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
            <span className="flex items-center gap-1 text-amber-400">
              <Compass className="w-4 h-4" /> ORIENTATION: SOUTHWEST (225° AZIMUTH)
            </span>
            <span>SCALE: 1:100 (1cm = 1m)</span>
            <span>ELEVATION: 1,292 m MSL</span>
          </div>

          <svg
            viewBox="0 0 760 380"
            className="w-full h-auto max-h-[360px] bg-[#0c131a] rounded border border-cyan-900/40 font-mono select-none"
          >
            {/* Engineering Grid */}
            <defs>
              <pattern id="kalyanGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#162c3d" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="760" height="380" fill="url(#kalyanGrid)" />

            {/* Cliff Scarp Contours */}
            <path
              d="M 40,340 Q 120,290 220,310 T 380,330 T 540,310 T 720,340"
              fill="none"
              stroke="#544030"
              strokeWidth="4"
              strokeDasharray="6 3"
            />
            <text x="50" y="360" fill="#a88566" fontSize="10">SHEER BASALT ESCARPMENT (DROP: 200m)</text>

            {/* Outer Flanking Bastion */}
            <circle cx="210" cy="180" r="65" fill="#1b2836" stroke="#48cae4" strokeWidth="2.5" />
            <text x="160" y="185" fill="#90e0ef" fontSize="10" fontWeight="bold">FLANKING BASTION</text>
            <text x="175" y="200" fill="#64748b" fontSize="8">Ø 13.0m Basalt Ashlar</text>

            {/* Inner Guard Court & Stepped Incline */}
            <rect x="270" y="130" width="260" height="100" fill="#132230" stroke="#0077b6" strokeWidth="2" />
            <text x="320" y="160" fill="#00b4d8" fontSize="11" fontWeight="bold">STEPPED INCLINE PASSAGE (18.0m)</text>
            <text x="345" y="175" fill="#94a3b8" fontSize="9">32° Incline • Rock-Cut Risers</text>

            {/* Stepped tread lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <line
                key={i}
                x1={290 + i * 22}
                y1="135"
                x2={290 + i * 22}
                y2="225"
                stroke="#0096c7"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            ))}

            {/* Pointed Arch Gateway Portal */}
            <rect x="520" y="110" width="40" height="140" fill="#2c3e50" stroke="#e0a96d" strokeWidth="2.5" />
            <path
              d="M 520,150 Q 540,120 560,150 L 560,210 L 520,210 Z"
              fill="#0f172a"
              stroke="#ffd166"
              strokeWidth="2"
            />
            <text x="505" y="100" fill="#ffd166" fontSize="10" fontWeight="bold">MAIN ARCHWAY</text>
            <text x="500" y="270" fill="#ffd166" fontSize="9">H: 4.80m • W: 2.80m</text>

            {/* Heavy Bastion Wall Thickness */}
            <rect x="560" y="100" width="56" height="160" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="568" y="185" fill="#bae6fd" fontSize="9" transform="rotate(90,568,185)">WALL: 2.80m</text>

            {/* Trail arrow */}
            <path d="M 120,220 L 60,250" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="40" y="275" fill="#f59e0b" fontSize="9">TRAIL TO KALYAN VILLAGE / TORNA</text>

            {/* Dimension Lines */}
            <line x1="270" y1="245" x2="530" y2="245" stroke="#ef4444" strokeWidth="1.5" />
            <text x="365" y="260" fill="#ef4444" fontSize="10" fontWeight="bold">22.00m Overall Complex</text>
          </svg>
        </div>

        {/* Architectural Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-2">
              <Ruler className="w-4 h-4" /> MEASURED DIMENSIONS
            </div>
            <ul className="text-xs text-stone-300 space-y-1 font-mono">
              <li>Overall Length: <strong className="text-amber-200">22.00 m</strong></li>
              <li>Overall Width: <strong className="text-amber-200">9.20 m</strong></li>
              <li>Portal Height: <strong className="text-amber-200">6.80 m</strong></li>
              <li>Arch Clear Height: <strong className="text-amber-200">4.80 m</strong></li>
              <li>Arch Clear Width: <strong className="text-amber-200">2.80 m</strong></li>
              <li>Wall Thickness: <strong className="text-amber-200">2.80 m</strong></li>
              <li>Stair Incline: <strong className="text-amber-200">32° slope</strong></li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-2">
              <Layers className="w-4 h-4" /> MASONRY & CONSTRUCTION
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Pointed Deccan basalt voussoir arch</li>
              <li>• Heavy dressed ashlar with lime mortar core</li>
              <li>• Rock-cut stair treads carved in native basalt</li>
              <li>• Deep devdi niches for sentry guards</li>
              <li>• Direct sightline defense over Torna pass</li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-2">
              <Mountain className="w-4 h-4" /> TACTICAL MARATHA ROLE
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Kalyan Darwaza guarded the southern ridge connecting Sinhagad to Rajgad and Torna forts. Its 32° stepped incline forced attackers to ascend in single file, completely exposed to musket and stone bombardment from the overarching flanking bastion.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-800 pt-3">
          <span>Source: Kimaya Architects Completion Report (2017) & Bombay Gazetteer (1885)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold text-xs transition-colors"
          >
            Close Survey
          </button>
        </div>
      </div>
    </div>
  );
};
