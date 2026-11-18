'use client';

import React, { useState } from 'react';
import {
  Compass,
  RotateCcw,
  Plus,
  Minus,
  Maximize2,
  HelpCircle,
  X,
  Keyboard,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Layers,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface GameControlsHUDProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onPitchUp: () => void;
  onPitchDown: () => void;
  onToggleFullscreen: () => void;
  onToggleSound: () => void;
  isSoundActive: boolean;
  is3d: boolean;
  onToggleTilt: () => void;
  lang?: string;
  className?: string;
}

export default function GameControlsHUD({
  onZoomIn,
  onZoomOut,
  onResetView,
  onRotateLeft,
  onRotateRight,
  onPitchUp,
  onPitchDown,
  onToggleFullscreen,
  onToggleSound,
  isSoundActive,
  is3d,
  onToggleTilt,
  lang = 'en',
  className = '',
}: GameControlsHUDProps) {
  const isMr = lang === 'mr';
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  return (
    <div
      className={`select-none pointer-events-auto flex flex-col items-end gap-2 ${className}`}
      aria-label="GTA Game Camera & Navigation Controls"
    >
      {/* Keyboard Controls Legend Popup */}
      {showKeyboardHelp && (
        <div className="p-4 rounded-3xl bg-black/95 backdrop-blur-2xl border border-white/20 text-white font-mono shadow-2xl text-xs w-72 mb-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
              <Keyboard size={14} />
              <span>GAME CONTROLS GUIDE</span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyboardHelp(false)}
              className="p-1 rounded-full text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-white/60">WASD / Arrow Keys</span>
              <span className="font-bold text-amber-300">Move Camera</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Q / E</span>
              <span className="font-bold text-emerald-300">Rotate Camera</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">R / F</span>
              <span className="font-bold text-cyan-300">Tilt Pitch 3D/2D</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Space</span>
              <span className="font-bold text-white">Reset Overview</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Mouse Drag</span>
              <span className="font-bold text-white/80">Left: Pan / Right: Orbit</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Floating Action Column */}
      <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl font-mono">
        {/* Zoom In */}
        <button
          type="button"
          onClick={() => {
            onZoomIn();
            ambientAudio.playUiBlip(800, 0.03);
          }}
          title="Zoom In"
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <Plus size={16} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => {
            onZoomOut();
            ambientAudio.playUiBlip(720, 0.03);
          }}
          title="Zoom Out"
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <Minus size={16} />
        </button>

        <div className="w-full h-[1px] bg-white/10 my-0.5" />

        {/* 3D / 2D Tilt Perspective */}
        <button
          type="button"
          onClick={() => {
            onToggleTilt();
            ambientAudio.playUiBlip(840, 0.04);
          }}
          title="Toggle 3D Perspective"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            is3d ? 'bg-emerald-500 text-black font-black' : 'bg-white/[0.04] text-white/60 hover:text-white'
          }`}
        >
          <span className="text-[10px] font-mono font-black">{is3d ? '3D' : '2D'}</span>
        </button>

        {/* Reset Camera to District Overview */}
        <button
          type="button"
          onClick={() => {
            onResetView();
            ambientAudio.playUiBlip(680, 0.04);
          }}
          title="Reset Camera Overview (Space)"
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <RotateCcw size={15} />
        </button>

        {/* Ambient Breeze Soundscape Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleSound();
          }}
          title={isSoundActive ? 'Mute Ambient Sound' : 'Play Mountain Wind Ambient Sound'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isSoundActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg'
              : 'bg-white/[0.04] text-white/50 hover:text-white'
          }`}
        >
          {isSoundActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Fullscreen Map Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleFullscreen();
            ambientAudio.playUiBlip(750, 0.04);
          }}
          title="Toggle Fullscreen"
          className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors"
        >
          <Maximize2 size={14} />
        </button>

        {/* Keyboard Shortcut Help Toggle */}
        <button
          type="button"
          onClick={() => {
            setShowKeyboardHelp(!showKeyboardHelp);
            ambientAudio.playUiBlip(900, 0.03);
          }}
          title="Keyboard Navigation Help"
          className="w-9 h-9 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center justify-center transition-colors border border-amber-500/20"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </div>
  );
}
