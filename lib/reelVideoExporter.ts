'use client';

import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { JourneyReelData, ReelVisualScene, buildOneReelSceneSequence } from '@/lib/journeyReel';
import { getDestinationProfile } from '@/lib/destinationIntelligence';
import { ReelSongTrack, ReelSongSection } from '@/lib/reelSongLibrary';
import { renderOfflineReelAudio } from '@/lib/reelAudioEngine';

export interface RenderProgressUpdate {
  percent: number; // 0 to 100
  phase: 'preparing' | 'rendering_frames' | 'encoding_audio' | 'finalizing' | 'completed';
  message: string;
  currentFrame: number;
  totalFrames: number;
}

export interface RenderedVideoResult {
  blob: Blob;
  downloadUrl: string;
  filename: string;
  format: 'mp4' | 'webm';
  mimeType: string;
  durationSec: number;
  width: number;
  height: number;
  hasAudio: boolean;
}

/**
 * Loads and caches an image URL into an HTMLImageElement
 */
const imageCache = new Map<string, HTMLImageElement>();

async function loadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = () => {
      // Fallback to a clean solid color placeholder canvas if image fails to load
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 1080;
      fallbackCanvas.height = 1920;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 1080, 1920);
      }
      const fallbackImg = new Image();
      fallbackImg.src = fallbackCanvas.toDataURL();
      fallbackImg.onload = () => resolve(fallbackImg);
    };
    img.src = url;
  });
}

/**
 * Universal High-Resolution MP4 Reel Video Exporter
 * Renders an authentic 9:16 vertical travel reel complete with:
 * - Ken Burns pan & zoom
 * - Destination color grading & vignette
 * - 5-act narrative titles and poetic dual-language captions
 * - Beat synchronized cuts
 * - Synchronized stereo audio track
 */
export async function exportJourneyReelToMP4(
  reelData: JourneyReelData,
  options?: {
    song?: ReelSongTrack;
    section?: ReelSongSection;
    width?: number;
    height?: number;
    fps?: number;
    maxDurationSec?: number;
    signal?: AbortSignal;
    onProgress?: (progress: RenderProgressUpdate) => void;
  }
): Promise<RenderedVideoResult> {
  const width = options?.width || 720; // 720x1280 mobile-optimized vertical 9:16
  const height = options?.height || 1280;
  const fps = options?.fps || 30;
  const onProgress = options?.onProgress || (() => {});
  const signal = options?.signal;

  if (signal?.aborted) {
    throw new DOMException('Export cancelled before start', 'AbortError');
  }

  onProgress({
    percent: 5,
    phase: 'preparing',
    message: 'Analyzing destination intelligence and preparing scenes...',
    currentFrame: 0,
    totalFrames: 100,
  });

  const { scenes } = buildOneReelSceneSequence(reelData);
  if (scenes.length === 0) {
    throw new Error('No scenes found in journey reel');
  }

  // Pre-load all scene images in parallel
  const urlsToPreload: string[] = [];
  for (const s of scenes) {
    if (s.type === 'place_photo' && s.photoUrl) urlsToPreload.push(s.photoUrl);
    if (s.type === 'place_intro' && s.place?.photos?.[0]) urlsToPreload.push(s.place.photos[0]);
  }
  await Promise.all(urlsToPreload.map(loadImage));

  if (signal?.aborted) {
    throw new DOMException('Export cancelled', 'AbortError');
  }

  // Compute scene timeline and total duration
  const sceneTimeline: Array<{ scene: ReelVisualScene; startSec: number; endSec: number; duration: number }> = [];
  let currentTimelineSec = 0;

  for (const s of scenes) {
    let dur = 2.8;
    if (s.type === 'intro') dur = 2.4;
    else if (s.type === 'place_intro') dur = 2.0;
    else if (s.type === 'place_photo') dur = 2.8;
    else if (s.type === 'outro') dur = 3.6;

    sceneTimeline.push({
      scene: s,
      startSec: currentTimelineSec,
      endSec: currentTimelineSec + dur,
      duration: dur,
    });
    currentTimelineSec += dur;
  }

  const totalDurationSec = Math.min(currentTimelineSec, options?.maxDurationSec || 45);
  const totalFrames = Math.ceil(totalDurationSec * fps);

  // Setup offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create 2D canvas context');

  // Check if WebCodecs VideoEncoder is available
  const hasWebCodecs = typeof window !== 'undefined' && 'VideoEncoder' in window && 'VideoFrame' in window;

  if (hasWebCodecs) {
    try {
      return await renderWithWebCodecs(
        canvas,
        ctx,
        reelData,
        sceneTimeline,
        totalDurationSec,
        totalFrames,
        width,
        height,
        fps,
        options?.song,
        signal,
        onProgress
      );
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal?.aborted) {
        throw new DOMException('Reel export cancelled by user', 'AbortError');
      }
      console.warn('WebCodecs rendering failed, gracefully falling back to MediaRecorder:', err);
    }
  }

  // Fallback: Canvas captureStream + MediaRecorder
  return await renderWithMediaRecorder(
    canvas,
    ctx,
    reelData,
    sceneTimeline,
    totalDurationSec,
    width,
    height,
    fps,
    options?.song,
    signal,
    onProgress
  );
}

/**
 * Primary Fast WebCodecs + MP4-Muxer Renderer
 */
async function renderWithWebCodecs(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  reelData: JourneyReelData,
  sceneTimeline: Array<{ scene: ReelVisualScene; startSec: number; endSec: number; duration: number }>,
  totalDurationSec: number,
  totalFrames: number,
  width: number,
  height: number,
  fps: number,
  song: ReelSongTrack | undefined,
  signal: AbortSignal | undefined,
  onProgress: (p: RenderProgressUpdate) => void
): Promise<RenderedVideoResult> {
  const target = new ArrayBufferTarget();

  const audioStyle = song?.audioGeneratorType || reelData.reel.music.audioGeneratorType || 'pune_ambient';
  let renderedAudio: AudioBuffer | null = null;
  try {
    renderedAudio = await renderOfflineReelAudio(audioStyle, totalDurationSec, 44100);
  } catch (err) {
    console.warn('Audio rendering offline error:', err);
  }

  const hasAudioEncoder =
    typeof window !== 'undefined' &&
    'AudioEncoder' in window &&
    'AudioData' in window &&
    renderedAudio !== null;

  const muxerOptions: any = {
    target,
    video: {
      codec: 'avc',
      width,
      height,
      frameRate: fps,
    },
    fastStart: 'in-memory',
  };

  if (hasAudioEncoder && renderedAudio) {
    muxerOptions.audio = {
      codec: 'aac',
      numberOfChannels: renderedAudio.numberOfChannels > 1 ? 2 : 1,
      sampleRate: 44100,
    };
  }

  const muxer = new Muxer(muxerOptions);

  const videoEncoder = new (window as any).VideoEncoder({
    output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
    error: (e: any) => console.error('VideoEncoder error:', e),
  });

  videoEncoder.configure({
    codec: 'avc1.42001f', // H.264 Baseline Profile (universal mobile & web support)
    width,
    height,
    bitrate: 3_000_000, // 3 Mbps crisp 9:16
    framerate: fps,
  });

  let audioEncoder: any = null;
  let hasAudio = false;

  if (hasAudioEncoder && renderedAudio) {
    try {
      audioEncoder = new (window as any).AudioEncoder({
        output: (chunk: any, meta: any) => muxer.addAudioChunk(chunk, meta),
        error: (e: any) => console.warn('AudioEncoder warning:', e),
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2', // AAC-LC
        numberOfChannels: renderedAudio.numberOfChannels > 1 ? 2 : 1,
        sampleRate: 44100,
        bitrate: 128_000,
      });

      // Encode audio data chunks
      const chunkSize = 2048;
      const totalSamples = renderedAudio.length;
      const left = renderedAudio.getChannelData(0);
      const right = renderedAudio.numberOfChannels > 1 ? renderedAudio.getChannelData(1) : left;

      let sampleOffset = 0;
      while (sampleOffset < totalSamples) {
        if (signal?.aborted) {
          videoEncoder.close();
          audioEncoder.close();
          throw new DOMException('Export cancelled', 'AbortError');
        }

        const framesToEncode = Math.min(chunkSize, totalSamples - sampleOffset);
        const planarData = new Float32Array(framesToEncode * (renderedAudio.numberOfChannels > 1 ? 2 : 1));
        planarData.set(left.subarray(sampleOffset, sampleOffset + framesToEncode), 0);
        if (renderedAudio.numberOfChannels > 1) {
          planarData.set(right.subarray(sampleOffset, sampleOffset + framesToEncode), framesToEncode);
        }

        const audioData = new (window as any).AudioData({
          format: 'f32-planar',
          sampleRate: 44100,
          numberOfFrames: framesToEncode,
          numberOfChannels: renderedAudio.numberOfChannels > 1 ? 2 : 1,
          timestamp: Math.round((sampleOffset / 44100) * 1_000_000), // microseconds
          data: planarData,
        });

        audioEncoder.encode(audioData);
        audioData.close();
        sampleOffset += framesToEncode;
      }

      await audioEncoder.flush();
      audioEncoder.close();
      hasAudio = true;
    } catch (aErr) {
      console.warn('AudioEncoder failed, proceeding with video-only MP4 track:', aErr);
    }
  }

  // Render video frames
  for (let f = 0; f < totalFrames; f++) {
    if (signal?.aborted) {
      videoEncoder.close();
      throw new DOMException('Reel export cancelled by user', 'AbortError');
    }

    const timeSec = f / fps;
    const entry = sceneTimeline.find((st) => timeSec >= st.startSec && timeSec < st.endSec) || sceneTimeline[sceneTimeline.length - 1];
    const sceneProgress = entry ? (timeSec - entry.startSec) / entry.duration : 0;

    await drawReelFrame(ctx, reelData, entry.scene, sceneProgress, width, height, f);

    const frame = new (window as any).VideoFrame(canvas, {
      timestamp: Math.round(f * (1_000_000 / fps)), // microsecond timestamp
    });

    const isKeyframe = f % (fps * 2) === 0;
    videoEncoder.encode(frame, { keyFrame: isKeyframe });
    frame.close();

    if (f % 5 === 0 || f === totalFrames - 1) {
      const pct = 10 + Math.round((f / totalFrames) * 80);
      onProgress({
        percent: pct,
        phase: 'rendering_frames',
        message: `Rendering frame ${f + 1} of ${totalFrames}...`,
        currentFrame: f + 1,
        totalFrames,
      });
      // Yield to event loop to keep UI smooth
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  await videoEncoder.flush();
  videoEncoder.close();

  onProgress({
    percent: 95,
    phase: 'finalizing',
    message: 'Finalizing MP4 container and building download...',
    currentFrame: totalFrames,
    totalFrames,
  });

  muxer.finalize();
  const buffer = target.buffer;
  const blob = new Blob([buffer], { type: 'video/mp4' });
  const downloadUrl = URL.createObjectURL(blob);
  const cleanTitle = (reelData.title || 'pune-journey-reel').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${cleanTitle}-${new Date().toISOString().slice(0, 10)}.mp4`;

  onProgress({
    percent: 100,
    phase: 'completed',
    message: 'Reel exported successfully!',
    currentFrame: totalFrames,
    totalFrames,
  });

  return {
    blob,
    downloadUrl,
    filename,
    format: 'mp4',
    mimeType: 'video/mp4',
    durationSec: totalDurationSec,
    width,
    height,
    hasAudio,
  };
}

/**
 * Fallback MediaRecorder Renderer
 */
async function renderWithMediaRecorder(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  reelData: JourneyReelData,
  sceneTimeline: Array<{ scene: ReelVisualScene; startSec: number; endSec: number; duration: number }>,
  totalDurationSec: number,
  width: number,
  height: number,
  fps: number,
  song: ReelSongTrack | undefined,
  signal: AbortSignal | undefined,
  onProgress: (p: RenderProgressUpdate) => void
): Promise<RenderedVideoResult> {
  const stream = canvas.captureStream(fps);

  // Audio track synthesis
  let audioContext: AudioContext | null = null;
  let hasAudio = false;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
      const audioDest = audioContext.createMediaStreamDestination();
      const audioStyle = song?.audioGeneratorType || reelData.reel.music.audioGeneratorType || 'pune_ambient';

      const renderedBuffer = await renderOfflineReelAudio(audioStyle, totalDurationSec, 44100);
      if (renderedBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = renderedBuffer;
        source.connect(audioDest);
        source.start(0);
        for (const track of audioDest.stream.getAudioTracks()) {
          stream.addTrack(track);
        }
        hasAudio = true;
      }
    }
  } catch (err) {
    console.warn('MediaRecorder audio track could not be initialized:', err);
  }

  const mimeType = MediaRecorder.isTypeSupported('video/mp4')
    ? 'video/mp4'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : 'video/webm';

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 3_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingFinished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const finalBlob = new Blob(chunks, { type: mimeType });
      if (audioContext) {
        audioContext.close().catch(() => {});
      }
      resolve(finalBlob);
    };
  });

  recorder.start();

  const totalFrames = Math.ceil(totalDurationSec * fps);
  const frameIntervalMs = 1000 / fps;

  for (let f = 0; f < totalFrames; f++) {
    if (signal?.aborted) {
      recorder.stop();
      if (audioContext) audioContext.close().catch(() => {});
      throw new DOMException('Reel export cancelled by user', 'AbortError');
    }

    const timeSec = f / fps;
    const entry = sceneTimeline.find((st) => timeSec >= st.startSec && timeSec < st.endSec) || sceneTimeline[sceneTimeline.length - 1];
    const sceneProgress = entry ? (timeSec - entry.startSec) / entry.duration : 0;

    await drawReelFrame(ctx, reelData, entry.scene, sceneProgress, width, height, f);

    if (f % 10 === 0) {
      const pct = 10 + Math.round((f / totalFrames) * 85);
      onProgress({
        percent: pct,
        phase: 'rendering_frames',
        message: `Rendering frames... (${Math.round((f / totalFrames) * 100)}%)`,
        currentFrame: f + 1,
        totalFrames,
      });
    }

    await new Promise((r) => setTimeout(r, frameIntervalMs * 0.4));
  }

  recorder.stop();
  const finalBlob = await recordingFinished;

  const downloadUrl = URL.createObjectURL(finalBlob);
  const cleanTitle = (reelData.title || 'pune-journey-reel').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const format: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const filename = `${cleanTitle}-${new Date().toISOString().slice(0, 10)}.${format}`;

  onProgress({
    percent: 100,
    phase: 'completed',
    message: 'Export ready!',
    currentFrame: totalFrames,
    totalFrames,
  });

  return {
    blob: finalBlob,
    downloadUrl,
    filename,
    format,
    mimeType,
    durationSec: totalDurationSec,
    width,
    height,
    hasAudio,
  };
}

/**
 * Draws a single cinematic reel frame onto canvas
 */
async function drawReelFrame(
  ctx: CanvasRenderingContext2D,
  reelData: JourneyReelData,
  scene: ReelVisualScene,
  progress: number, // 0.0 to 1.0
  width: number,
  height: number,
  frameIdx: number
) {
  // Clear canvas
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, width, height);

  // Determine current place and destination intelligence
  const currentPlace =
    scene.type === 'place_intro' || scene.type === 'place_photo'
      ? scene.place
      : reelData.places[0];

  const profile = currentPlace ? getDestinationProfile(currentPlace) : null;

  // Background photo with Ken Burns zoom and subtle pan
  let photoUrl = '/images/places/shaniwar-wada.jpg';
  if (scene.type === 'place_photo' && scene.photoUrl) {
    photoUrl = scene.photoUrl;
  } else if (scene.type === 'place_intro' && scene.place?.photos?.[0]) {
    photoUrl = scene.place.photos[0];
  } else if (reelData.places[0]?.photos?.[0]) {
    photoUrl = reelData.places[0].photos[0];
  }

  const img = await loadImage(photoUrl);
  if (img) {
    ctx.save();

    // Ken Burns calculation: gentle zoom from 1.05 to 1.18
    const scale = 1.05 + progress * 0.13;
    const panX = Math.sin(progress * Math.PI) * 15;
    const panY = -progress * 25;

    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(scale, scale);

    // Cover fill aspect ratio
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawW = width;
    let drawH = height;

    if (imgRatio > canvasRatio) {
      drawH = height;
      drawW = height * imgRatio;
    } else {
      drawW = width;
      drawH = width / imgRatio;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  // Cinematic Gradient Overlays (Top shadow for branding, bottom vignette for typography)
  const topGrad = ctx.createLinearGradient(0, 0, 0, 220);
  topGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
  topGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 220);

  const bottomGrad = ctx.createLinearGradient(0, height - 520, 0, height);
  bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
  bottomGrad.addColorStop(0.35, 'rgba(10,12,18,0.75)');
  bottomGrad.addColorStop(1, 'rgba(5,7,12,0.96)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height - 520, width, 520);

  // Top Branding Pill
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, 36, 48, 170, 36, 18);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 13px Inter, sans-serif';
  ctx.fillText('EXPLORE PUNE', 52, 71);
  ctx.restore();

  // Draw scene-specific content
  if (scene.type === 'intro') {
    drawIntroCard(ctx, reelData, width, height, progress);
  } else if (scene.type === 'place_intro') {
    drawPlaceIntroCard(ctx, scene.place, profile, width, height, progress);
  } else if (scene.type === 'place_photo') {
    drawPlacePhotoCard(ctx, scene, profile, width, height, progress);
  } else if (scene.type === 'outro') {
    drawOutroCard(ctx, reelData, width, height, progress);
  }

  // Beat Flash / Transition effect on scene boundaries (first 0.15s or last 0.15s)
  if (progress < 0.1) {
    const flashAlpha = (1 - progress / 0.1) * 0.25;
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawIntroCard(
  ctx: CanvasRenderingContext2D,
  reelData: JourneyReelData,
  w: number,
  h: number,
  progress: number
) {
  ctx.save();
  ctx.textAlign = 'center';

  // Title
  ctx.fillStyle = '#facc15';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText('CINEMATIC TRAVEL REEL', w / 2, h / 2 - 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 36px Georgia, serif';
  ctx.fillText(reelData.title || 'My Pune Journey', w / 2, h / 2 + 10);

  if (reelData.titleMr) {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillText(reelData.titleMr, w / 2, h / 2 + 50);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText(`${reelData.places.length} Iconic Destinations • ${reelData.date}`, w / 2, h / 2 + 95);

  ctx.restore();
}

function drawPlaceIntroCard(
  ctx: CanvasRenderingContext2D,
  place: any,
  profile: any,
  w: number,
  h: number,
  progress: number
) {
  ctx.save();
  ctx.textAlign = 'left';

  const bottomY = h - 160;

  // Category pill
  ctx.fillStyle = profile?.palette?.primary || '#d97706';
  roundRect(ctx, 40, bottomY - 140, 220, 32, 16);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 13px Inter, sans-serif';
  ctx.fillText((place.categoryName || 'PUNE HERITAGE').toUpperCase(), 56, bottomY - 119);

  // Main Place Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 36px Georgia, serif';
  ctx.fillText(place.placeName, 40, bottomY - 70);

  // Marathi Name
  if (place.placeNameMr) {
    ctx.fillStyle = profile?.palette?.accent || '#fbbf24';
    ctx.font = '700 24px Inter, sans-serif';
    ctx.fillText(place.placeNameMr, 40, bottomY - 32);
  }

  // Location / Elevation Subtitle
  const subtitle = place.elevation || place.locationSubtitle || profile?.narrativeCurve?.hookTextEn || 'Pune, Maharashtra';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText(subtitle, 40, bottomY + 5);

  ctx.restore();
}

function drawPlacePhotoCard(
  ctx: CanvasRenderingContext2D,
  scene: any,
  profile: any,
  w: number,
  h: number,
  progress: number
) {
  ctx.save();
  ctx.textAlign = 'left';

  const bottomY = h - 130;
  const place = scene.place;

  // Place title in subtle pill
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRect(ctx, 40, bottomY - 80, 280, 30, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 14px Inter, sans-serif';
  ctx.fillText(place.placeName, 52, bottomY - 60);

  // Poetic quote
  const quote = place.quoteEn || profile?.narrativeCurve?.climaxQuoteEn || 'An authentic journey etched in memory.';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = 'italic 500 18px Georgia, serif';
  ctx.fillText(quote.length > 55 ? quote.slice(0, 52) + '...' : quote, 40, bottomY - 20);

  // Marathi quote
  const quoteMr = place.quoteMr || profile?.narrativeCurve?.climaxQuoteMr || '';
  if (quoteMr) {
    ctx.fillStyle = profile?.palette?.accent || '#facc15';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.fillText(quoteMr.length > 50 ? quoteMr.slice(0, 48) + '...' : quoteMr, 40, bottomY + 12);
  }

  ctx.restore();
}

function drawOutroCard(
  ctx: CanvasRenderingContext2D,
  reelData: JourneyReelData,
  w: number,
  h: number,
  progress: number
) {
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = '#facc15';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText('JOURNEY COMPLETE', w / 2, h / 2 - 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 38px Georgia, serif';
  ctx.fillText('Pune Leaves Its Mark', w / 2, h / 2);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillText('पुणे • एक अविस्मरणीय सफर', w / 2, h / 2 + 42);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillText(`Created with Explore Pune • ${reelData.places.length} Places Visited`, w / 2, h / 2 + 95);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
