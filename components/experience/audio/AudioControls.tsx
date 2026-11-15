/**
 * Explore Pune - AudioControls Component
 * Floating audio pill with real-time soundwave equalizer animation,
 * volume slider, and one-click user opt-in prompt compliant with Hard Rule #3.
 */

'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1, Headphones, X, Sparkles, Activity } from 'lucide-react';
import { useAudioEngine } from './useAudioEngine';
import { useLanguage } from '@/lib/LanguageContext';

const TRACK_LABELS: Record<string, { en: string; mr: string; icon: string }> = {
  'preloader-drone': { en: 'Meditative Drone', mr: 'पुणे नाद', icon: '🕉️' },
  'sahyadri-wind': { en: 'Sahyadri Wind', mr: 'सिंहगड वारे', icon: '⛰️' },
  'peshwa-court': { en: 'Peshwa Sanai & Sitar', mr: 'पेशवे दरबारी संगीत', icon: '🪕' },
  'market-bustle': { en: 'Old Pune Bazaar', mr: 'पुणे मंडई व तुळशीबाग', icon: '🏛️' },
  'dhol-tasha': { en: 'Puneri Dhol-Tasha', mr: 'पुणेरी ढोल-ताशा', icon: '🥁' },
  'monsoon-rain': { en: 'Monsoon Rain', mr: 'पुणे मान्सून पाऊस', icon: '🌧️' },
};

export default function AudioControls() {
  const {
    isAudioEnabled,
    isMuted,
    volume,
    activeTrack,
    dholPlaybackRate,
    showOptInPrompt,
    toggleAudio,
    toggleMute,
    setVolume,
    dismissOptInPrompt,
    optInAudio,
  } = useAudioEngine();

  const { isMr } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const isPlayingActive = isAudioEnabled && !isMuted;
  const currentLabel = activeTrack ? TRACK_LABELS[activeTrack] : TRACK_LABELS['preloader-drone'];

  return (
    <>
      {/* 1. Hard Rule #3 Compliant Opt-In Prompt Toast */}
      {showOptInPrompt && !isAudioEnabled && (
        <aside
          className="exp-audio-optin-toast"
          role="region"
          aria-label={isMr ? 'ध्वनी पर्याय सूचना' : 'Audio experience opt-in notification'}
        >
          <div className="exp-audio-optin-glow" aria-hidden="true" />
          <div className="exp-audio-optin-body">
            <div className="exp-audio-optin-header">
              <div className="exp-audio-optin-badge">
                <Headphones size={13} className="text-amber-400" />
                <span>{isMr ? 'ऐतिहासिक ध्वनी अनुभव' : 'Spatial Sonic Experience'}</span>
              </div>
              <button
                type="button"
                onClick={dismissOptInPrompt}
                className="exp-audio-optin-close"
                aria-label={isMr ? 'सूचना बंद करा' : 'Dismiss sound prompt'}
              >
                <X size={14} />
              </button>
            </div>

            <p className="exp-audio-optin-desc">
              {isMr
                ? 'सिंहगडाचे वारे, पेशवेकालीन सनई-सतार आणि पुणेरी ढोल-ताशाच्या तालावर पुण्याचा इतिहास अनुभवा.'
                : 'Audio is silent by default. Opt in to hear Sahyadri mountain wind, Peshwa court sanai, and scroll-reactive Dhol-Tasha.'}
            </p>

            <div className="exp-audio-optin-actions">
              <button
                type="button"
                onClick={optInAudio}
                className="exp-audio-optin-btn primary"
                aria-label={isMr ? 'ध्वनी चालू करा' : 'Enable ambient soundscape'}
              >
                <Volume2 size={14} style={{ marginRight: 6 }} />
                <span>{isMr ? 'ध्वनी चालू करा' : 'Enable Soundscape'}</span>
              </button>

              <button
                type="button"
                onClick={dismissOptInPrompt}
                className="exp-audio-optin-btn secondary"
                aria-label={isMr ? 'मूक ठेवा' : 'Keep silent'}
              >
                <span>{isMr ? 'शांत मोड' : 'Keep Silent'}</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Floating Audio Pill with Soundwave Equalizer */}
      <nav
        className="exp-audio-pill-container"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        aria-label={isMr ? 'ध्वनी नियंत्रक' : 'Audio Controls'}
      >
        <div className={`exp-audio-pill ${isPlayingActive ? 'playing' : 'muted'}`}>
          {/* Equalizer Wave / Icon */}
          <button
            type="button"
            onClick={toggleAudio}
            className="exp-audio-toggle-trigger"
            aria-label={
              isPlayingActive
                ? isMr ? 'ध्वनी बंद करा' : 'Mute Soundscape'
                : isMr ? 'ध्वनी चालू करा' : 'Unmute Soundscape'
            }
            title={isPlayingActive ? 'Click to Mute' : 'Click to Enable Audio'}
          >
            {isPlayingActive ? (
              <div className="exp-equalizer-bars" aria-hidden="true">
                <span className="eq-bar bar-1" />
                <span className="eq-bar bar-2" />
                <span className="eq-bar bar-3" />
                <span className="eq-bar bar-4" />
              </div>
            ) : (
              <VolumeX size={15} className="text-zinc-400" />
            )}
          </button>

          {/* Track Name & Live Status */}
          <div
            className="exp-audio-info"
            onClick={toggleAudio}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleAudio();
              }
            }}
          >
            <span className="exp-audio-track-title">
              {isPlayingActive ? (
                <>
                  <span className="mr-1.5" aria-hidden="true">{currentLabel?.icon || '🎵'}</span>
                  <span>{isMr ? currentLabel?.mr : currentLabel?.en}</span>
                </>
              ) : (
                <span className="text-zinc-400">{isMr ? 'ध्वनी बंद' : 'Sound Off'}</span>
              )}
            </span>

            {/* Dhol Dynamic Tempo Badge */}
            {isPlayingActive && activeTrack === 'dhol-tasha' && (
              <span className="exp-audio-rate-badge" title="Linked to scroll velocity">
                <Activity size={10} style={{ marginRight: 2 }} />
                <span>{dholPlaybackRate.toFixed(2)}x</span>
              </span>
            )}
          </div>

          {/* Expand Slider Trigger */}
          <button
            type="button"
            onClick={toggleMute}
            className="exp-audio-sub-toggle"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={13} /> : volume > 0.5 ? <Volume2 size={13} /> : <Volume1 size={13} />}
          </button>
        </div>

        {/* 3. Flyout Volume Slider Menu (Appears on Hover / Expand) */}
        {isExpanded && isAudioEnabled && (
          <div className="exp-audio-flyout" role="menu">
            <div className="exp-audio-flyout-row">
              <span className="exp-audio-slider-label">
                {isMr ? 'आवाज' : 'Volume'} ({Math.round(volume * 100)}%)
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) toggleMute();
                }}
                className="exp-audio-volume-range"
                aria-label={isMr ? 'आवाज नियंत्रण' : 'Master volume slider'}
              />
            </div>
            {activeTrack && (
              <div className="exp-audio-flyout-subtext">
                <Sparkles size={11} className="text-amber-400" style={{ marginRight: 4, display: 'inline' }} />
                <span>
                  {isMr
                    ? `सध्याचा प्रवाह: ${currentLabel?.mr}`
                    : `Active Ambience: ${currentLabel?.en}`}
                </span>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Scoped CSS Styles for Audio Equalizer and Opt-In Toast */}
      <style jsx>{`
        .exp-audio-optin-toast {
          position: fixed;
          bottom: 84px;
          right: 24px;
          z-index: 1000;
          max-width: 340px;
          background: rgba(15, 23, 42, 0.94);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), 0 0 16px rgba(245, 158, 11, 0.15);
          backdrop-filter: blur(16px);
          animation: optin-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          color: #f8fafc;
        }

        .exp-audio-optin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .exp-audio-optin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #f59e0b;
        }

        .exp-audio-optin-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .exp-audio-optin-close:hover {
          color: #ffffff;
        }

        .exp-audio-optin-desc {
          font-size: 0.8rem;
          line-height: 1.45;
          color: #cbd5e1;
          margin: 0 0 12px 0;
        }

        .exp-audio-optin-actions {
          display: flex;
          gap: 8px;
        }

        .exp-audio-optin-btn {
          flex: 1;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .exp-audio-optin-btn.primary {
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
        }

        .exp-audio-optin-btn.primary:hover {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          transform: translateY(-1px);
        }

        .exp-audio-optin-btn.secondary {
          background: rgba(30, 41, 59, 0.7);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .exp-audio-optin-btn.secondary:hover {
          color: #ffffff;
          background: rgba(51, 65, 85, 0.8);
        }

        /* Floating Audio Pill */
        .exp-audio-pill-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .exp-audio-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(15, 23, 42, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          backdrop-filter: blur(14px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          color: #f1f5f9;
          transition: all 0.25s ease;
          user-select: none;
        }

        .exp-audio-pill.playing {
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 14px rgba(245, 158, 11, 0.25);
        }

        .exp-audio-toggle-trigger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .exp-equalizer-bars {
          display: flex;
          align-items: flex-end;
          gap: 2.5px;
          height: 14px;
          width: 14px;
        }

        .eq-bar {
          flex: 1;
          background: #f59e0b;
          border-radius: 1px;
          animation: eq-bounce 1.1s ease-in-out infinite alternate;
        }

        .bar-1 { height: 40%; animation-delay: 0.1s; }
        .bar-2 { height: 90%; animation-delay: 0.35s; }
        .bar-3 { height: 60%; animation-delay: 0.2s; }
        .bar-4 { height: 100%; animation-delay: 0.5s; }

        @keyframes eq-bounce {
          0% { height: 20%; opacity: 0.5; }
          50% { height: 85%; opacity: 0.9; }
          100% { height: 45%; opacity: 0.7; }
        }

        .exp-audio-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .exp-audio-track-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: #f8fafc;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .exp-audio-rate-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #f59e0b;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 4px;
          font-family: monospace;
        }

        .exp-audio-sub-toggle {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 4px;
          transition: color 0.15s ease;
        }

        .exp-audio-sub-toggle:hover {
          color: #ffffff;
        }

        /* Flyout Menu */
        .exp-audio-flyout {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          padding: 10px 14px;
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
          width: 210px;
          animation: optin-slide-up 0.2s ease-out;
        }

        .exp-audio-flyout-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .exp-audio-slider-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .exp-audio-volume-range {
          width: 100%;
          accent-color: #f59e0b;
          cursor: pointer;
        }

        .exp-audio-flyout-subtext {
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.7rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes optin-slide-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .exp-audio-pill-container {
            bottom: 16px;
            right: 16px;
          }
          .exp-audio-optin-toast {
            bottom: 74px;
            right: 16px;
            left: 16px;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}
