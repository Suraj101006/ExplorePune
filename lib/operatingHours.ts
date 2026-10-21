/**
 * Operating Hours Status Evaluator for Pune attractions.
 * Computes live open/closed status in Indian Standard Time (IST, UTC+5:30).
 */

export interface OperatingStatus {
  isOpen: boolean;
  is24x7?: boolean;
  statusTextEn: string;
  statusTextMr: string;
  badgeClass: 'open' | 'closed' | 'open-24';
  detailEn: string;
  detailMr: string;
}

export function getOperatingStatus(place: any): OperatingStatus {
  // Current time in IST (UTC+5:30)
  const now = new Date();
  const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utcMillis + 5.5 * 3600000);

  const currentDay = istDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const currentMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  const formatTime12h = (hhmm: string): string => {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m < 10 ? '0' : ''}${m} ${suffix}`;
  };

  const formatTimeMr = (hhmm: string): string => {
    const [h, m] = hhmm.split(':').map(Number);
    const prefix = h < 12 ? 'सकाळी' : h < 16 ? 'दुपारी' : h < 20 ? 'संध्याकाळी' : 'रात्री';
    const hour12 = h % 12 || 12;
    return `${prefix} ${hour12}:${m < 10 ? '0' : ''}${m}`;
  };

  // 1. Check exact structured place_hours
  if (Array.isArray(place.place_hours) && place.place_hours.length > 0) {
    const todaySchedule = place.place_hours.find((s: any) => s.day_of_week === currentDay);

    if (todaySchedule) {
      if (todaySchedule.is_closed) {
        return {
          isOpen: false,
          statusTextEn: 'Closed Today',
          statusTextMr: 'आज बंद आहे',
          badgeClass: 'closed',
          detailEn: 'Closed for public on this day of the week',
          detailMr: 'आजच्या वारी पर्यटकांसाठी प्रवेश बंद असतो',
        };
      }

      if (todaySchedule.opens_at && todaySchedule.closes_at) {
        const [oH, oM] = todaySchedule.opens_at.split(':').map(Number);
        const [cH, cM] = todaySchedule.closes_at.split(':').map(Number);
        const openMin = oH * 60 + oM;
        const closeMin = cH * 60 + cM;

        if (currentMinutes >= openMin && currentMinutes < closeMin) {
          const closesStr = formatTime12h(todaySchedule.closes_at);
          const closesStrMr = formatTimeMr(todaySchedule.closes_at);
          return {
            isOpen: true,
            statusTextEn: `Open Now • Closes ${closesStr}`,
            statusTextMr: `सध्या सुरू • ${closesStrMr} पर्यंत`,
            badgeClass: 'open',
            detailEn: `Operating hours today: ${formatTime12h(todaySchedule.opens_at)} - ${closesStr}`,
            detailMr: `आजची वेळ: ${formatTimeMr(todaySchedule.opens_at)} ते ${closesStrMr}`,
          };
        } else {
          const opensStr = formatTime12h(todaySchedule.opens_at);
          const opensStrMr = formatTimeMr(todaySchedule.opens_at);
          return {
            isOpen: false,
            statusTextEn: `Closed Now • Opens ${opensStr}`,
            statusTextMr: `सध्या बंद • ${opensStrMr} वाजता उघडेल`,
            badgeClass: 'closed',
            detailEn: `Operating hours today: ${opensStr} - ${formatTime12h(todaySchedule.closes_at)}`,
            detailMr: `आजची वेळ: ${opensStrMr} ते ${formatTimeMr(todaySchedule.closes_at)}`,
          };
        }
      }
    }
  }

  // 2. Category Heuristics
  const cat = (place.category_slug || place.category || '').toLowerCase();
  const slug = (place.slug || place.id || '').toLowerCase();

  // Natural tekdis, dams, and ghat viewpoints are open around the clock or dawn-to-dusk
  if (slug.includes('tekdi') || slug.includes('ghat') || slug.includes('viewpoint') || slug.includes('dam')) {
    if (currentMinutes >= 330 && currentMinutes <= 1170) {
      // 5:30 AM to 7:30 PM daylight
      return {
        isOpen: true,
        statusTextEn: 'Open (Daylight Hours)',
        statusTextMr: 'सुरू (दिवसाची वेळ)',
        badgeClass: 'open',
        detailEn: 'Best visited between sunrise and sunset (6:00 AM - 7:00 PM)',
        detailMr: 'सूर्योदय ते सूर्यास्त दरम्यान भेट देणे उत्तम (सकाळी ६:०० ते संध्याकाळी ७:००)',
      };
    } else {
      return {
        isOpen: false,
        statusTextEn: 'Night Hours (Visit at Dawn)',
        statusTextMr: 'रात्र काळ (पहाटे भेट द्या)',
        badgeClass: 'closed',
        detailEn: 'Not recommended for hiking after dark. Reopens at dawn (6:00 AM)',
        detailMr: 'अंधारात ट्रेकिंग करणे टाळावे. सकाळी ६:०० वाजता भेट द्या',
      };
    }
  }

  // Forts: generally 06:00 - 18:00
  if (cat === 'forts' || slug.includes('fort')) {
    const fortOpen = 6 * 60; // 6:00 AM
    const fortClose = 18 * 60; // 6:00 PM
    if (currentMinutes >= fortOpen && currentMinutes < fortClose) {
      return {
        isOpen: true,
        statusTextEn: 'Open Now • Closes 6:00 PM',
        statusTextMr: 'सध्या सुरू • संध्याकाळी ६:०० पर्यंत',
        badgeClass: 'open',
        detailEn: 'Forest department gates open daily 6:00 AM to 6:00 PM',
        detailMr: 'वन विभागाचे मुख्य प्रवेशद्वार दररोज सकाळी ६:०० ते संध्याकाळी ६:०० सुरू असते',
      };
    } else {
      return {
        isOpen: false,
        statusTextEn: 'Closed for Night • Opens 6:00 AM',
        statusTextMr: 'रात्री बंद • सकाळी ६:०० वाजता उघडेल',
        badgeClass: 'closed',
        detailEn: 'Sahyadri forest gates are closed overnight for visitor safety',
        detailMr: 'पर्यटकांच्या सुरक्षिततेसाठी रात्री प्रवेशद्वार बंद असते',
      };
    }
  }

  // Temples: generally 06:00 - 21:30
  if (cat === 'temples' || slug.includes('mandir') || slug.includes('temple')) {
    const templeOpen = 6 * 60;
    const templeClose = 21 * 60 + 30;
    if (currentMinutes >= templeOpen && currentMinutes < templeClose) {
      return {
        isOpen: true,
        statusTextEn: 'Open Now • Closes 9:30 PM',
        statusTextMr: 'सध्या दर्शन सुरू • रात्री ९:३० पर्यंत',
        badgeClass: 'open',
        detailEn: 'Darshan timings: 6:00 AM to 9:30 PM daily (Aarti at morning & evening)',
        detailMr: 'दर्शन वेळ: दररोज सकाळी ६:०० ते रात्री ९:३० (सकाळ-संध्याकाळ आरती)',
      };
    } else {
      return {
        isOpen: false,
        statusTextEn: 'Closed for Night • Opens 6:00 AM',
        statusTextMr: 'रात्री बंद • सकाळी ६:०० वाजता उघडेल',
        badgeClass: 'closed',
        detailEn: 'Mandir sanctum reopens for early morning Kakad Aarti at 6:00 AM',
        detailMr: 'सकाळी ६:०० वाजता काकड आरतीसाठी मंदिर उघडेल',
      };
    }
  }

  // Museums: 10:00 - 17:30 (Closed Mondays)
  if (cat === 'museums' || slug.includes('museum')) {
    if (currentDay === 1) {
      // Monday
      return {
        isOpen: false,
        statusTextEn: 'Closed on Mondays',
        statusTextMr: 'सोमवारी साप्ताहिक सुट्टी',
        badgeClass: 'closed',
        detailEn: 'Most government & trust museums in Pune remain closed on Mondays',
        detailMr: 'पुण्यातील बहुतांश वस्तुसंग्रहालये सोमवारी बंद असतात',
      };
    }
    const musOpen = 10 * 60;
    const musClose = 17 * 60 + 30;
    if (currentMinutes >= musOpen && currentMinutes < musClose) {
      return {
        isOpen: true,
        statusTextEn: 'Open Now • Closes 5:30 PM',
        statusTextMr: 'सध्या सुरू • संध्याकाळी ५:३० पर्यंत',
        badgeClass: 'open',
        detailEn: 'Exhibition galleries open 10:00 AM to 5:30 PM',
        detailMr: 'दालने सकाळी १०:०० ते संध्याकाळी ५:३० खुली असतात',
      };
    } else {
      return {
        isOpen: false,
        statusTextEn: 'Closed Now • Opens 10:00 AM',
        statusTextMr: 'सध्या बंद • सकाळी १०:०० वाजता उघडेल',
        badgeClass: 'closed',
        detailEn: 'Galleries open Tuesday-Sunday at 10:00 AM',
        detailMr: 'मंगळवार ते रविवार सकाळी १०:०० वाजता उघडेल',
      };
    }
  }

  // Default Standard Sightseeing: 09:30 - 18:00
  const defOpen = 9 * 60 + 30;
  const defClose = 18 * 60;
  if (currentMinutes >= defOpen && currentMinutes < defClose) {
    return {
      isOpen: true,
      statusTextEn: 'Open Now (Approx. Timings)',
      statusTextMr: 'सध्या सुरू (अंदाजे वेळ)',
      badgeClass: 'open',
      detailEn: 'Standard public entry hours: 9:30 AM - 6:00 PM',
      detailMr: 'सामान्य प्रवेश वेळ: सकाळी ९:३० ते संध्याकाळी ६:००',
    };
  } else {
    return {
      isOpen: false,
      statusTextEn: 'Closed for Evening',
      statusTextMr: 'संध्याकाळी बंद',
      badgeClass: 'closed',
      detailEn: 'Standard public visiting hours resume tomorrow at 9:30 AM',
      detailMr: 'उद्या सकाळी ९:३० वाजता भेट देऊ शकता',
    };
  }
}
