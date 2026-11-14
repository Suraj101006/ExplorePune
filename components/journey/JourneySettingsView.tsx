'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  Settings,
  User as UserIcon,
  Download,
  Trash2,
  Globe,
  Sliders,
  Shield,
  CheckCircle2,
  Database,
} from 'lucide-react';
import {
  getAllMemories,
  getAllDestinationVisits,
  getAllProjectDrafts,
  getAllRenderedExports,
} from '@/lib/memoryAlbumStorage';

interface JourneySettingsViewProps {
  user: User | null;
  isMr: boolean;
}

export default function JourneySettingsView({ user, isMr }: JourneySettingsViewProps) {
  const [preferredLanguage, setPreferredLanguage] = useState<'mr' | 'en'>(isMr ? 'mr' : 'en');
  const [defaultQuality, setDefaultQuality] = useState<'1080p' | '720p'>('720p');
  const [tagline, setTagline] = useState('Passionate Sahyadri Wanderer & Puneri Storyteller');
  const [savedToast, setSavedToast] = useState(false);

  // Handle Export Backup JSON
  const handleExportAllData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      user: user ? { uid: user.uid, email: user.email, displayName: user.displayName } : 'guest',
      memories: getAllMemories(user?.uid),
      visits: getAllDestinationVisits(user?.uid),
      drafts: getAllProjectDrafts(user?.uid),
      renderedExports: getAllRenderedExports(user?.uid),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `explore-pune-journey-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSavePreferences = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 4px 16px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Settings size={22} color="#475569" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: '#0f172a' }}>
            {isMr ? 'प्रवास सेटिंग्ज व प्रोफाईल' : 'Journey Profile & Preferences'}
          </h2>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {isMr ? 'तुमची वैयक्तिक माहिती, रील पसंती व डेटा बॅकअप' : 'Personal information, reel presets, and data export.'}
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          {isMr ? '१. प्रवासी प्रोफाईल' : '1. Traveler Profile'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'P'}
          </div>

          <div>
            <strong style={{ fontSize: 16, color: '#0f172a', display: 'block' }}>
              {user?.displayName || (isMr ? 'पुणेकर प्रवासी' : 'Pune Explorer')}
            </strong>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {user?.email || 'Guest Explorer'}
            </span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
            {isMr ? 'प्रवासी घोषवाक्य (Traveler Tagline)' : 'Traveler Bio & Tagline'}
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Preferences Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          {isMr ? '२. रील स्टुडिओ पसंती' : '2. Studio & Generation Preferences'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              {isMr ? 'रील भाषा' : 'Default Reel Language'}
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as any)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="mr">मराठी (Marathi - अस्सल पुणेरी भाषा)</option>
              <option value="en">English (Universal Travelogue)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              {isMr ? 'डीफॉल्ट व्हिडिओ रिझोल्यूशन' : 'Default Video Resolution'}
            </label>
            <select
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value as any)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                background: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="720p">720x1280 (HD - Quick Rendering)</option>
              <option value="1080p">1080x1920 (Full HD - Cinema Grade)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="button"
            onClick={handleSavePreferences}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {savedToast ? (isMr ? 'पसंती जतन झाली!' : 'Preferences Saved!') : (isMr ? 'पसंती जतन करा' : 'Save Preferences')}
          </button>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          {isMr ? '३. डेटा व्यवस्थापन व बॅकअप' : '3. Data Management & Safe Backup'}
        </h3>
        <p style={{ margin: 0, fontSize: 13.5, color: '#64748b' }}>
          {isMr
            ? 'तुमचा संपूर्ण प्रवास डेटा, आठवणी, भेटी आणि मसुदे एका सुरक्षित JSON फाईलमध्ये डाउनलोड करा.'
            : 'Export your complete travel memories, visit checkpoints, and project drafts as an offline JSON archive.'}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportAllData}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            <span>{isMr ? 'संपूर्ण प्रवास डेटा डाउनलोड करा (JSON)' : 'Download Complete Travel Archive (JSON)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
