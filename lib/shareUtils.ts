/**
 * Explore Pune - Cross-device Web Share & Clipboard Utility
 * Safely handles mobile native sharing (WhatsApp, X, Telegram), modern Clipboard API,
 * and textarea execCommand fallback for unrestricted compatibility.
 */

export interface ShareOptions {
  title: string;
  text?: string;
  url: string;
}

export async function shareOrCopy(options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> {
  // 1. Try Mobile Native Web Share API (Android, iOS Safari, etc.)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: options.title,
        text: options.text || options.title,
        url: options.url,
      });
      return 'shared';
    } catch (err: any) {
      // User tapped Cancel / dismissed share sheet -> do not fail, fall through or return
      if (err?.name === 'AbortError') {
        return 'failed';
      }
      console.warn('[ShareUtils] Native share failed, falling back to clipboard:', err);
    }
  }

  // 2. Try modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(options.url);
      return 'copied';
    } catch (err) {
      console.warn('[ShareUtils] Clipboard writeText failed, trying DOM fallback:', err);
    }
  }

  // 3. Fallback to hidden DOM textarea with execCommand('copy')
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = options.url;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) return 'copied';
    } catch (err) {
      console.error('[ShareUtils] DOM copy fallback failed:', err);
    }
  }

  return 'failed';
}
