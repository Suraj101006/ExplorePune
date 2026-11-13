import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Chatbot Responsive Design & Mobile Usability Verification', () => {
  const globalsCss = fs.readFileSync(path.resolve(__dirname, '../app/globals.css'), 'utf8');
  const chatWidgetTsx = fs.readFileSync(path.resolve(__dirname, '../components/ChatWidget.tsx'), 'utf8');

  it('1. integrates BrandLogo into both floating action button and chat header', () => {
    expect(chatWidgetTsx).toContain("import BrandLogo from '@/components/BrandLogo';");
    expect(chatWidgetTsx).toContain('<BrandLogo size={24} withBadge alt="Explore Pune AI" />');
    expect(chatWidgetTsx).toContain('<BrandLogo size={32} withBadge alt="Explore Pune Assistant" />');
  });

  it('2. provides mobile backdrop overlay and body scroll locking when chat is open', () => {
    expect(chatWidgetTsx).toContain('className="chat-backdrop"');
    expect(chatWidgetTsx).toContain('document.body.style.overflow = \'hidden\';');
    expect(globalsCss).toContain('.chat-backdrop {');
    expect(globalsCss).toContain('backdrop-filter: blur(4px);');
  });

  it('3. enforces mobile drawer breakpoint at max-width: 768px with safe-area insets', () => {
    expect(globalsCss).toContain('@media (max-width: 768px)');
    expect(globalsCss).toContain('env(safe-area-inset-bottom, 0px)');
    expect(globalsCss).toContain('env(safe-area-inset-top, 0px)');
    expect(globalsCss).toContain('.chat-mobile-drag-handle');
  });

  it('4. sets input font-size to 16px on mobile to prevent iOS Safari auto-zoom jumping', () => {
    const mobileIndex = globalsCss.indexOf('/* Mobile & Tablet Full Responsive Layouts for Chatbot */');
    expect(mobileIndex).toBeGreaterThan(-1);
    const mobileSection = globalsCss.slice(mobileIndex, mobileIndex + 2500);
    expect(mobileSection).toContain('.chat-input-field');
    expect(mobileSection).toContain('16px');
  });

  it('5. provides compact landscape adaptation for rotated mobile devices', () => {
    expect(globalsCss).toContain('@media (max-height: 520px) and (orientation: landscape)');
  });

  it('6. ensures interactive touch targets meet accessibility standards (>= 40px)', () => {
    expect(globalsCss).toContain('.chat-loc-btn {');
    expect(globalsCss).toContain('min-height: 40px;');
    expect(globalsCss).toContain('.chat-send-btn {');
    expect(globalsCss).toContain('min-height: 40px;');
  });

  it('7. defines high-contrast dark theme rules for backdrop, cards, starters, and inputs', () => {
    expect(globalsCss).toContain('html.dark .chat-starter-btn');
    expect(globalsCss).toContain('html.dark .chat-loc-btn');
    expect(globalsCss).toContain('html.dark .chat-backdrop');
    expect(globalsCss).toContain('html.dark .chat-input-field');
  });

  it('8. handles escape key press to cleanly close chat panel', () => {
    expect(chatWidgetTsx).toContain("e.key === 'Escape'");
  });
});
