'use client';

/**
 * Browser-native Web Speech API pronunciation engine for Pune landmarks.
 * 100% free, runs client-side, zero external API keys required.
 */
export function speakPlaceName(name: string, isMarathi: boolean = false): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = name.replace(/[\(\)•–—]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Try finding a Marathi or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    if (isMarathi) {
      const mrVoice = voices.find(
        (v) => v.lang.startsWith('mr') || v.lang.startsWith('hi') || v.name.includes('India')
      );
      if (mrVoice) utterance.voice = mrVoice;
      utterance.lang = mrVoice?.lang || 'mr-IN';
      utterance.rate = 0.88; // Slightly deliberate for clear Devanagari pronunciation
      utterance.pitch = 1.0;
    } else {
      const inVoice = voices.find((v) => v.lang === 'en-IN' || v.name.includes('India'));
      if (inVoice) utterance.voice = inVoice;
      utterance.lang = inVoice?.lang || 'en-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
}
