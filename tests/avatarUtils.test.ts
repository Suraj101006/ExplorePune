import { describe, it, expect } from 'vitest';
import {
  getUserInitials,
  sanitizeFileName,
  validateImageFile,
} from '../lib/avatarUtils';

describe('avatarUtils', () => {
  describe('getUserInitials', () => {
    it('extracts two uppercase initials from a full name', () => {
      expect(getUserInitials('Suraj Dhok')).toBe('SD');
      expect(getUserInitials('Ishan Kakade')).toBe('IK');
      expect(getUserInitials('Baji Rao Peshwa')).toBe('BP');
    });

    it('extracts initials from single word name', () => {
      expect(getUserInitials('Sahil')).toBe('SA');
      expect(getUserInitials('P')).toBe('P');
    });

    it('extracts initials from email address when name is missing', () => {
      expect(getUserInitials(null, 'suraj.dhok24@mmit.edu.in')).toBe('SD');
      expect(getUserInitials('', 'ishankakade@gmail.com')).toBe('IS');
      expect(getUserInitials(undefined, 'explorer_pune@domain.com')).toBe('EP');
    });

    it('falls back to default initials when both name and email are missing', () => {
      expect(getUserInitials(null, null)).toBe('EP');
      expect(getUserInitials('', '')).toBe('EP');
    });
  });

  describe('sanitizeFileName', () => {
    it('removes unsafe characters and path traversal', () => {
      expect(sanitizeFileName('../../etc/passwd.png')).toBe('passwd.png');
      expect(sanitizeFileName('my photo & avatar (1).jpg')).toBe('my_photo___avatar__1_.jpg');
      expect(sanitizeFileName('test/image.webp')).toBe('image.webp');
    });
  });

  describe('validateImageFile', () => {
    it('rejects files larger than 5 MB', async () => {
      const largeFile = new File(['x'.repeat(100)], 'huge.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      const result = await validateImageFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5 MB or less');
    });

    it('rejects forbidden MIME types', async () => {
      const exeFile = new File(['MZ90'], 'virus.exe', { type: 'application/x-msdownload' });
      const result = await validateImageFile(exeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    it('rejects corrupted or masqueraded file with bad magic bytes', async () => {
      // Masqueraded as JPEG in MIME but contains text
      const fakeJpeg = new File(['Hello world! Not a real jpeg image header.'], 'fake.jpg', {
        type: 'image/jpeg',
      });
      const result = await validateImageFile(fakeJpeg);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Image content is invalid or corrupted');
    });
  });
});
