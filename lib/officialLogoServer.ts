import fs from 'fs';
import path from 'path';

export const OFFICIAL_LOGO_PATH = '/assets/explore-pune-logo.png';
export const OFFICIAL_LOGO_CDN_URL = 'https://explorepune-guide.vercel.app/assets/explore-pune-logo.png';

/**
 * Resolves the absolute disk path of the official Explore Pune logo
 */
export function getOfficialLogoDiskPath(): string | null {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'explore-pune-logo.png');
  try {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  } catch {
    // Fallback
  }
  return null;
}

/**
 * Returns the official logo as a base64 Data URL (data:image/png;base64,...)
 * for high-resolution embedding in jsPDF, HTML emails, and static generators.
 */
export function getOfficialLogoBase64DataUrl(): string | null {
  try {
    const diskPath = getOfficialLogoDiskPath();
    if (!diskPath) return null;
    const buf = fs.readFileSync(diskPath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch (err) {
    console.warn('[OfficialLogoServer] Could not load logo base64:', err);
    return null;
  }
}
