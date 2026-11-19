'use client';

import React from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  X,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PUNE_ALL_LOCALITIES, PuneLocality } from '@/lib/userLocation';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface GpsPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestGps: () => void;
  onSelectFallbackLocality: (locality: PuneLocality) => void;
  permissionState: string; // 'prompt' | 'denied' | 'unsupported' | 'insecure_context'
  lang?: string;
}

export default function GpsPermissionModal({
  isOpen,
  onClose,
  onRequestGps,
  onSelectFallbackLocality,
  permissionState,
  lang = 'en',
}: GpsPermissionModalProps) {
  if (!isOpen) return null;

  const isMr = lang === 'mr';
  const isDenied = permissionState === 'denied';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border-2 border-emerald-500/40 shadow-2xl p-6 text-white font-mono overflow-hidden">
        {/* Top ambient accent glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            ambientAudio.playUiBlip(600, 0.04);
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
            {isDenied ? (
              <AlertTriangle size={24} className="text-amber-400" />
            ) : (
              <Navigation size={24} className="text-emerald-400 animate-pulse" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400">
              {isMr ? 'पुणे GPS नेव्हिगेशन' : 'PUNE OPEN-WORLD GPS'}
            </span>
            <h3 className="text-lg font-black text-white">
              {isDenied
                ? isMr
                  ? 'स्थान परवानगी अवरोधित आहे'
                  : 'Location Permission Denied'
                : isMr
                ? 'थेट GPS स्थान सक्षम करा'
                : 'Enable Live GPS Location'}
            </h3>
          </div>
        </div>

        {/* Explanation text */}
        <p className="text-xs text-white/80 leading-relaxed mb-4">
          {isDenied
            ? isMr
              ? 'तुमच्या ब्राऊझरने लोकेशन परमिशन अवरोधित केली आहे. तुमच्या सध्याच्या स्थानावरून थेट रस्ता नेव्हिगेशन मिळवण्यासाठी ब्राऊझर URL बारमधील कुलूप (Lock) आयकॉनवर क्लिक करून "Location: Allow" निवडा.'
              : 'Your browser has blocked location access. To navigate from your exact real-world position, click the padlock icon in your browser address bar and set Location to "Allow".'
            : isMr
            ? 'अस्सल पुणे पर्यटन अनुभवासाठी थेट GPS स्थान वापरा. आम्ही तुमच्या स्थानाची गोपनीयता राखतो आणि ते कधीही सर्व्हरवर साठवत नाही.'
            : 'Explore Pune with authentic live GPS navigation, road routes, travel times, and proximity discovery. Your location stays strictly on your device and is never stored.'}
        </p>

        {/* Benefits list */}
        <div className="space-y-2 mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>{isMr ? 'वास्तविक रस्ता अंतर व वेळ (ड्रायव्हिंग, सायकल, पायी)' : 'Real road distance & time (Driving, Cycling, Walking)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>{isMr ? 'किल्ले, मंदिरे व स्मारकांजवळ पोहोचताच स्वयंचलित शोध' : 'Proximity-based destination discovery & achievements'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>{isMr ? 'कधीही खोटे किंवा बनावट स्थान दाखवले जात नाही' : 'Zero fake positions — 100% verified device coordinates'}</span>
          </div>
        </div>

        {/* Action Button: Request GPS or Retry */}
        {!isDenied && (
          <button
            type="button"
            onClick={() => {
              onRequestGps();
              ambientAudio.playUiBlip(880, 0.05);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98 mb-4"
          >
            <Navigation size={15} />
            <span>{isMr ? 'GPS परवानगी द्या' : 'GRANT GPS PERMISSION'}</span>
          </button>
        )}

        {/* Fallback Section: Pick Locality */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={11} />
              <span>{isMr ? 'किंवा पुण्यातील परिसर निवडा (पर्याय)' : 'OR SELECT STARTING LOCALITY'}</span>
            </span>
            <span className="text-[9px] text-white/40">50+ Localities</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            {PUNE_ALL_LOCALITIES.slice(0, 12).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  onSelectFallbackLocality(loc);
                  ambientAudio.playUiBlip(750, 0.04);
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/5 text-left text-[10px] truncate transition-colors text-white/80 hover:text-white"
                title={isMr ? loc.nameMr : loc.nameEn}
              >
                <div className="font-bold truncate">{isMr ? loc.nameMr : loc.nameEn}</div>
                <div className="text-[9px] text-white/40 truncate">{loc.zoneEn} Pune</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
