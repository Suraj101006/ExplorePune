'use client';

import React from 'react';
import { X, ShieldCheck, Compass, Ruler, Sword, Flame, Camera } from 'lucide-react';

interface TanajiSamadhiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TanajiSamadhiModal: React.FC<TanajiSamadhiModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-red-600/60 rounded-xl shadow-2xl p-6 text-stone-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                HISTORICAL BATTLE MEMORIAL: STR-MEM-01
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                4 FEBRUARY 1670 BATTLEGROUND
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-red-100">
              नरवीर तानाजी मालुसरे स्मारक व डोणागिरीचा कडा
            </h2>
            <p className="text-xs text-stone-400 font-mono">
              Subedar Tanaji Malusare Memorial Plinth & Donagiricha Kada (Vertical Cliff Escalade Site)
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
            <span className="flex items-center gap-1 text-red-400">
              <Sword className="w-4 h-4" /> HISTORIC NIGHT ASSAULT ELEVATION SCHEMATIC
            </span>
            <span>CLIFF DROP: 300m VERTICAL SCARP</span>
            <span>ELEVATION: 1,310 m MSL</span>
          </div>

          <svg
            viewBox="0 0 760 360"
            className="w-full h-auto max-h-[340px] bg-[#140e0c] rounded border border-red-900/40 font-mono select-none"
          >
            {/* Grid */}
            <defs>
              <pattern id="tanajiGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2b1814" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="760" height="360" fill="url(#tanajiGrid)" />

            {/* Vertical Basalt Cliff Face (Donagiricha Kada) */}
            <path
              d="M 120,40 L 160,110 L 150,190 L 180,270 L 170,350 L 30,350 L 30,40 Z"
              fill="#261b17"
              stroke="#7f1d1d"
              strokeWidth="2.5"
            />
            <text x="40" y="200" fill="#f87171" fontSize="11" fontWeight="bold" transform="rotate(-90,40,200)">
              300m VERTICAL BASALT CLIFF
            </text>

            {/* Night Escalade Rope Ladder */}
            <line x1="165" y1="110" x2="175" y2="350" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
            <text x="185" y="260" fill="#fde047" fontSize="9">NIGHT ESCALADE (1670)</text>
            <text x="185" y="275" fill="#fca5a5" fontSize="8">Ghorpad Yashwanti & Rope Ladders</text>

            {/* Bastion at Cliff Crest */}
            <rect x="150" y="90" width="90" height="30" fill="#3f2e27" stroke="#ea580c" strokeWidth="2" />
            <text x="160" y="110" fill="#fed7aa" fontSize="9" fontWeight="bold">KADA BASTION</text>

            {/* Plateau Tableland */}
            <line x1="240" y1="120" x2="720" y2="120" stroke="#78716c" strokeWidth="2" />
            <text x="260" y="105" fill="#a8a29e" fontSize="9">PLATEAU INTERIOR TRAIL</text>

            {/* Tanaji Malusare Memorial Plinth */}
            <rect x="420" y="70" width="160" height="50" fill="#451a03" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="440" y="100" fill="#fef08a" fontSize="11" fontWeight="bold">TANAJI SAMADHI PLINTH</text>
            <text x="460" y="114" fill="#fcd34d" fontSize="9">6.40m x 6.40m Base</text>

            {/* Bronze Bust Canopy */}
            <polygon points="500,20 440,70 560,70" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="500" cy="52" r="10" fill="#f59e0b" />
            <text x="465" y="40" fill="#fef08a" fontSize="9">PILLARED CANOPY</text>

            {/* Inscription Banner */}
            <rect x="360" y="170" width="280" height="55" fill="#1e1b18" stroke="#dc2626" strokeWidth="1.5" />
            <text x="375" y="195" fill="#f87171" fontSize="12" fontWeight="bold">
              "गड आला पण सिंह गेला!"
            </text>
            <text x="375" y="213" fill="#cbd5e1" fontSize="9">
              "The fort is won, but the Lion is lost!" — Shivaji Maharaj
            </text>

            {/* Dimension Lines */}
            <line x1="420" y1="135" x2="580" y2="135" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="470" y="150" fill="#f59e0b" fontSize="10" fontWeight="bold">6.40m PLINTH</text>
          </svg>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-red-300 text-xs font-semibold mb-2">
              <Ruler className="w-4 h-4" /> PLINTH SPECIFICATIONS
            </div>
            <ul className="text-xs text-stone-300 space-y-1 font-mono">
              <li>Plinth Base: <strong className="text-red-200">6.40 m × 6.40 m</strong></li>
              <li>Plinth Height: <strong className="text-red-200">1.20 m (Dressed Stone)</strong></li>
              <li>Canopy Height: <strong className="text-red-200">4.50 m</strong></li>
              <li>Statue: <strong className="text-red-200">Cast Bronze Bust & Sword</strong></li>
              <li>Original Samadhi: <strong className="text-red-200">Basalt Cenotaph Slab</strong></li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-red-300 text-xs font-semibold mb-2">
              <Camera className="w-4 h-4" /> DRONE FRAME 14 CORRELATION
            </div>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Drone Frame 14 displays "DONAGIRICHA KADA"</li>
              <li>• Semicircular bastion directly over the vertical cliff</li>
              <li>• Flight of narrow stone stairs along the bastion flank</li>
              <li>• Sheer vertical Sahyadri basalt dropping into Donje gorge</li>
            </ul>
          </div>

          <div className="bg-stone-800/60 border border-stone-700/60 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-red-300 text-xs font-semibold mb-2">
              <Flame className="w-4 h-4" /> HISTORIC BATTLE IMPACT
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              On 4 Feb 1670, Subedar Tanaji scaled this sheer cliff with 300 Mavlas, surprised the Mughal garrison under Udaybhan Rathod, and recaptured Kondhana at the cost of his own life. Upon hearing the news, Chhatrapati Shivaji Maharaj renamed the fort <strong>Sinhagad</strong> in eternal tribute.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-stone-500 font-mono border-t border-stone-800 pt-3">
          <span>Source: Sabhasad Bakhar, MTDC Historical Register & Drone Photogrammetry (Frame 14)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-stone-900 font-semibold text-xs transition-colors"
          >
            Close Survey
          </button>
        </div>
      </div>
    </div>
  );
};
