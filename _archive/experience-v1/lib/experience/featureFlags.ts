/**
 * Experience Platform Feature Flags
 * Ensures safe progressive rollout and runtime configuration
 */

export interface ExperienceFeatureFlags {
  enablePuneThroughTimeRebuild: boolean;
  enableLiteModeByDefault: boolean;
  enableSoundByDefault: boolean;
  enableDebugTelemetry: boolean;
}

export const DEFAULT_EXPERIENCE_FEATURE_FLAGS: ExperienceFeatureFlags = {
  enablePuneThroughTimeRebuild: true,
  enableLiteModeByDefault: false,
  enableSoundByDefault: false, // Strict Hard Rule #3: Never autoplay
  enableDebugTelemetry: false,
};

export function resolveExperienceFlags(searchParams?: URLSearchParams): ExperienceFeatureFlags {
  const flags = { ...DEFAULT_EXPERIENCE_FEATURE_FLAGS };

  if (typeof window !== 'undefined') {
    const params = searchParams || new URLSearchParams(window.location.search);

    // Lite Mode check (?lite=1 or stored preference)
    if (params.get('lite') === '1' || params.get('calm') === '1') {
      flags.enableLiteModeByDefault = true;
    } else {
      try {
        const storedLite = localStorage.getItem('explore_pune_lite_mode');
        if (storedLite === 'true') {
          flags.enableLiteModeByDefault = true;
        }
      } catch (e) {}
    }

    // Force legacy fallback (?legacy=1) if needed during development
    if (params.get('legacy') === '1') {
      flags.enablePuneThroughTimeRebuild = false;
    }

    if (params.get('debug') === '1') {
      flags.enableDebugTelemetry = true;
    }
  }

  return flags;
}
