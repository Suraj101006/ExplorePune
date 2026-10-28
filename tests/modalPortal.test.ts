import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { lockScroll, unlockScroll } from '../components/ModalPortal';

describe('ModalPortal Scroll Management & Viewport System', () => {
  let mockBody: any;
  let mockDocElement: any;
  let mockWindow: any;

  beforeEach(() => {
    const classList = new Set<string>();

    mockBody = {
      style: {
        overflow: '',
        paddingRight: '',
      },
      classList: {
        add: vi.fn((cls: string) => classList.add(cls)),
        remove: vi.fn((cls: string) => classList.delete(cls)),
        contains: vi.fn((cls: string) => classList.has(cls)),
      },
    };

    mockDocElement = {
      clientWidth: 1185,
      scrollTop: 0,
    };

    mockWindow = {
      scrollY: 0,
      pageYOffset: 0,
      innerWidth: 1200,
      scrollTo: vi.fn(),
    };

    (globalThis as any).document = {
      body: mockBody,
      documentElement: mockDocElement,
    };

    (globalThis as any).window = mockWindow;
  });

  afterEach(() => {
    // Ensure activeModalCount resets cleanly
    while (mockBody.classList.contains('modal-open')) {
      unlockScroll();
    }
  });

  it('locks background scroll, compensates scrollbar width, and adds modal-open class', () => {
    mockWindow.scrollY = 850;
    lockScroll();

    expect(mockBody.style.overflow).toBe('hidden');
    expect(mockBody.style.paddingRight).toBe('15px');
    expect(mockBody.classList.contains('modal-open')).toBe(true);

    unlockScroll();
    expect(mockBody.style.overflow).toBe('');
    expect(mockBody.style.paddingRight).toBe('');
    expect(mockBody.classList.contains('modal-open')).toBe(false);
  });

  it('preserves user scroll position when closing a modal after page scroll drift', () => {
    mockWindow.scrollY = 1420;
    lockScroll();

    // Simulate an unexpected scroll displacement while modal was open
    mockWindow.scrollY = 0;

    unlockScroll();
    expect(mockWindow.scrollTo).toHaveBeenCalledWith({
      top: 1420,
      behavior: 'instant',
    });
  });

  it('supports nested / stacked modals with reference counting without premature unlocking', () => {
    mockWindow.scrollY = 600;
    lockScroll(); // First modal opens
    expect(mockBody.classList.contains('modal-open')).toBe(true);

    lockScroll(); // Second modal opens (e.g., helper / picker inside reel modal)
    expect(mockBody.classList.contains('modal-open')).toBe(true);

    unlockScroll(); // Second modal closes
    // Scroll must still remain locked because the first modal is still open!
    expect(mockBody.classList.contains('modal-open')).toBe(true);
    expect(mockBody.style.overflow).toBe('hidden');

    unlockScroll(); // First modal closes
    // Now scroll is fully unlocked
    expect(mockBody.classList.contains('modal-open')).toBe(false);
    expect(mockBody.style.overflow).toBe('');
  });
});
