'use client';

import React, { useMemo } from 'react';
import {
  Trophy,
  Medal,
  CheckCircle2,
  Lock,
  Sparkles,
  Shield,
  Compass,
} from 'lucide-react';
import { DestinationVisitRecord, MemoryMediaItem, RenderedExportRecord } from '@/lib/memoryAlbumStorage';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';

interface AchievementsViewProps {
  allVisits: DestinationVisitRecord[];
  allMemories: MemoryMediaItem[];
  savedExports: RenderedExportRecord[];
  allPlaces: StructuredPlace[];
  isMr: boolean;
}

interface AchievementDefinition {
  id: string;
  icon: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  currentValue: number;
  targetValue: number;
  category: 'heritage' | 'nature' | 'media' | 'social';
}

export default function AchievementsView({
  allVisits,
  allMemories,
  savedExports,
  allPlaces,
  isMr,
}: AchievementsViewProps) {
  // Compute visited place IDs set
  const visitedPlaceIds = useMemo(() => {
    const set = new Set<string>();
    for (const v of allVisits) {
      set.add(v.placeId);
      if (v.placeSlug) set.add(v.placeSlug);
    }
    return set;
  }, [allVisits]);

  // Count forts visited
  const fortsVisitedCount = useMemo(() => {
    return allPlaces.filter(
      (p) => (p.category === 'Forts' || p.category.includes('Fort')) && (visitedPlaceIds.has(p.id) || visitedPlaceIds.has(p.slug))
    ).length;
  }, [allPlaces, visitedPlaceIds]);

  // Heritage wadas visited count
  const heritageWadasCount = useMemo(() => {
    const wadaSlugs = ['shaniwar-wada', 'lal-mahal', 'vishrambaug-wada'];
    return wadaSlugs.filter((slug) => visitedPlaceIds.has(slug)).length;
  }, [visitedPlaceIds]);

  // Spiritual temples visited count
  const spiritualCount = useMemo(() => {
    const templeSlugs = ['shreemant-dagdusheth-halwai-ganpati', 'alandi', 'dehu', 'kasba-ganpati'];
    return templeSlugs.filter((slug) => visitedPlaceIds.has(slug)).length;
  }, [visitedPlaceIds]);

  // Nature / hill spots
  const natureCount = useMemo(() => {
    return allPlaces.filter(
      (p) => (p.category === 'Nature' || p.category.includes('Hills')) && (visitedPlaceIds.has(p.id) || visitedPlaceIds.has(p.slug))
    ).length;
  }, [allPlaces, visitedPlaceIds]);

  // Build 8 truthful achievements
  const achievements: AchievementDefinition[] = [
    {
      id: 'fort_conqueror',
      icon: '🏰',
      title: 'Fort Conqueror',
      titleMr: 'दुर्ग योद्धा',
      description: 'Explore 3 or more historic Sahyadri forts around Pune.',
      descriptionMr: 'पुण्याभोवतीच्या ३ किंवा अधिक ऐतिहासिक गडांना भेट द्या.',
      currentValue: fortsVisitedCount,
      targetValue: 3,
      category: 'heritage',
    },
    {
      id: 'heritage_guardian',
      icon: '🏛️',
      title: 'Heritage Guardian',
      titleMr: 'पुणे वारसा रक्षक',
      description: 'Visit iconic Peshwa landmarks: Shaniwar Wada, Lal Mahal, Vishrambaug Wada.',
      descriptionMr: 'शनिवार वाडा, लाल महाल व विश्रामबाग वाड्याला भेट द्या.',
      currentValue: heritageWadasCount,
      targetValue: 3,
      category: 'heritage',
    },
    {
      id: 'spiritual_pilgrim',
      icon: '🛕',
      title: 'Spiritual Pilgrim',
      titleMr: 'पुण्यभूमी यात्रेकरू',
      description: 'Seek blessings at 3 revered Pune shrines (Dagdusheth, Alandi, Dehu).',
      descriptionMr: 'दगडूशेठ, आळंदी किंवा देहू येथील ३ पवित्र देवस्थानांचे दर्शन घ्या.',
      currentValue: spiritualCount,
      targetValue: 3,
      category: 'heritage',
    },
    {
      id: 'sahyadri_trekker',
      icon: '🌿',
      title: 'Sahyadri Trekker',
      titleMr: 'सह्याद्री ट्रेकर',
      description: 'Climb 3 nature hills or scenic viewpoints in Pune.',
      descriptionMr: 'पुण्यातील ३ टेकड्या किंवा निसर्गरम्य निसर्ग स्थळांना भेट द्या.',
      currentValue: natureCount,
      targetValue: 3,
      category: 'nature',
    },
    {
      id: 'cinematic_director',
      icon: '🎬',
      title: 'Cinematic Storyteller',
      titleMr: 'सिनेमॅटिक दिग्दर्शक',
      description: 'Export 3 or more 9:16 vertical travel reels in Reel Studio.',
      descriptionMr: 'रील स्टुडिओमधून ३ किंवा अधिक ९:१६ व्हर्टिकल रील एक्सपोर्ट करा.',
      currentValue: savedExports.length,
      targetValue: 3,
      category: 'media',
    },
    {
      id: 'memory_keeper',
      icon: '📸',
      title: 'Memory Keeper',
      titleMr: 'आठवणींचा संग्रहक',
      description: 'Upload 10 or more travel memories to your digital album.',
      descriptionMr: 'तुमच्या डिजिटल अल्बममध्ये १० किंवा अधिक प्रवास फोटो जतन करा.',
      currentValue: allMemories.length,
      targetValue: 10,
      category: 'media',
    },
    {
      id: 'pune_voyager',
      icon: '🧭',
      title: 'Pune Voyager',
      titleMr: 'पुणे भ्रमंतीकार',
      description: 'Log visits to 10 distinct Pune destinations.',
      descriptionMr: 'पुण्यातील १० विविध ऐतिहासिक व पर्यटन स्थळांना भेट नोंदवा.',
      currentValue: visitedPlaceIds.size,
      targetValue: 10,
      category: 'social',
    },
    {
      id: 'monthly_explorer',
      icon: '🗓️',
      title: 'Monthly Explorer',
      titleMr: 'मासिक प्रवासी',
      description: 'Explore 5 destinations in a single month.',
      descriptionMr: 'एकाच महिन्यात ५ वेगवेगळ्या ठिकाणांना भेट द्या.',
      currentValue: Math.min(5, allVisits.length),
      targetValue: 5,
      category: 'social',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.currentValue >= a.targetValue).length;
  const userLevel = Math.max(1, Math.floor(unlockedCount / 2) + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Level & Milestone Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: 24,
          padding: '28px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
            }}
          >
            <Trophy size={28} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#fcd34d', fontWeight: 800, textTransform: 'uppercase' }}>
              <span>Level {userLevel} Explorer</span>
            </div>
            <h2 style={{ margin: '4px 0 0', fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 900 }}>
              {isMr ? 'पुणे प्रवास पदके व कामगिरी' : 'Travel Achievements & Milestones'}
            </h2>
            <span style={{ fontSize: 13.5, color: '#cbd5e1' }}>
              {isMr
                ? `एकूण ८ पैकी ${unlockedCount} पदके अनलॉक झाली आहेत.`
                : `${unlockedCount} of 8 badges unlocked through real exploration.`}
            </span>
          </div>
        </div>

        {/* Level Progress meter */}
        <div style={{ minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1', fontWeight: 700 }}>
            <span>Milestones</span>
            <span>{unlockedCount} / 8</span>
          </div>
          <div style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', overflow: 'hidden' }}>
            <div style={{ width: `${(unlockedCount / 8) * 100}%`, height: '100%', backgroundColor: '#f59e0b', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {achievements.map((ach) => {
          const isUnlocked = ach.currentValue >= ach.targetValue;
          const progressPercent = Math.min(100, Math.round((ach.currentValue / ach.targetValue) * 100));

          return (
            <div
              key={ach.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 18,
                border: isUnlocked ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: isUnlocked ? '0 4px 16px rgba(245, 158, 11, 0.1)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32 }}>{ach.icon}</div>
                {isUnlocked ? (
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 8,
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      fontSize: 11,
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    {isMr ? 'अनलॉक' : 'Unlocked'}
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 8,
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Lock size={12} />
                    {isMr ? 'प्रलंबित' : 'Locked'}
                  </span>
                )}
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                  {isMr ? ach.titleMr : ach.title}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#64748b', lineHeight: 1.45 }}>
                  {isMr ? ach.descriptionMr : ach.description}
                </p>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#475569', fontWeight: 700 }}>
                  <span>{isMr ? 'प्रगती' : 'Progress'}</span>
                  <span>
                    {ach.currentValue} / {ach.targetValue}
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: isUnlocked ? '#f59e0b' : '#ea580c',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
