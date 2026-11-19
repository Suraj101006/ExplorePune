import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Gamepad2,
  ExternalLink,
  ShieldCheck,
  Compass,
  Mountain,
  Flame,
  Droplets,
  Ruler,
  Clock,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Sinhagad2DGame } from '@/components/games/sinhagad/Sinhagad2DGame';

export const metadata: Metadata = {
  title: 'Historical Games & 2D Simulations | Explore Pune',
  description:
    'Playable, archaeologically grounded 2D interactive reconstructions of Pune historical forts and heritage monuments. Experience Sinhagad Fort, Pune Darwaza, and Daru Kothar.',
  keywords: [
    'Explore Pune Games',
    'Sinhagad Fort 2D Game',
    'Historical Fort Simulator',
    'Pune Heritage Games',
    'Maratha Fort 2D Reconstruction',
    'Archaeological Games',
  ],
  openGraph: {
    title: 'Explore Pune Games — Historically Accurate Fort Reconstructions',
    description:
      'Step into the authentic 17th-century Maratha fortifications. Play the Sinhagad Fort 2D interactive simulation in a dedicated tab or right here.',
    images: ['/images/places/sinhagad-fort.jpg'],
  },
};

export default function GamesHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            <Gamepad2 className="w-4 h-4" />
            <span>HISTORICAL 2D GAME STUDIO • EXPLORE PUNE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white mb-4">
            पुणे आणि सह्याद्री: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">ऐतिहासिक खेळ व सिम्युलेशन</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
            Experience Pune&apos;s celebrated fortresses and monuments reconstructed with archaeological precision, measured conservation surveys, and real-world 1:1 metric scale.
          </p>

          {/* Quick Stats / Standards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SCALE ACCURACY</span>
              <span className="text-amber-300 font-bold text-sm">32px = 1.0 Meter</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">PRIMARY EVIDENCE</span>
              <span className="text-emerald-400 font-bold text-sm">Kimaya 2017 Survey</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">AERIAL RECON</span>
              <span className="text-cyan-400 font-bold text-sm">4K Drone Ground-Truth</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">GAME ENGINE</span>
              <span className="text-orange-400 font-bold text-sm">60 FPS Web Audio 2D</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Game Showcase Hero Card */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-1">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-900/40 border-2 border-amber-500/30 shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> FEATURED RECONSTRUCTION
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ARCHAEOLOGICALLY VERIFIED
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-amber-100">
                Sinhagad Fort: The Lion&apos;s Fortress
              </h2>
              <h3 className="text-sm sm:text-base font-semibold text-amber-400/90 font-mono">
                सिंहगड किल्ला — २D वास्तववादी ऐतिहासिक मोहीम (Kondhana 1670)
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Step into the real Sinhagad Fort. Navigate the triple gateway of{' '}
                <strong className="text-amber-300">Pune Darwaza</strong> with its tactical 90° right-angle bend, step inside the bomb-proof vaulted chamber of{' '}
                <strong className="text-amber-300">Daru Kothar</strong> (8.50m × 3.77m), drink from the perennial living rock cistern at{' '}
                <strong className="text-cyan-300">Dev Taki</strong>, stand upon the prow of{' '}
                <strong className="text-orange-300">Zunjar Buruj</strong> with the Bhagwa Jhenda, and honor{' '}
                <strong className="text-red-300">Veer Tanaji Malusare</strong> at Donagiricha Kada where the 1670 night escalade was accomplished.
              </p>

              {/* Action Buttons: Play in New Tab or Play Here */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/experience/sinhagad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 border border-amber-300 transition-all transform hover:scale-[1.03]"
                >
                  <Gamepad2 className="w-5 h-5 fill-current" />
                  <span>PLAY IN NEW TAB</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#playable-game"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span>Play On This Page</span>
                </a>
              </div>
            </div>

            {/* Quick Feature Highlights Card */}
            <div className="w-full lg:w-80 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2">
                Verified Historic Features
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Full Triangular Plateau</strong>: 4,200px map with real-time GPS radar minimap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>7 Measured Architectural Blueprints</strong>: Inspect CAD plans for gates, tanks &amp; vaults.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>6 Historical Missions</strong>: Earn exploration badges by discovering genuine monuments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mountain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Dual Controls</strong>: Smooth keyboard (WASD/Shift) + Mobile virtual thumbstick.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Embedded Interactive Game Section */}
        <div id="playable-game" className="mt-12 space-y-4 scroll-mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Live Playable Reconstruction
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Use WASD or Arrow Keys to explore. Press Shift to sprint. Press E to open architectural drawings.
              </p>
            </div>
            <Link
              href="/experience/sinhagad"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
            >
              <span>Full Screen in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-full h-[640px] lg:h-[760px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-950">
            <Sinhagad2DGame />
          </div>
        </div>

        {/* Upcoming Games Shelf */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2 font-serif">
            <Clock className="w-5 h-5 text-amber-400" />
            Upcoming Historical Simulations in Development
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                IN PROGRESS
              </span>
              <h4 className="text-base font-bold text-slate-100">Shaniwar Wada 2D Palace Mystery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step inside the seven-story Meghadambari wada, Dilli Darwaza with 72 elephant spikes, and the iconic Hazari Karanje fountain.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                PLANNED
              </span>
              <h4 className="text-base font-bold text-slate-100">Torna Fort: The Eagle&apos;s Nest</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reconstruct the highest hill fortress in Pune district (1,403 meters), the first fort captured by 16-year-old Shivaji Maharaj in 1646.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                PLANNED
              </span>
              <h4 className="text-base font-bold text-slate-100">Rajgad: Capital of Hindavi Swarajya</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore the triple machis (Padmavati, Sanjivani, Suvela) and the impregnable Bale Kila citadel.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
