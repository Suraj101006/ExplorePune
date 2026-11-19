'use client';

import React from 'react';
import { X, ShieldCheck, Ruler, Compass, AlertCircle } from 'lucide-react';

interface PuneDarwazaBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PuneDarwazaBlueprintModal: React.FC<PuneDarwazaBlueprintModalProps> = ({
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
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED DEFENSIVE ARCHITECTURE
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                DRG W-1 &amp; S-1
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-tight">
              पुणे दरवाजा — Pune Darwaza (Northern Citadel Gateway)
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Triple-Gateway Defensive Complex with 90° Tactical Elephant-Negation Bend
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

        {/* Blueprint Vector Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="w-full text-xs font-mono text-slate-400 flex justify-between mb-2">
              <span>TACTICAL 3-GATEWAY PLAN</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> AZIMUTH 350° (TRUE NORTH)
              </span>
            </div>

            <svg viewBox="0 0 460 280" className="w-full max-h-72 select-none">
              <defs>
                <pattern id="puneGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              <rect width="460" height="280" fill="url(#puneGrid)" />

              {/* Natural Basalt Rock Outcrop Cliffs (Left & Right) */}
              <path d="M 20 20 L 140 20 L 140 180 L 180 180 L 180 260 L 20 260 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <path d="M 320 20 L 440 20 L 440 260 L 340 260 L 340 120 L 320 120 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />

              {/* Gateway 1: Outer North Gate */}
              <rect x="140" y="25" width="180" height="24" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="200" y="25" width="60" height="24" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="175" y="18" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">GATE 1 (OUTER ARCH)</text>

              {/* Flank Watch Bastion */}
              <circle cx="140" cy="35" r="28" fill="url(#gateGrad)" stroke="#475569" strokeWidth="2" />
              <circle cx="320" cy="35" r="28" fill="url(#gateGrad)" stroke="#475569" strokeWidth="2" />

              {/* S-Bend / 90° Tactical Defensive Corridor */}
              <path d="M 230 49 L 230 140 L 310 140" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
              <polygon points="315,140 305,135 305,145" fill="#f59e0b" />
              <text x="155" y="105" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">90° RIGHT-ANGLE BEND</text>
              <text x="155" y="118" fill="#fde68a" fontSize="8" fontFamily="monospace">(Negates war elephant charges)</text>

              {/* Gateway 2: Middle Gate with Devdis */}
              <rect x="290" y="125" width="24" height="70" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="290" y="145" width="24" height="30" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="320" y="155" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">GATE 2 (MIDDLE)</text>
              <text x="320" y="167" fill="#94a3b8" fontSize="8" fontFamily="monospace">+ Sentry Devdis</text>

              {/* Tactical Corridor to Gate 3 */}
              <path d="M 302 175 L 302 230 L 220 230" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
              <polygon points="215,230 225,225 225,235" fill="#f59e0b" />

              {/* Gateway 3: Inner Main Citadel Gate */}
              <rect x="180" y="218" width="24" height="60" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="180" y="230" width="24" height="35" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="75" y="245" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">GATE 3 (INNER)</text>
              <text x="75" y="257" fill="#6ee7b7" fontSize="8" fontFamily="monospace">To Plateau &amp; Daru Kothar ➔</text>
            </svg>
            <div className="w-full text-center text-xs text-slate-400 mt-2">
              Three-gate staggered defense • Total span ~38 m • Height ~8.2 m
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Ruler className="w-4 h-4 text-amber-400" /> Architectural Metrics
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-slate-500">Complex Length</dt>
                  <dd className="font-mono text-amber-300 font-bold text-sm">~38.0 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Total Width</dt>
                  <dd className="font-mono text-amber-300 font-bold text-sm">~14.5 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Portal Arch Span</dt>
                  <dd className="font-mono text-slate-200 font-semibold">3.8 m – 4.2 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Wall Thickness</dt>
                  <dd className="font-mono text-slate-200 font-semibold">1.4 m – 2.1 m</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tactical Bend</dt>
                  <dd className="font-mono text-slate-200">90° Right Angle</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gate Doors</dt>
                  <dd className="font-mono text-slate-200">Iron-Spiked Teak</dd>
                </div>
              </dl>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-600/40 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong className="text-emerald-300 block mb-1">Military Engineering Genius:</strong>
                  An attacking army breaching Gate 1 is forced into a narrow 90-degree bend between sheer basalt rock walls, leaving their unshielded right flanks exposed to sentry musket fire from the flanking bastions.
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Verified against <strong>Drawing Sheet W-1 &amp; S-1 (Kimaya Architects, 2017)</strong> and historical map <strong>GIPE-194427</strong>.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-xs md:text-sm text-slate-300 leading-relaxed">
          <h4 className="font-bold text-amber-400 mb-1.5 uppercase tracking-wide text-xs">
            Architectural Significance:
          </h4>
          Pune Darwaza served as the primary ceremonial and military entrance from the northern Haveli valley. Its three sequential gates, stone machicolations, and recessed sentry devdis represent the zenith of medieval Maratha defensive engineering.
        </div>
      </div>
    </div>
  );
};
