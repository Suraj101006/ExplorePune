'use client';

import React from 'react';
import { X, ShieldCheck, Compass, Ruler, Mountain, Sparkles } from 'lucide-react';

interface KondhaneshwarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KondhaneshwarModal: React.FC<KondhaneshwarModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-emerald-600/60 rounded-xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                HERITAGE TEMPLE SURVEY: STR-TMPL-01
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                YADAVA DYNASTY (~11TH CENTURY CE)
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-emerald-100">
              कौंडिण्येश्वर (कोंढाणेश्वर) मंदिर — Hemadpanthi Architecture
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Kaundinyeshwar Temple • Primeval Shiva Sanctum • Historical Origin of "Kondhana" Fort
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
            <span className="flex items-center gap-1 text-emerald-400">
              <Compass className="w-4 h-4" /> PLAN: EAST-FACING SANCTUM (90° AZIMUTH)
            </span>
            <span>STYLE: HEMADPANTHI MORTARLESS</span>
            <span>ELEVATION: 1,312 m MSL</span>
          </div>

          <svg
            viewBox="0 0 760 360"
            className="w-full h-auto max-h-[340px] bg-[#0c1a12] rounded border border-emerald-900/40 font-mono select-none"
          >
            {/* Grid */}
            <defs>
              <pattern id="tmplGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#123321" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="760" height="360" fill="url(#tmplGrid)" />

            {/* Outer Temple Plinth */}
            <rect x="100" y="70" width="560" height="220" fill="#142c1e" stroke="#10b981" strokeWidth="2.5" />
            <text x="120" y="95" fill="#6ee7b7" fontSize="11" fontWeight="bold">HEMADPANTHI TEMPLE PLINTH (11.20m x 7.40m)</text>

            {/* Garbhagriha (Sanctum) */}
            <rect x="130" y="110" width="160" height="150" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <text x="145" y="135" fill="#a7f3d0" fontSize="10" fontWeight="bold">GARBHAGRIHA (SANCTUM)</text>
            <text x="155" y="150" fill="#6ee7b7" fontSize="9">3.80m x 3.80m</text>

            {/* Shivling & Yoni Peeth */}
            <circle cx="210" cy="190" r="24" fill="#047857" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="210" cy="190" r="10" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
            <text x="175" y="235" fill="#ecfdf5" fontSize="9" fontWeight="bold">SUBTERRANEAN SHIVLING</text>

            {/* Antarala (Vestibule) */}
            <rect x="290" y="140" width="70" height="90" fill="#0f3d28" stroke="#059669" strokeWidth="1.5" />
            <text x="295" y="190" fill="#a7f3d0" fontSize="9">ANTARALA</text>

            {/* Sabha Mandapa (Pillared Hall) */}
            <rect x="360" y="95" width="270" height="175" fill="#065f46" stroke="#10b981" strokeWidth="2" />
            <text x="420" y="125" fill="#a7f3d0" fontSize="11" fontWeight="bold">SABHA MANDAPA (PILLARED HALL)</text>
            <text x="460" y="140" fill="#6ee7b7" fontSize="9">6.50m x 6.50m</text>

            {/* Four Central Carved Basalt Columns */}
            <rect x="420" y="150" width="20" height="20" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <rect x="520" y="150" width="20" height="20" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <rect x="420" y="210" width="20" height="20" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <rect x="520" y="210" width="20" height="20" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <text x="430" y="190" fill="#d1fae5" fontSize="9">CARVED BASALT COLUMNS</text>

            {/* Nandi Mandapa / Porch Entry */}
            <circle cx="590" cy="182" r="14" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <text x="575" y="210" fill="#a7f3d0" fontSize="9">NANDI</text>

            {/* Dimension Lines */}
            <line x1="100" y1="310" x2="660" y2="310" stroke="#10b981" strokeWidth="1.5" />
            <text x="340" y="325" fill="#34d399" fontSize="10" fontWeight="bold">11.20m OVERALL LENGTH</text>
          </svg>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-2">
              <Ruler className="w-4 h-4" /> TEMPLE DIMENSIONS
            </div>
            <ul className="text-xs text-stone-300 space-y-1 font-mono">
              <li>Overall Length: <strong className="text-emerald-200">11.20 m</strong></li>
              <li>Overall Width: <strong className="text-emerald-200">7.40 m</strong></li>
              <li>Sanctum (Garbhagriha): <strong className="text-emerald-200">3.80 m × 3.80 m</strong></li>
              <li>Sabha Mandapa: <strong className="text-emerald-200">6.50 m × 6.50 m</strong></li>
              <li>Wall Thickness: <strong className="text-emerald-200">0.90 m Interlocking Basalt</strong></li>
              <li>Spire Height: <strong className="text-emerald-200">5.80 m</strong></li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-4 h-4" /> HEMADPANTHI MASONRY
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Dry-fit mortarless tenon-and-mortise basalt joints</li>
              <li>• Heavy black basalt ashlar quarried on the plateau</li>
              <li>• Ornate geometric friezes and floral column mouldings</li>
              <li>• Pre-dates Islamic and Maratha fortifications</li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-2">
              <Mountain className="w-4 h-4" /> ETYMOLOGY & ORIGIN
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Dedicated to Sage Kaundinya and Lord Shiva, this shrine is the origin of the fort's ancient name <strong>Kondhana</strong>. It stood as a sacred pilgrimage center for Sahyadri herdsmen and ascetics for centuries before the hill was ever fortified as a military citadel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-800 pt-3">
          <span>Source: Bombay Gazetteer (1885) & Directorate of Archaeology, Maharashtra</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-900 font-semibold text-xs transition-colors"
          >
            Close Survey
          </button>
        </div>
      </div>
    </div>
  );
};
