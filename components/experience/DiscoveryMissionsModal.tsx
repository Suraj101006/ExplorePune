'use client';

import React from 'react';
import { X, Flag, CheckCircle2, ChevronRight, MapPin, Compass, Play, Navigation } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { getPlaceBySlug } from '@/lib/experience/selectors';
import { ambientAudio } from '@/lib/experience/ambientAudio';

export interface DiscoveryMission {
  id: string;
  code: string;
  titleEn: string;
  titleMr: string;
  taglineEn: string;
  taglineMr: string;
  descriptionEn: string;
  descriptionMr: string;
  badge: string;
  color: string;
  icon: string;
  stopSlugs: string[];
}

export const DISCOVERY_MISSIONS: DiscoveryMission[] = [
  {
    id: 'bastions-of-swarajya',
    code: 'MSN-01',
    titleEn: 'Bastions of Swarajya',
    titleMr: 'स्वराज्याचे अभेद्य गड-किल्ले',
    taglineEn: 'Conquer the legendary mountain forts of Chhatrapati Shivaji Maharaj',
    taglineMr: 'छत्रपती शिवाजी महाराजांच्या पराक्रमाचे साक्षीदार असणारे गिरिदुर्ग',
    descriptionEn: 'Trace the cradle and crowns of the Maratha Empire from the high birth ramparts of Shivneri to the mighty citadel of Sinhagad.',
    descriptionMr: 'शिवजन्मभूमी शिवनेरीपासून ते कोंढाण्याच्या सिंहगडापर्यंत पसरलेली ऐतिहासिक दुर्गशृंखला.',
    badge: 'HISTORIC FORTS',
    color: '#ef4444',
    icon: '🏰',
    stopSlugs: ['shivneri-fort', 'lohagad-fort', 'sinhagad-fort', 'rajgad-fort', 'purandar-fort'],
  },
  {
    id: 'peshwa-royal-legacy',
    code: 'MSN-02',
    titleEn: 'Peshwa Royal Legacy',
    titleMr: 'पेशवेकालीन ऐतिहासिक वाडे',
    taglineEn: 'Step into 18th-century Maratha architecture & diplomatic nerve centers',
    taglineMr: 'अठराव्या शतकातील मराठा साम्राज्य आणि पेशवेकालीन वैभव',
    descriptionEn: 'Walk the cobblestone courts of Shaniwar Wada, the wooden carved facades of Vishrambaug, and the grand memorial of Shinde Chhatri.',
    descriptionMr: 'शनिवार वाड्याच्या बुलंद तटांपासून ते विश्रामबाग वाड्याच्या काष्ठशिल्पांपर्यंत.',
    badge: 'HERITAGE & WADAS',
    color: '#f59e0b',
    icon: '🏛️',
    stopSlugs: ['shaniwar-wada', 'lal-mahal', 'vishrambaug-wada', 'shinde-chhatri'],
  },
  {
    id: 'sacred-shrines-pune',
    code: 'MSN-03',
    titleEn: 'Sacred Shrines & Ashtavinayak',
    titleMr: 'पुण्यातील तीर्थक्षेत्रे व अष्टविनायक',
    taglineEn: 'Journey across revered sant-bhumi and legendary Ganpati abodes',
    taglineMr: 'संतभूमी आणि पुण्यातील जागृत देवस्थानांची यात्रा',
    descriptionEn: 'Seek blessings at the golden sanctum of Dagdusheth, the samadhi of Sant Dnyaneshwar in Alandi, and Tukaram Maharaj at Dehu.',
    descriptionMr: 'श्रीमंत दगडूशेठ गणपती, आळंदीची ज्ञानोबा माऊली समाधी आणि देहूचे संत तुकाराम मंदिर.',
    badge: 'SPIRITUAL PILGRIMAGE',
    color: '#f97316',
    icon: '🛕',
    stopSlugs: ['shreemant-dagdusheth-halwai-ganpati', 'alandi-dnyaneshwar-mandir', 'dehu-tukaram-mandir', 'jejuri-khandoba-temple'],
  },
  {
    id: 'sahyadri-reservoirs',
    code: 'MSN-04',
    titleEn: 'Sahyadri Lakes & Waterfalls',
    titleMr: 'सह्याद्रीचे जलस्रोत व धरणे',
    taglineEn: 'Traverse cascading monsoon ghats and vast water reservoirs',
    taglineMr: 'सह्याद्रीच्या कुशीतील निसर्गरम्य जलाशय आणि धबधबे',
    descriptionEn: 'Explore the western ghat rim where clouds kiss the waters of Khadakwasla, Panshet, Mulshi, and the mist of Tamhini.',
    descriptionMr: 'खडकवासला, पानशेत, मुळशी धरण आणि ताम्हिणी घाटातील निसर्गसौंदर्य.',
    badge: 'NATURE & LAKES',
    color: '#06b6d4',
    icon: '💧',
    stopSlugs: ['khadakwasla-dam', 'panshet-dam', 'mulshi-dam', 'pawna-lake', 'tamhini-ghat'],
  },
  {
    id: 'cultural-science-pune',
    code: 'MSN-05',
    titleEn: 'Knowledge & Cultural Wonders',
    titleMr: 'ज्ञान, विज्ञान व संस्कृती',
    taglineEn: 'From astronomical telescopes to 20,000 royal artifacts',
    taglineMr: 'खगोलशास्त्राच्या वेधशाळेपासून ते राजा दिनकर केळकर संग्रहालयापर्यंत',
    descriptionEn: 'Discover the scientific and artisanal soul of the Oxford of the East at Kelkar Museum, IUCAA Science Park, and Blades of Glory.',
    descriptionMr: 'पुण्याचे समृद्ध सांस्कृतिक संग्रहालय, आयुका सायन्स पार्क आणि ऐतिहासिक वारसा.',
    badge: 'MUSEUMS & SCIENCE',
    color: '#8b5cf6',
    icon: '🏺',
    stopSlugs: ['raja-dinkar-kelkar-museum', 'iucaa-science-park', 'blades-of-glory-cricket-museum', 'national-war-memorial'],
  },
];

interface DiscoveryMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMission: (mission: DiscoveryMission, stops: ExperiencePlace[]) => void;
  lang?: string;
}

export default function DiscoveryMissionsModal({
  isOpen,
  onClose,
  onSelectMission,
  lang = 'en',
}: DiscoveryMissionsModalProps) {
  if (!isOpen) return null;

  const isMr = lang === 'mr';

  const handleStartMission = (mission: DiscoveryMission) => {
    const places = mission.stopSlugs
      .map((slug) => getPlaceBySlug(slug))
      .filter(Boolean) as ExperiencePlace[];

    ambientAudio.playUiBlip(980, 0.08);
    onSelectMission(mission, places);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white select-none overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Explore Pune Open World Missions"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-emerald-500/40 shadow-2xl font-mono">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flag size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>OPEN WORLD EXPLORATION</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {isMr ? 'पुणे जिल्हा शोध मोहिमा' : 'EXPLORE PUNE DISCOVERY MISSIONS'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Missions Dialog"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Missions Grid */}
        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {DISCOVERY_MISSIONS.map((mission) => {
            const places = mission.stopSlugs
              .map((slug) => getPlaceBySlug(slug))
              .filter(Boolean) as ExperiencePlace[];

            return (
              <div
                key={mission.id}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {mission.code}
                    </span>
                    <span className="text-base">{mission.icon}</span>
                    <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {isMr ? mission.titleMr : mission.titleEn}
                    </h4>
                  </div>

                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/30 w-fit">
                    {places.length} WAYPOINTS
                  </span>
                </div>

                <p className="text-xs text-white/60 font-sans leading-relaxed mb-3">
                  {isMr ? mission.descriptionMr : mission.descriptionEn}
                </p>

                {/* Waypoint Stops Preview Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  {places.map((place, idx) => (
                    <span
                      key={place.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-white/80"
                    >
                      <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                      <span className="truncate max-w-[130px]">{isMr ? place.name_mr || place.name : place.name}</span>
                    </span>
                  ))}
                </div>

                {/* Embark Button */}
                <button
                  type="button"
                  onClick={() => handleStartMission(mission)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-98"
                >
                  <Play size={13} className="fill-black" />
                  <span>{isMr ? 'मोहीम सुरू करा व मार्ग आखा' : 'EMBARK ON MISSION & DRAW ROUTE'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
