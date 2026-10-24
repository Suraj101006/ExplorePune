import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shareOrCopy } from '../lib/shareUtils';

describe('shareOrCopy utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses navigator.share when available and succeeds', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      share: mockShare,
    });

    const result = await shareOrCopy({
      title: 'Pune Heritage Trail',
      text: 'Explore Shaniwar Wada',
      url: 'https://exploringpune.com/community?post=123',
    });

    expect(result).toBe('shared');
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Pune Heritage Trail',
      text: 'Explore Shaniwar Wada',
      url: 'https://exploringpune.com/community?post=123',
    });
  });

  it('handles user abort/dismiss on native share sheet without crashing', async () => {
    const abortErr = new Error('Share canceled');
    abortErr.name = 'AbortError';
    const mockShare = vi.fn().mockRejectedValue(abortErr);
    vi.stubGlobal('navigator', {
      share: mockShare,
    });

    const result = await shareOrCopy({
      title: 'Pune Heritage Trail',
      url: 'https://exploringpune.com/community?post=123',
    });

    expect(result).toBe('failed');
  });

  it('falls back to navigator.clipboard.writeText when navigator.share is unavailable', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const result = await shareOrCopy({
      title: 'Sinhagad Fort',
      url: 'https://exploringpune.com/journey',
    });

    expect(result).toBe('copied');
    expect(mockWriteText).toHaveBeenCalledWith('https://exploringpune.com/journey');
  });

  it('falls back to textarea execCommand when clipboard API fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });

    const mockTextArea = {
      value: '',
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      focus: vi.fn(),
      select: vi.fn(),
    };

    const mockBody = {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };

    vi.stubGlobal('document', {
      createElement: vi.fn().mockReturnValue(mockTextArea),
      body: mockBody,
      execCommand: vi.fn().mockReturnValue(true),
    });

    const result = await shareOrCopy({
      title: 'Pune Trail',
      url: 'https://exploringpune.com/journey',
    });

    expect(result).toBe('copied');
    expect(mockBody.appendChild).toHaveBeenCalledWith(mockTextArea);
    expect(mockBody.removeChild).toHaveBeenCalledWith(mockTextArea);
  });
});
