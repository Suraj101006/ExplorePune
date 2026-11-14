'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Film,
  Camera,
  Trophy,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DayJourney } from '@/lib/journeyStorage';
import { MemoryMediaItem, DestinationVisitRecord } from '@/lib/memoryAlbumStorage';
import { StructuredPlace } from '@/lib/chatKnowledgeEngine';

interface MonthlyJourneyViewProps {
  journeys: DayJourney[];
  allVisits: DestinationVisitRecord[];
  allMemories: MemoryMediaItem[];
  allPlaces: StructuredPlace[];
  isMr: boolean;
  onLaunchMonthlyReel: (options: { monthPrefix: string; durationTier: 'short' | 'full' | 'extended' }) => void;
  onSelectPlaceDetails: (place: StructuredPlace) => void;
}

export default function MonthlyJourneyView({
  journeys,
  allVisits,
  allMemories,
  allPlaces,
  isMr,
  onLaunchMonthlyReel,
  onSelectPlaceDetails,
}: MonthlyJourneyViewProps) {
  // Current month prefix default e.g. "2026-11"
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return new Date().toISOString().slice(0, 7);
  });

  const [selectedDurationTier, setSelectedDurationTier] = useState<'short' | 'full' | 'extended'>('full');

  // Month options list (past 6 months)
  const monthOptions = useMemo(() => {
    const list: Array<{ value: string; label: string }> = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = d.toISOString().slice(0, 7);
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      list.push({ value: val, label });
    }
    return list;
  }, []);

  // Filter visits and memories for selected month
  const monthVisits = useMemo(() => {
    return allVisits.filter((v) => v.visitedDate?.startsWith(selectedMonth));
  }, [allVisits, selectedMonth]);

  const monthMemories = useMemo(() => {
    return allMemories.filter((m) => m.capturedDate?.startsWith(selectedMonth));
  }, [allMemories, selectedMonth]);

  // Unique places visited this month
  const monthPlaceIds = useMemo(() => {
    const set = new Set<string>();
    for (const v of monthVisits) set.add(v.placeId);
    return set;
  }, [monthVisits]);

  const monthPlaces = useMemo(() => {
    return allPlaces.filter((p) => monthPlaceIds.has(p.id) || monthPlaceIds.has(p.slug));
  }, [allPlaces, monthPlaceIds]);

  // Top category
  const topCategory = useMemo(() => {
    if (monthPlaces.length === 0) return isMr ? 'सर्वसाधारण' : 'General Exploration';
    const counts: Record<string, number> = {};
    for (const p of monthPlaces) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'Heritage';
  }, [monthPlaces, isMr]);

  // Calendar days grid calculation
  const calendarDays = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-indexed
    const daysInMonth = new Date(year, month, 0).getDate();

    const activeDates = new Set<number>();
    monthVisits.forEach((v) => {
      const vDate = v.visitDate || v.visitedDate;
      if (vDate) {
        const dayNum = parseInt(vDate.slice(8, 10), 10);
        if (!isNaN(dayNum)) activeDates.add(dayNum);
      }
    });
    monthMemories.forEach((m) => {
      if (m.capturedDate) {
        const dayNum = parseInt(m.capturedDate.slice(8, 10), 10);
        if (!isNaN(dayNum)) activeDates.add(dayNum);
      }
    });

    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      hasActivity: activeDates.has(i + 1),
    }));
  }, [selectedMonth, monthVisits, monthMemories]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Month Selector Banner */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={24} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
              {isMr ? 'मासिक प्रवास (MY MONTH IN PUNE)' : 'My Month in Pune (Monthly Journey)'}
            </h2>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {isMr
                ? 'महिन्यातील प्रवास आढावा, कॅलेंडर व सिनेमॅटिक मासिक रील'
                : 'Monthly exploration summary, calendar highlights, and recap reels.'}
            </span>
          </div>
        </div>

        {/* Month Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              fontWeight: 700,
              color: '#1e293b',
              background: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Statistics Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isMr ? 'ठिकाणे भेट दिली' : 'Places Explored'}
          </span>
          <strong style={{ fontSize: 24, color: '#10b981' }}>{monthPlaces.length}</strong>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            {isMr ? 'या महिन्यातील एकूण' : 'in selected month'}
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isMr ? 'आठवणी फोटो' : 'Memories Captured'}
          </span>
          <strong style={{ fontSize: 24, color: '#ea580c' }}>{monthMemories.length}</strong>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            {isMr ? 'फोटो व व्हिडिओ' : 'photos & moments'}
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isMr ? 'प्रमुख विभाग' : 'Top Category'}
          </span>
          <strong style={{ fontSize: 18, color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {topCategory}
          </strong>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            {isMr ? 'सर्वाधिक भेट दिलेला' : 'most visited domain'}
          </span>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            {isMr ? 'मासिक पदक' : 'Monthly Milestone'}
          </span>
          <strong style={{ fontSize: 16, color: '#d97706', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trophy size={18} />
            <span>{monthPlaces.length >= 4 ? (isMr ? 'पुणे वाटाड्या' : 'Pune Voyager') : (isMr ? 'सुरुवात' : 'Explorer')}</span>
          </strong>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            {monthPlaces.length} / 4 {isMr ? 'ठिकाणे' : 'places'}
          </span>
        </div>
      </div>

      {/* Calendar Activity Matrix */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          {isMr ? 'मासिक प्रवास कॅलेंडर (Exploration Activity)' : 'Monthly Exploration Calendar'}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 8,
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 800,
                color: '#94a3b8',
                padding: '4px 0',
              }}
            >
              {d}
            </div>
          ))}

          {calendarDays.map((cd) => (
            <div
              key={cd.day}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: cd.hasActivity ? '1.5px solid #ea580c' : '1px solid #f1f5f9',
                backgroundColor: cd.hasActivity ? '#fff7ed' : '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: cd.hasActivity ? 800 : 500,
                  color: cd.hasActivity ? '#ea580c' : '#64748b',
                }}
              >
                {cd.day}
              </span>
              {cd.hasActivity && (
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#ea580c',
                    position: 'absolute',
                    bottom: 4,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3 Duration Tiers for Monthly Reel Generation */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderRadius: 24,
          padding: '28px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 12px 30px -6px rgba(15, 23, 42, 0.3)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 12, background: 'rgba(124, 58, 237, 0.3)', color: '#c4b5fd', fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>
            <Sparkles size={13} />
            <span>{isMr ? 'मासिक सिनेमॅटिक रील' : 'Monthly Cinematic Reel Studio'}</span>
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 900 }}>
            {isMr ? 'या महिन्याचा सिनेमॅटिक रील तयार करा' : 'Export Your Monthly Pune Story in 9:16'}
          </h3>
          <p style={{ margin: 0, fontSize: 13.5, color: '#cbd5e1' }}>
            {isMr
              ? 'निवडलेल्या महिन्यातील सर्व भेटी, फोटो आणि संगीत एकत्रित करून एका क्लिकवर रील बनवा.'
              : 'Stitch together all destinations visited this month with authentic Marathi soundtracks.'}
          </p>
        </div>

        {/* 3 Tier Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div
            onClick={() => setSelectedDurationTier('short')}
            style={{
              padding: '16px',
              borderRadius: 16,
              background: selectedDurationTier === 'short' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedDurationTier === 'short' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <strong style={{ fontSize: 14, color: '#ffffff' }}>
              ⚡ {isMr ? 'शॉर्ट रिकॅप' : 'Short Recap'}
            </strong>
            <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 700 }}>
              30 - 45 {isMr ? 'सेकंद' : 'Seconds'}
            </span>
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
              {isMr ? 'सोशल मीडियासाठी उत्तम, वेगवान बीट्स' : 'Snappy highlights, punchy beat drops for Instagram.'}
            </span>
          </div>

          <div
            onClick={() => setSelectedDurationTier('full')}
            style={{
              padding: '16px',
              borderRadius: 16,
              background: selectedDurationTier === 'full' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedDurationTier === 'full' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <strong style={{ fontSize: 14, color: '#ffffff' }}>
              🌟 {isMr ? 'संपूर्ण मासिक सफर' : 'Full Monthly Journey'}
            </strong>
            <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 700 }}>
              60 - 90 {isMr ? 'सेकंद' : 'Seconds'}
            </span>
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
              {isMr ? 'सर्व ठिकाणे व आठवणींचा समतोल अनुभव' : 'Balanced cinematic narrative across all stops.'}
            </span>
          </div>

          <div
            onClick={() => setSelectedDurationTier('extended')}
            style={{
              padding: '16px',
              borderRadius: 16,
              background: selectedDurationTier === 'extended' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: selectedDurationTier === 'extended' ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <strong style={{ fontSize: 14, color: '#ffffff' }}>
              🎬 {isMr ? 'विस्तारित ट्रॅव्हलॉग' : 'Extended Travelogue'}
            </strong>
            <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 700 }}>
              2 - 3 {isMr ? 'मिनिटे' : 'Minutes'}
            </span>
            <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
              {isMr ? 'खोलवर अनुभव, संपूर्ण गाणे व छायाचित्रे' : 'Full song experience with rich photography transitions.'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button
            type="button"
            onClick={() => onLaunchMonthlyReel({ monthPrefix: selectedMonth, durationTier: selectedDurationTier })}
            style={{
              padding: '12px 24px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: 14,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
            }}
          >
            <Film size={18} />
            <span>{isMr ? 'मासिक रील तयार करा' : 'Generate Monthly Reel'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
