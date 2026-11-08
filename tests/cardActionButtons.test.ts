import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Home Page Card Action Buttons (Sound & Bookmark Icons)', () => {
  const homeExplorerPath = path.resolve(__dirname, '../components/HomeExplorer.tsx');
  const globalsCssPath = path.resolve(__dirname, '../app/globals.css');

  const homeExplorerContent = fs.readFileSync(homeExplorerPath, 'utf8');
  const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

  it('ensures Volume2 icon does not use invisible white (#ffffff) fallback', () => {
    // Before fix: <Volume2 size={15} color={speakingId === p.id ? '#059669' : '#ffffff'} />
    expect(homeExplorerContent).not.toMatch(/Volume2[^>]*color=\{[^}]*#ffffff/);
    expect(homeExplorerContent).toMatch(/Volume2[^>]*color=\{[^}]*currentColor/);
  });

  it('ensures Bookmark icon does not use invisible white (#ffffff) fallback', () => {
    // Before fix: <Bookmark size={15} fill={isSaved ? '#ea580c' : 'none'} color={isSaved ? '#ea580c' : '#ffffff'} />
    expect(homeExplorerContent).not.toMatch(/Bookmark[^>]*color=\{[^}]*#ffffff/);
    expect(homeExplorerContent).toMatch(/Bookmark[^>]*color=\{[^}]*currentColor/);
    expect(homeExplorerContent).toMatch(/fill=\{isSaved \? '#e11d48' : 'none'\}/);
  });

  it('ensures action buttons are elevated above photo stack layers (zIndex: 10)', () => {
    expect(homeExplorerContent).toMatch(/card-action-sound[\s\S]*?style=\{\{[^}]*zIndex:\s*10/);
    expect(homeExplorerContent).toMatch(/card-action-bookmark[\s\S]*?style=\{\{[^}]*zIndex:\s*10/);
  });

  it('ensures card action buttons have dedicated sound & bookmark classes in globals.css', () => {
    expect(globalsCssContent).toContain('.card-action-btn');
    expect(globalsCssContent).toContain('.card-action-sound');
    expect(globalsCssContent).toContain('.card-action-bookmark');
    expect(globalsCssContent).toContain('.card-action-sound.active-speaking');
    expect(globalsCssContent).toContain('.card-action-btn.active-saved');
  });

  it('ensures globals.css sets accessible high-contrast ink color for card action buttons', () => {
    expect(globalsCssContent).toMatch(/\.card-action-btn\s*\{[^}]*color:\s*#1e293b/);
  });

  it('ensures dynamic accessible labels are applied to both action buttons', () => {
    expect(homeExplorerContent).toMatch(/aria-label=\{isMr \? `\$\{p\.name_mr \|\| p\.name\} चा पुणेरी उच्चार ऐका`/);
    expect(homeExplorerContent).toMatch(/aria-label=\{isSaved/);
  });
});
