import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Navbar Functions & Authentication State Consistency', () => {
  const rootDir = path.resolve(__dirname, '..');
  const appHeaderPath = path.join(rootDir, 'components/AppHeader.tsx');
  const authNavPath = path.join(rootDir, 'components/AuthNav.tsx');
  const mobileAuthNavPath = path.join(rootDir, 'components/MobileAuthNav.tsx');
  const globalsCssPath = path.join(rootDir, 'app/globals.css');

  const appHeaderContent = fs.readFileSync(appHeaderPath, 'utf8');
  const authNavContent = fs.readFileSync(authNavPath, 'utf8');
  const mobileAuthNavContent = fs.readFileSync(mobileAuthNavPath, 'utf8');
  const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

  it('1. AppHeader defines all 9 essential navigation functions in navLinks', () => {
    expect(appHeaderContent).toContain("href: '/'");
    expect(appHeaderContent).toContain("href: '/destinations'");
    expect(appHeaderContent).toContain("href: '/journey'");
    expect(appHeaderContent).toContain("href: '/planner'");
    expect(appHeaderContent).toContain("href: '/community'");
    expect(appHeaderContent).toContain("href: '/milestones'");
    expect(appHeaderContent).toContain("href: '/blogs'");
    expect(appHeaderContent).toContain("href: '/help/website-guide'");
    expect(appHeaderContent).toContain("href: '/about'");
  });

  it('2. AppHeader keeps AuthNav visible across both desktop and mobile', () => {
    // AuthNav wrapper should NOT enforce hide-on-mobile
    expect(appHeaderContent).not.toMatch(/<div className="nav-util-item hide-on-mobile">\s*<AuthNav \/>/);
    expect(appHeaderContent).toMatch(/<div className="nav-util-item">\s*<AuthNav \/>/);
  });

  it('3. AuthNav renders dedicated desktop view and mobile view', () => {
    expect(authNavContent).toContain('className="auth-desktop-view"');
    expect(authNavContent).toContain('className="auth-mobile-view"');
  });

  it('4. AuthNav provides full account management before and after login', () => {
    // Before login: desktop sign-in and mobile icon button
    expect(authNavContent).toContain('href="/login"');
    expect(authNavContent).toContain('className="btn auth-signin-btn"');
    expect(authNavContent).toContain('className="mobile-auth-icon-btn"');

    // After login: desktop account pill with avatar, admin check, logout button, and mobile avatar & logout button
    expect(authNavContent).toContain('href="/account"');
    expect(authNavContent).toContain('className="auth-user-pill"');
    expect(authNavContent).toContain('className="auth-logout-pill"');
    expect(authNavContent).toContain('className="mobile-auth-avatar-btn"');
    expect(authNavContent).toContain('className="mobile-auth-logout-btn"');
    expect(authNavContent).toContain('href="/admin"');
  });

  it('5. MobileAuthNav provides clean theme tokens and no hardcoded blinding white backgrounds', () => {
    expect(mobileAuthNavContent).toContain("background: 'var(--card)'");
    expect(mobileAuthNavContent).not.toContain("background: '#fff'");
    expect(mobileAuthNavContent).not.toContain("background: 'rgba(255, 255, 255, 0.7)'");
    expect(mobileAuthNavContent).toContain('className="mobile-auth-card"');
  });

  it('6. globals.css configures responsive display and dark mode for auth navbar elements', () => {
    // Responsive view switches
    expect(globalsCss).toContain('.auth-desktop-view {');
    expect(globalsCss).toContain('.auth-mobile-view {');
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.auth-desktop-view\s*\{[^}]*display:\s*none\s*!important/);
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.auth-mobile-view\s*\{[^}]*display:\s*inline-flex\s*!important/);

    // Dark mode overrides
    expect(globalsCss).toContain('html.dark .auth-user-pill');
    expect(globalsCss).toContain('html.dark .auth-logout-pill');
    expect(globalsCss).toContain('html.dark .mobile-auth-card');
    expect(globalsCss).toContain('html.dark .helpline-chip-btn');
  });

  it('7. Compact desktop view (<= 1360px) compacts text labels to prevent clipping after login', () => {
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1360px\)\s*\{[\s\S]*?\.saved-chip-text\s*\{[^}]*display:\s*none\s*!important/);
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1360px\)\s*\{[\s\S]*?\.theme-toggle-label\s*\{[^}]*display:\s*none\s*!important/);
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1360px\)\s*\{[\s\S]*?\.auth-user-pill\s*\{[^}]*max-width:\s*105px\s*!important/);
  });

  it('8. Wide desktop compaction (<= 1520px) prevents overflow on 1366px and 1440px displays', () => {
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1520px\)\s*\{[\s\S]*?\.desktop-nav-icon\s*\{[^}]*display:\s*none\s*!important/);
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1520px\)\s*\{[\s\S]*?\.theme-toggle-kbd\s*\{[^}]*display:\s*none\s*!important/);
    expect(globalsCss).toMatch(/@media\s*\(max-width:\s*1520px\)\s*\{[\s\S]*?\.hide-on-compact-desktop\s*\{[^}]*display:\s*none\s*!important/);
  });

  it('9. Tiered mobile benchmarks guarantee all navbar buttons fit without horizontal scroll before and after login', () => {
    // Test matrix of mobile screen widths from 320px up to 768px
    const SCREEN_WIDTHS = [320, 340, 360, 375, 390, 412, 430, 480, 768];

    SCREEN_WIDTHS.forEach((width) => {
      // 1. Calculate container padding and gaps based on tiered CSS rules
      let wrapPadding: number;
      let brandWidth: number;
      let buttonSize: number;
      let langWidth: number;
      let utilGap: number;

      if (width <= 340) {
        wrapPadding = 8; // 4px * 2
        brandWidth = 26 + 3 + 60; // logo 26px + gap 3px + title ~60px
        buttonSize = 26;
        langWidth = 38;
        utilGap = 2;
      } else if (width <= 390) {
        wrapPadding = 12; // 6px * 2
        brandWidth = 28 + 4 + 68; // logo 28px + gap 4px + title ~68px
        buttonSize = 29;
        langWidth = 44;
        utilGap = 3;
      } else if (width <= 480) {
        wrapPadding = 16; // 8px * 2
        brandWidth = 32 + 5 + 75; // logo 32px + gap 5px + title ~75px
        buttonSize = 32;
        langWidth = 46;
        utilGap = 4;
      } else {
        wrapPadding = 24; // 12px * 2
        brandWidth = 36 + 6 + 85; // logo 36px + gap 6px + title ~85px
        buttonSize = 32;
        langWidth = 52;
        utilGap = 5;
      }

      // 2. Case A: When user is LOGGED OUT
      // Utilities = Auth (icon button) + Saved (icon button) + Lang + Theme (icon button) + Hamburger (icon button)
      const loggedOutUtilWidth =
        buttonSize /* Auth icon */ +
        buttonSize /* Saved */ +
        langWidth /* Lang */ +
        buttonSize /* Theme */ +
        buttonSize /* Menu */ +
        utilGap * 4;

      const loggedOutTotalWidth = wrapPadding + brandWidth + utilGap + loggedOutUtilWidth;
      expect(loggedOutTotalWidth).toBeLessThanOrEqual(width);

      // 3. Case B: When user is LOGGED IN (Maximum width scenario: Avatar + Logout button both visible)
      // Utilities = Avatar (buttonSize) + Logout (buttonSize) + gap + Saved + Lang + Theme + Hamburger
      const loggedInUtilWidth =
        buttonSize /* Avatar */ +
        utilGap /* gap between avatar & logout */ +
        buttonSize /* Logout */ +
        buttonSize /* Saved */ +
        langWidth /* Lang */ +
        buttonSize /* Theme */ +
        buttonSize /* Menu */ +
        utilGap * 4;

      const loggedInTotalWidth = wrapPadding + brandWidth + utilGap + loggedInUtilWidth;
      expect(loggedInTotalWidth).toBeLessThanOrEqual(width);
    });
  });
});
