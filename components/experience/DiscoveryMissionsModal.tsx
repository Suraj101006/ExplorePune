'use client';

import React from 'react';
import { X, Flag, CheckCircle2, ChevronRight, Play, Trophy, Sparkles } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import { getPlaceBySlug } from '@/lib/experience/selectors';
import { ambientAudio } from '@/lib/experience/ambientAudio';
import { UserExplorationProfile } from '@/lib/experience/achievements';

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
    id: 'fort-explorer',
    code: 'MSN-01',
    titleEn: 'Fort Explorer',
    titleMr: 'दुर्ग अन्वेषक — सह्याद्री गिरिदुर्ग',
    taglineEn: 'Conquer the legendary mountain forts of Chhatrapati Shivaji Maharaj',
    taglineMr: 'छत्रपती शिवाजी महाराजांच्या पराक्रमाचे साक्षीदार असणारे गिरिदुर्ग',
    descriptionEn: 'Trace the cradle and crowns of the Maratha Empire from the birthplace of Shivaji Maharaj at Shivneri to the mighty mountain citadels of Sinhagad, Rajgad, and Torna.',
    descriptionMr: 'शिवनेरीपासून ते कोंढाण्याच्या सिंहगड, राजगड आणि तोरण्यापर्यंत पसरलेली ऐतिहासिक दुर्गशृंखला.',
    badge: 'FORTS & CITADELS',
    color: '#ef4444',
    icon: '🏰',
    stopSlugs: ['sinhagad-fort', 'rajgad-fort', 'torna-fort', 'lohagad-fort', 'shivneri-fort', 'purandar-fort'],
  },
  {
    id: 'historical-pune',
    code: 'MSN-02',
    titleEn: 'Historical Pune',
    titleMr: 'ऐतिहासिक पुणे — पेशवेकालीन वैभव',
    taglineEn: 'Step into 18th-century Maratha architecture & diplomatic capitals',
    taglineMr: 'अठराव्या शतकातील मराठा साम्राज्य आणि पेशवेकालीन वास्तूंचा प्रवास',
    descriptionEn: 'Walk the cobblestone courts of Shaniwar Wada, the royal courtyard of Lal Mahal, the wooden-carved facades of Vishrambaug Wada, and the grand Aga Khan Palace.',
    descriptionMr: 'शनिवार वाड्याच्या बुलंद तटांपासून ते लाल महाल, विश्रामबाग वाडा व आगाखान पॅलेसपर्यंत.',
    badge: 'HERITAGE & WADAS',
    color: '#f59e0b',
    icon: '🏛️',
    stopSlugs: ['shaniwar-wada', 'lal-mahal', 'vishrambaug-wada', 'kesari-wada', 'shinde-chhatri', 'aga-khan-palace'],
  },
  {
    id: 'temple-trail',
    code: 'MSN-03',
    titleEn: 'Temple Trail',
    titleMr: 'तीर्थक्षेत्र पदयात्रा — संतभूमी व अष्टविनायक',
    taglineEn: 'Journey across revered sant-bhumi and legendary Ganpati abodes',
    taglineMr: 'संत ज्ञानेश्वर, संत तुकाराम व पुण्यातील जागृत देवस्थानांची यात्रा',
    descriptionEn: 'Seek blessings at the golden sanctum of Dagdusheth Halwai Ganpati, Kasba Ganpati, the samadhi of Sant Dnyaneshwar in Alandi, Tukaram Maharaj at Dehu, and the ancient Jyotirlinga at Bhimashankar.',
    descriptionMr: 'श्रीमंत दगडूशेठ, मानाचा कसबा गणपती, आळंदी, देहू, जेजुरीचा खंडोबा आणि भीमाशंकर ज्योतीर्लिंग.',
    badge: 'SPIRITUAL TRAIL',
    color: '#f97316',
    icon: '🛕',
    stopSlugs: ['shreemant-dagdusheth-halwai-ganpati', 'kasba-ganpati', 'alandi-dnyaneshwar-mandir', 'dehu-tukaram-mandir', 'jejuri-khandoba-temple', 'bhimashankar-temple'],
  },
  {
    id: 'nature-explorer',
    code: 'MSN-04',
    titleEn: 'Nature Explorer',
    titleMr: 'निसर्ग भ्रमंती — सह्याद्री जलाशय व घाट',
    taglineEn: 'Traverse cascading monsoon ghats and vast water reservoirs',
    taglineMr: 'सह्याद्रीच्या कुशीतील निसर्गरम्य जलाशय, टेकड्या आणि धबधबे',
    descriptionEn: 'Explore the Western Ghat rim where clouds kiss the waters of Khadakwasla, Panshet, Mulshi, Pawna Lake, the rainforest of Tamhini Ghat, and the windswept ridge of Vetal Tekdi.',
    descriptionMr: 'खडकवासला, पानशेत, मुळशी धरण, पवना जलाशय, ताम्हिणी घाट आणि वेताळ टेकडी.',
    badge: 'NATURE & LAKES',
    color: '#06b6d4',
    icon: '🌊',
    stopSlugs: ['khadakwasla-dam', 'panshet-dam', 'mulshi-dam', 'pawna-lake', 'tamhini-ghat', 'vetal-tekdi'],
  },
  {
    id: 'heritage-explorer',
    code: 'MSN-05',
    titleEn: 'Heritage Explorer',
    titleMr: 'वारसा अन्वेषक — प्राचीन लेणी व राजप्रासाद',
    taglineEn: 'Explore 2,000-year-old Buddhist rock-cut chaityas and ancient passes',
    taglineMr: 'दोन हजार वर्षांपूर्वीच्या चैत्य लेणी, नाणेघाट आणि ऐतिहासिक वास्तू',
    descriptionEn: 'Discover the grandest rock-cut vaulted wooden chaitya hall at Karla Caves, the historic Bhaja & Bedse monastic complexes, the ancient trade toll pass of Naneghat, and Pataleshwar.',
    descriptionMr: 'कार्ला, भाजे व बेडसे लेणी, सातवाहनकालीन नाणेघाट आणि पाताळेश्वर गुहा मंदिर.',
    badge: 'ANCIENT CAVES',
    color: '#8b5cf6',
    icon: '🏺',
    stopSlugs: ['karla-caves', 'bhaja-caves', 'bedse-caves', 'naneghat-pass-caves', 'bhor-rajwada-palace', 'pataleshwar-cave-temple'],
  },
  {
    id: 'pune-district-explorer',
    code: 'MSN-06',
    titleEn: 'Pune District Explorer',
    titleMr: 'पुणे जिल्हा प्रदक्षिणा — महामोहीम',
    taglineEn: 'Grand cross-taluka expedition connecting Pune, Haveli, Maval, Junnar & Purandar',
    taglineMr: 'पुणे शहर, हवेली, मावळ, जुन्नर, पुरंदर आणि बारामती जोडणारी महामोहीम',
    descriptionEn: 'The definitive district tour: embark from Shaniwar Wada in Pune City, climb Sinhagad in Haveli, traverse Lohagad in Maval, reach Shivneri in Junnar, pray at Jejuri in Purandar, and explore Bhimashankar & Morgaon.',
    descriptionMr: 'पुणे जिल्ह्यातील प्रमुख तालुक्यांमधून जाणारी भव्य ७-टप्प्यांची सर्वसमावेशक मोहीम.',
    badge: 'DISTRICT ATLAS',
    color: '#10b981',
    icon: '🗺️',
    stopSlugs: ['shaniwar-wada', 'sinhagad-fort', 'lohagad-fort', 'shivneri-fort', 'jejuri-khandoba-temple', 'bhimashankar-temple', 'morgaon-mayureshwar-ganpati'],
  },
  {
    id: 'hidden-destinations',
    code: 'MSN-07',
    titleEn: 'Hidden Destinations',
    titleMr: 'अनोखी व शांत स्थळे — गुपित पुणे',
    taglineEn: 'Uncover tranquil secluded gems off the mainstream tourist radar',
    taglineMr: 'गर्दीपासून दूर असणारी शांत, निसर्गरम्य आणि गूढ पर्यटन स्थळे',
    descriptionEn: 'Escape the crowd to discover the tranquil 1st-century BCE Bedse Caves, the ancient forest spring at Baneshwar Temple in Nasrapur, the circular plateau of Malhargad, Rohida Fort, and Chavand.',
    descriptionMr: 'शांत बेडसे लेणी, बनेश्वरचे निसर्गरम्य जंगल व झरे, मल्हारगड आणि रोहिडा किल्ला.',
    badge: 'OFF-THE-BEATEN-PATH',
    color: '#ec4899',
    icon: '✨',
    stopSlugs: ['bedse-caves', 'banneshwar-temple-nasrapur', 'malhargad-fort', 'rohida-fort', 'chavand-fort', 'varasgaon-dam'],
  },
];

interface DiscoveryMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMission: (mission: DiscoveryMission, stops: ExperiencePlace[]) => void;
  profile?: UserExplorationProfile;
  activeMissionId?: string | null;
  lang?: string;
}

export default function DiscoveryMissionsModal({
  isOpen,
  onClose,
  onSelectMission,
  profile,
  activeMissionId,
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
                {isMr ? 'पुणे जिल्हा शोध मोहिमा (७ मोहिमा)' : 'EXPLORE PUNE DISCOVERY MISSIONS (7 TRAILS)'}
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
        <div className="space-y-4 max-h-[62vh] overflow-y-auto custom-scrollbar pr-1">
          {DISCOVERY_MISSIONS.map((mission) => {
            const places = mission.stopSlugs
              .map((slug) => getPlaceBySlug(slug))
              .filter(Boolean) as ExperiencePlace[];

            const visitedStopsCount = mission.stopSlugs.filter(
              (slug) => profile?.visitedSlugs.includes(slug)
            ).length;
            const isCompleted =
              profile?.completedMissions.includes(mission.id) ||
              (visitedStopsCount === mission.stopSlugs.length && mission.stopSlugs.length > 0);
            const isActive = activeMissionId === mission.id;
            const progressPercent = Math.round((visitedStopsCount / mission.stopSlugs.length) * 100);

            return (
              <div
                key={mission.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all group ${
                  isActive
                    ? 'bg-emerald-950/25 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                    : isCompleted
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-black/60 text-emerald-300 border border-emerald-500/40">
                      {mission.code}
                    </span>
                    <span className="text-base">{mission.icon}</span>
                    <h4 className="font-black text-sm text-white group-hover:text-emerald-300 transition-colors">
                      {isMr ? mission.titleMr : mission.titleEn}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <Trophy size={11} />
                        <span>COMPLETED</span>
                      </span>
                    ) : isActive ? (
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>ACTIVE TRAIL</span>
                      </span>
                    ) : null}

                    <span className="text-[10px] text-white/70 font-mono bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                      {visitedStopsCount} / {places.length} STOPS
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/60 font-sans leading-relaxed mb-3">
                  {isMr ? mission.descriptionMr : mission.descriptionEn}
                </p>

                {/* Progress Bar */}
                <div className="mb-3.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-amber-400'
                          : isActive
                          ? 'bg-emerald-400'
                          : 'bg-emerald-500/70'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/50">{progressPercent}%</span>
                </div>

                {/* Waypoint Stops with Visited / Unvisited status */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  {places.map((place, idx) => {
                    const isVisited = profile?.visitedSlugs.includes(place.slug);
                    return (
                      <span
                        key={place.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] border transition-colors ${
                          isVisited
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                            : 'bg-black/60 border-white/10 text-white/70'
                        }`}
                      >
                        {isVisited ? (
                          <CheckCircle2 size={10} className="text-emerald-400" />
                        ) : (
                          <span className="text-white/40 font-bold">{idx + 1}.</span>
                        )}
                        <span className="truncate max-w-[130px]">{isMr ? place.name_mr || place.name : place.name}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleStartMission(mission)}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-98 ${
                    isActive
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : isCompleted
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-amber-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  <Play size={13} className={isActive ? 'fill-black' : isCompleted ? 'fill-white' : 'fill-black'} />
                  <span>
                    {isActive
                      ? (isMr ? 'सध्याची मोहीम सुरू ठेवा' : 'RESUME ACTIVE TRAIL')
                      : isCompleted
                      ? (isMr ? 'पुन्हा मोहीम मार्ग पहा' : 'REVISIT COMPLETED TRAIL')
                      : (isMr ? 'मोहीम सुरू करा व मार्ग आखा' : 'EMBARK ON MISSION & DRAW ROUTE')}
                  </span>
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
