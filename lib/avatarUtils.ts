/**
 * Profile Avatar & Image Processing Utilities
 * Provides secure file validation (magic numbers + MIME), dimension bounds checking,
 * safe canvas-based 1:1 square cropping, EXIF stripping, and initials generation.
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  format?: 'jpeg' | 'png' | 'webp';
  width?: number;
  height?: number;
}

export interface CropCoordinates {
  x: number;
  y: number;
  size: number;
}

/**
 * Validates an image file before upload:
 * 1. Checks file size (<= 5 MB)
 * 2. Checks MIME type
 * 3. Inspects magic byte signatures to prevent masqueraded files (.exe, .html, .svg)
 * 4. Decodes image safely into an Image object to verify dimensions and prevent decompression attacks
 */
export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  // 1. File size check (Max 5 MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size must be 5 MB or less (selected image is ${sizeMb} MB).`,
    };
  }

  // 2. MIME type check
  const lowerMime = (file.type || '').toLowerCase();
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(lowerMime)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, PNG, or WebP image.',
    };
  }

  if (file.size < 12) {
    return {
      valid: false,
      error: 'File appears empty or corrupted.',
    };
  }

  // 3. Magic number verification (inspect binary header)
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // JPEG signature: FF D8 FF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    // WebP signature: RIFF (52 49 46 46) .... WEBP (57 45 42 50)
    const isWebP =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebP) {
      return {
        valid: false,
        error: 'Image content is invalid or corrupted. Only genuine JPG, PNG, and WebP files are accepted.',
      };
    }

    const detectedFormat: 'jpeg' | 'png' | 'webp' = isJpeg ? 'jpeg' : isPng ? 'png' : 'webp';

    // 4. Decode into Image object safely to verify dimensions
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        // Guard against decompression bombs / absurd dimensions
        if (img.naturalWidth > 8000 || img.naturalHeight > 8000) {
          reject(new Error('Image dimensions exceed the 8000px maximum limit.'));
        } else if (img.naturalWidth < 16 || img.naturalHeight < 16) {
          reject(new Error('Image is too small (minimum 16x16 pixels).'));
        } else {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Unable to decode image data safely.'));
      };
      img.src = objectUrl;
    });

    return {
      valid: true,
      format: detectedFormat,
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || 'Image validation failed.',
    };
  }
}

/**
 * Extracts clean 2-letter uppercase initials from user name or email.
 * e.g. "Suraj Dhok" -> "SD", "Ishan Kakade" -> "IK", "surajdhok1010@gmail.com" -> "SD"
 */
export function getUserInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const clean = name.trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts[0].length >= 2) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return parts[0].toUpperCase();
  }

  if (email && email.trim()) {
    const local = email.trim().split('@')[0];
    const parts = local.split(/[._-]/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.slice(0, 2).toUpperCase();
  }

  return 'EP'; // Explore Pune default
}

/**
 * Sanitizes a filename to prevent path traversal or special character injection
 */
export function sanitizeFileName(name: string): string {
  // Strip path traversal and directories
  const baseName = name.split(/[/\\]/).pop() || 'image';
  return baseName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 80);
}

/**
 * Renders an image crop to an offscreen canvas and compresses it to a safe JPEG data URL.
 * Automatically strips EXIF, geolocation metadata, scripts, and extra headers.
 */
export function cropAndCompressAvatar(
  img: HTMLImageElement,
  crop: CropCoordinates,
  outputSize = 400,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas 2D context is not available.'));
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the selected crop region to the square canvas
      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.size,
        crop.size,
        0,
        0,
        outputSize,
        outputSize
      );

      // Export safe, sanitized JPEG data
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    } catch (err) {
      reject(err);
    }
  });
}
