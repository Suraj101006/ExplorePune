'use client';

import React from 'react';
import { X, ShieldCheck, Ruler, BookOpen, AlertTriangle } from 'lucide-react';

interface DaruKotharBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DaruKotharBlueprintModal: React.FC<DaruKotharBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl text-slate-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ARCHITECTURAL SURVEY
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                DRG W-4 &amp; W-10
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight">
              दारू कोठार — Daru Kothar (Gunpowder Magazine)
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Survey Documentation: Kimaya Architects (2017) for Department of Archaeology and Museums, Government of Maharashtra
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dossier"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Measured Survey Blueprint Vector Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* SVG Architectural Floor Plan */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="w-full text-xs font-mono text-slate-400 flex justify-between mb-2">
              <span>TOP-DOWN MEASURED FLOOR PLAN</span>
              <span className="text-amber-400 font-bold">1 : 50 METRIC SCALE</span>
            </div>

            <svg viewBox="0 0 460 260" className="w-full max-h-64 select-none">
              <defs>
                <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="vaultRib" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#92400e" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              <rect width="460" height="260" fill="url(#gridPattern)" />

              {/* Outer Basalt Wall (8.50m x 3.77m = 340px x 150.8px) */}
              <rect x="60" y="55" width="340" height="150" fill="#334155" stroke="#64748b" strokeWidth="3" rx="2" />

              {/* Inner Chamber (6.90m x 2.17m = 276px x 86.8px, Wall thickness = 32px ~ 0.80m) */}
              <rect x="92" y="87" width="276" height="86" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />

              {/* Four Vaulted Ceiling Structural Ribs */}
              <line x1="147" y1="87" x2="147" y2="173" stroke="url(#vaultRib)" strokeWidth="6" strokeDasharray="3 2" />
              <line x1="202" y1="87" x2="202" y2="173" stroke="url(#vaultRib)" strokeWidth="6" strokeDasharray="3 2" />
              <line x1="257" y1="87" x2="257" y2="173" stroke="url(#vaultRib)" strokeWidth="6" strokeDasharray="3 2" />
              <line x1="312" y1="87" x2="312" y2="173" stroke="url(#vaultRib)" strokeWidth="6" strokeDasharray="3 2" />

              {/* Original Western Doorway (Left Opening) */}
              <rect x="58" y="112" width="36" height="36" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
              <text x="35" y="105" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">WEST ENTRANCE</text>
              <text x="38" y="117" fill="#6ee7b7" fontSize="8" fontFamily="monospace">(Original 1750 CE)</text>

              {/* Later Non-Original Fireplace / Smoke Vent (North Wall Niche) */}
              <rect x="220" y="52" width="20" height="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
              <text x="210" y="42" fill="#f87171" fontSize="8" fontFamily="monospace" fontWeight="bold">LATER FIREPLACE</text>

              {/* Dimension Annotations */}
              {/* Length 8.50 m */}
              <line x1="60" y1="225" x2="400" y2="225" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <text x="205" y="240" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">8.50 m (Length)</text>

              {/* Width 3.77 m */}
              <line x1="420" y1="55" x2="420" y2="205" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="425" y="135" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(90, 425, 135)">3.77 m (Width)</text>

              {/* Wall Thickness 0.80 m */}
              <text x="96" y="78" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Wall: 0.80 m Basalt</text>

              {/* Rib Labels */}
              <text x="143" y="190" fill="#d97706" fontSize="8" fontFamily="monospace">Rib 1</text>
              <text x="198" y="190" fill="#d97706" fontSize="8" fontFamily="monospace">Rib 2</text>
              <text x="253" y="190" fill="#d97706" fontSize="8" fontFamily="monospace">Rib 3</text>
              <text x="308" y="190" fill="#d97706" fontSize="8" fontFamily="monospace">Rib 4</text>
            </svg>
            <div className="w-full text-center text-xs text-slate-400 mt-2">
              Interior: 6.90 m × 2.17 m • Floor Area: ~32.04 m² • Pointed Barrel Vault
            </div>
          </div>

          {/* Key Architectural & Survey Data */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Ruler className="w-4 h-4 text-amber-400" /> Survey Measurement Registry
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-slate-500">Outer Footprint</dt>
                  <dd className="font-mono text-amber-300 font-bold text-sm">8.50 m × 3.77 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Arch Crown Height</dt>
                  <dd className="font-mono text-amber-300 font-bold text-sm">4.55 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Wall Thickness</dt>
                  <dd className="font-mono text-slate-200 font-semibold">0.80 m (80 cm)</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Total Floor Area</dt>
                  <dd className="font-mono text-slate-200 font-semibold">32.04 m²</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Ceiling Architecture</dt>
                  <dd className="font-mono text-slate-200">Pointed Vault (4 Ribs)</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Primary Material</dt>
                  <dd className="font-mono text-slate-200">Coursed Deccan Basalt</dd>
                </div>
              </dl>
            </div>

            {/* Critical Historical Evidence Alert */}
            <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300 block mb-1">Non-Original Alterations Clarification:</strong>
                  The fireplace niche and smoke vent visible in the northern masonry were constructed during late 19th-century colonial adaptation and must not be confused with the 18th-century Maratha bomb-proof ammunition store.
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Referenced Drawing: <strong>Sheet W-4 &amp; W-10 (Kimaya Architects, 2017)</strong>. Verified against State Archaeology monument survey.
              </span>
            </div>
          </div>
        </div>

        {/* Historical Context Narrative */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          <h4 className="font-bold text-amber-400 mb-1.5 uppercase tracking-wide text-xs">
            Historical &amp; Military Engineering Context:
          </h4>
          Built during the Peshwa administration between 1750 and 1780 CE, Daru Kothar was intentionally situated away from the outer fortification perimeter to protect explosive black powder stocks from hostile artillery bombardment. Its massive 0.80-meter basalt walls and four reinforced ribs provided bomb-proof protection against incoming mortar fire during sieges.
        </div>
      </div>
    </div>
  );
};
