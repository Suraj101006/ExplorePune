/**
 * Explore Pune - Smart Location Permission Service
 * Handles browser permission lifecycles, secure context verification,
 * and user guidance for enabling device GPS.
 */

export type PermissionState =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported'
  | 'insecure_context'
  | 'unknown';

export interface PermissionStatusInfo {
  state: PermissionState;
  isAvailable: boolean;
  messageEn: string;
  messageMr: string;
  actionGuidanceEn: string;
  actionGuidanceMr: string;
}

export class LocationPermissionService {
  /**
   * Checks whether the current window origin is a secure context.
   * Browsers strictly gate navigator.geolocation behind HTTPS or localhost.
   */
  static isSecureContext(): boolean {
    if (typeof window === 'undefined') {
      return typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
    }
    // Test environments / about:blank
    if (!window.location?.hostname && (window.location?.protocol === 'about:' || window.location?.protocol === '')) {
      return true;
    }
    return (
      window.isSecureContext === true ||
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]'
    );
  }

  /**
   * Determines if Geolocation API is supported in the current browser.
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
  }

  /**
   * Queries browser permission state asynchronously if Permissions API is supported.
   */
  static async queryPermissionState(): Promise<PermissionStatusInfo> {
    if (!this.isSecureContext()) {
      return {
        state: 'insecure_context',
        isAvailable: false,
        messageEn: 'Location requires a secure connection (HTTPS).',
        messageMr: 'स्थान निश्चितीसाठी सुरक्षित (HTTPS) कनेक्शन आवश्यक आहे.',
        actionGuidanceEn: 'Please access the website over HTTPS (https://explorepune-guide.vercel.app).',
        actionGuidanceMr: 'कृपया HTTPS द्वारे वेबसाइट उघडा.',
      };
    }

    if (!this.isSupported()) {
      return {
        state: 'unsupported',
        isAvailable: false,
        messageEn: 'Geolocation is not supported by your browser.',
        messageMr: 'तुमचा ब्राउझर GPS स्थान समर्थन करत नाही.',
        actionGuidanceEn: 'Please use a modern browser such as Google Chrome, Apple Safari, or Mozilla Firefox.',
        actionGuidanceMr: 'कृपया आधुनिक ब्राउझर वापरा.',
      };
    }

    try {
      if (typeof navigator.permissions?.query === 'function') {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        const state = status.state as PermissionState;

        return this.describeState(state);
      }
    } catch {
      // Fallback for browsers without permission query for geolocation (e.g. Safari iOS)
    }

    return {
      state: 'prompt',
      isAvailable: true,
      messageEn: 'Location access is ready to request.',
      messageMr: 'स्थान परवानगी मागण्यासाठी तयार आहे.',
      actionGuidanceEn: 'Tap "Detect My Location" to grant GPS permission.',
      actionGuidanceMr: 'स्थान शोधण्यासाठी "माझे थेट स्थान" वर क्लिक करा.',
    };
  }

  /**
   * Translates permission states into actionable user explanations.
   */
  static describeState(state: PermissionState): PermissionStatusInfo {
    switch (state) {
      case 'granted':
        return {
          state: 'granted',
          isAvailable: true,
          messageEn: 'Location permission is granted.',
          messageMr: 'स्थान परवानगी मंजूर आहे.',
          actionGuidanceEn: 'High-accuracy device GPS is active.',
          actionGuidanceMr: 'थेट डिव्हाइस GPS सक्रिय आहे.',
        };

      case 'denied':
        return {
          state: 'denied',
          isAvailable: false,
          messageEn: 'Location permission was denied.',
          messageMr: 'स्थान परवानगी नाकारली गेली आहे.',
          actionGuidanceEn:
            'To enable: Click the lock / settings icon in your browser address bar > Permissions > Location > Allow, then refresh.',
          actionGuidanceMr:
            'सुरू करण्यासाठी: ब्राउझरच्या ॲड्रेस बारमधील कुलूप (Lock) चिन्हावर क्लिक करा > Site Settings > Location > Allow करा.',
        };

      case 'prompt':
      default:
        return {
          state: 'prompt',
          isAvailable: true,
          messageEn: 'Location permission will be prompted.',
          messageMr: 'ब्राउझर स्थान परवानगी विचारेल.',
          actionGuidanceEn: 'Tap Allow when your browser prompts for device location.',
          actionGuidanceMr: 'ब्राउझरने विचारल्यावर "Allow" निवडा.',
        };
    }
  }

  /**
   * Formats GeolocationPositionError into clear diagnostic feedback.
   */
  static handlePositionError(err: GeolocationPositionError, isMr = false): string {
    switch (err.code) {
      case 1:
        return isMr
          ? 'स्थान परवानगी नाकारली गेली आहे. कृपया ब्राउझर सेटिंग्जमधून परवानगी द्या.'
          : 'Location permission denied. Please allow location access in your browser address bar.';

      case 2:
        return isMr
          ? 'GPS सिग्नल अनुपलब्ध आहे. कृपया डिव्हाइसचे Location Services सुरू असल्याची खात्री करा.'
          : 'GPS position unavailable. Please ensure your device Location Services are turned on.';

      case 3:
        return isMr
          ? 'GPS प्रतिसाद वेळ संपली (Timeout). कृपया मोकळ्या जागेत जाऊन पुन्हा प्रयत्न करा.'
          : 'GPS acquisition timed out. Please try again or move to an area with clear sky view.';

      default:
        return isMr
          ? 'स्थान निश्चित करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : err.message || 'An unknown error occurred while detecting location.';
    }
  }
}
