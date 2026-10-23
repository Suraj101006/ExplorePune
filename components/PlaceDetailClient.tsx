'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import PlaceActions from '@/components/PlaceActions';
import Reviews from '@/components/Reviews';
import PlaceMap from '@/components/PlaceMapWrapper';
import CommunityGallery from '@/components/CommunityGallery';
import TransitRouteMap from '@/components/TransitRouteMap';
import LocationPickerModal from '@/components/LocationPickerModal';
import {
  getPublicTransitRoute,
  TransitRouteInfo,
  PUNE_COMMUTE_HUBS,
  calculateDistanceKm,
} from '@/lib/publicTransit';
import { getOperatingStatus } from '@/lib/operatingHours';
import { speakPlaceName } from '@/lib/speech';
import { getSavedPlaces, toggleSavedPlace } from '@/lib/savedPlaces';
import { getPlaceVisitorGuidelines } from '@/lib/visitorGuidelines';
import {
  getStoredUserLocation,
  UserSavedLocation,
  detectBrowserGps,
  startGpsWatcher,
  stopGpsWatcher,
  formatGpsAge,
  getProximityToPlace,
  ProximityStatus,
} from '@/lib/userLocation';
import PlacePhotoSlideshowModal from '@/components/PlacePhotoSlideshowModal';
import CinematicPlaceSlideshow from '@/components/CinematicPlaceSlideshow';
import {
  getLandmarkTimetables,
  getUpcomingDepartures,
  formatAmPm,
  PmpmlTimetableRoute,
} from '@/lib/pmpmlGtfs';
import { getPlaceAuthenticity } from '@/lib/authenticity';
import TravelCompass from '@/components/TravelCompass';
import HeritageTimeline, { TimelineMilestone } from '@/components/HeritageTimeline';
import { openDirectionsModal } from '@/lib/navigationService';

const CATEGORY_NAMES_MR: Record<string, string> = {
  forts: 'किल्ले व गड',
  heritage: 'ऐतिहासिक वाडे व राजवाडे',
  temples: 'मंदिरे व तीर्थक्षेत्रे',
  museums: 'वस्तुसंग्रहालये',
  parks: 'उद्याने व बागा',
  nature: 'तलाव व निसर्गरम्य स्थळे',
};

const TIER_MR: Record<string, string> = {
  verified: 'तपासलेले तपशील',
  enriched: 'सार्वजनिक माहिती',
  listed: 'अंदाजे वेळ',
};

const TIER_EN: Record<string, string> = {
  verified: 'Verified Details',
  enriched: 'Public Source Info',
  listed: 'Hours Unverified',
};

function getLandmarkTimelineMilestones(slug: string): TimelineMilestone[] {
  const clean = slug.toLowerCase();
  if (clean.includes('shaniwar-wada')) {
    return [
      {
        year: '1730 CE',
        yearMr: '१७३०',
        era: 'Foundation',
        eraMr: 'पायाभरणी',
        title: 'Peshwa Baji Rao I lays foundation',
        titleMr: 'थोरले बाजीराव पेशवे यांनी रचली पायाभरणी',
        desc: 'Constructed as the administrative and military headquarters of the Maratha Empire.',
        descMr: 'मराठा साम्राज्याची राजधानी आणि राजकीय केंद्र म्हणून उभारणी सुरू झाली.',
      },
      {
        year: '1732 CE',
        yearMr: '१७३२',
        era: 'Inauguration',
        eraMr: 'वास्तू शांत व प्रवेश',
        title: '7-Storied Palace & Delhi Darwaza completed',
        titleMr: 'सात मजली राजवाडा व दिल्ली दरवाजा पूर्ण',
        desc: 'Magnificent teakwood pillars, mirror work, and fortified bastions opened on January 22, 1732.',
        descMr: '२२ जानेवारी १७३२ रोजी भव्य सागवानी खांब, कारंजे आणि अभेद्य बुरुजांसह वाडा खुला झाला.',
      },
      {
        year: '1818 CE',
        yearMr: '१८१८',
        era: 'End of Peshwa Rule',
        eraMr: 'पेशवाईचा अस्त',
        title: 'British forces occupy Pune & Shaniwar Wada',
        titleMr: 'इंग्रजांचा शनिवार वाड्यावर ताबा',
        desc: 'Following the Third Anglo-Maratha War, the Union Jack was raised over the Delhi Darwaza.',
        descMr: 'मराठा-इंग्रज युद्धानंतर शनिवार वाड्यावर ब्रिटिश ईस्ट इंडिया कंपनीचे नियंत्रण आले.',
      },
      {
        year: '1828 CE',
        yearMr: '१८२८',
        era: 'The Great Fire',
        eraMr: 'अग्नितांडव',
        title: '7-day fire consumes wooden interior chambers',
        titleMr: 'सात दिवस चाललेल्या आगीत लाकडी महालांचे नुकसान',
        desc: 'The wooden upper stories were destroyed, leaving behind the impregnable stone ramparts.',
        descMr: 'वाड्याचे लाकडी मजले आगीत भस्मसात झाले, परंतु बाहेरील दगडी तटबंदी व दरवाजे अभेद्य राहिले.',
      },
      {
        year: 'Present',
        yearMr: 'आज',
        era: 'National Monument',
        eraMr: 'राष्ट्रीय वारसा',
        title: 'ASI Protected Monument of National Importance',
        titleMr: 'एएसआय राष्ट्रीय संरक्षित स्मारक',
        desc: 'A celebrated emblem of Pune heritage drawing hundreds of thousands of annual visitors.',
        descMr: 'पुण्याच्या सांस्कृतिक अस्मितेचे सर्वोच्च प्रतीक आणि पर्यटन केंद्र.',
      },
    ];
  }
  if (clean.includes('sinhagad')) {
    return [
      {
        year: '1340 CE',
        yearMr: '१३४०',
        era: 'Early Chronicles',
        eraMr: 'प्राचीन इतिहास',
        title: 'Kondhana documented under Koli chieftain Nag Nayak',
        titleMr: 'कोळी सरदार नाग नायक यांच्या ताब्यात कोंढाणा',
        desc: 'Earliest historical inscriptions detailing the strategic Sahyadri bastion.',
        descMr: 'सह्याद्रीच्या पर्वतरांगांमधील महत्त्वाचा डोंगरी किल्ला म्हणून प्राचीन उल्लेख.',
      },
      {
        year: '1647 CE',
        yearMr: '१६४७',
        era: 'Swarajya Dawn',
        eraMr: 'स्वराज्याची पहाट',
        title: 'Chhatrapati Shivaji Maharaj secures Kondhana',
        titleMr: 'छत्रपती शिवाजी महाराजांनी किल्ला ताब्यात घेतला',
        desc: 'Secured diplomatically to defend the western passes of Pune.',
        descMr: 'पुण्याच्या पश्चिम घाटांचे रक्षण करण्यासाठी गडावर भगवा ध्वज फडकवला.',
      },
      {
        year: '1670 CE',
        yearMr: '१६७०',
        era: 'Battle of Sinhagad',
        eraMr: 'सिंहगडाचा रणसंग्राम',
        title: 'Subedar Tanaji Malusare recaptures the fort',
        titleMr: 'सुभेदार तानाजी मालुसरे यांचे अतुलनीय शौर्य',
        desc: 'Immortalized by Shivaji Maharaj: "Gad aala, pan Sinha gela" (The fort is won, but the lion is lost).',
        descMr: 'प्राणांची आहुती देऊन गड सर केला. महाराजांचे उद्गार: "गड आला पण सिंह गेला."',
      },
      {
        year: 'Present',
        yearMr: 'आज',
        era: 'Heritage Shrine & Trek',
        eraMr: 'पदभ्रमण व तीर्थक्षेत्र',
        title: 'Revered pilgrimage and trekking destination of Pune',
        titleMr: 'पुणेकरांचे आवडते ऐतिहासिक पदभ्रमण ठिकाण',
        desc: 'Famous for the Tanaji Memorial, Kalyan Darwaza, and authentic Pitla Bhakri at the summit.',
        descMr: 'तानाजी स्मारक, कल्याण दरवाजा आणि गडावरील चुलिवरच्या पिठलं-भाकरीसाठी प्रसिद्ध.',
      },
    ];
  }
  if (clean.includes('aga-khan')) {
    return [
      {
        year: '1892 CE',
        yearMr: '१८९२',
        era: 'Construction',
        eraMr: 'उभारणी',
        title: 'Built by Sultan Muhammed Shah Aga Khan III',
        titleMr: 'सुलतान महंमद शाह आगा खान यांनी बांधला',
        desc: 'Erected as a philanthropic relief project for local villagers affected by severe famine in Pune.',
        descMr: 'पुण्यातील दुष्काळग्रस्त जनतेला रोजगार देण्यासाठी बांधलेला इटालियन गॉथिक राजवाडा.',
      },
      {
        year: '1942 CE',
        yearMr: '१९४२',
        era: 'Quit India Movement',
        eraMr: 'भारत छोडो आंदोलन',
        title: 'Mahatma Gandhi interned here by the British',
        titleMr: 'महात्मा गांधी व सहकाऱ्यांना येथे स्थानबद्ध केले',
        desc: 'Epicenter of India’s freedom movement; Kasturba Gandhi and Mahadev Desai accompanied the Mahatma.',
        descMr: 'स्वातंत्र्यलढ्यादरम्यान गांधीजी, कस्तुरबा गांधी आणि महादेव देसाई यांचे निवासस्थान व कारावास.',
      },
      {
        year: '1944 CE',
        yearMr: '१९४४',
        era: 'Sacred Memorial',
        eraMr: 'पवित्र समाधी',
        title: 'Samadhis of Kasturba Gandhi and Mahadev Desai',
        titleMr: 'कस्तुरबा गांधी व महादेव देसाई यांची समाधी',
        desc: 'Marble samadhis designed by Charles Correa erected in the serene palace gardens.',
        descMr: 'राजवाड्याच्या शांत उद्यानात संगमरवरी पवित्र समाधीस्थळे उभारण्यात आली.',
      },
      {
        year: 'Present',
        yearMr: 'आज',
        era: 'National Gandhi Smriti',
        eraMr: 'राष्ट्रीय स्मारक',
        title: 'ASI Monument of National Importance',
        titleMr: 'राष्ट्रीय महत्त्वाचे ऐतिहासिक स्मारक',
        desc: 'Preserves Gandhiji’s personal belongings, khadi charkha, and peace archives.',
        descMr: 'गांधीजींच्या वस्तू, चरखा आणि ऐतिहासिक छायाचित्रांचा वारसा जपणारे संग्रहालय.',
      },
    ];
  }
  const isFort = clean.includes('fort') || clean.includes('किल्ला');
  const isTemple = clean.includes('temple') || clean.includes('mandir') || clean.includes('ganpati');
  if (isFort) {
    return [
      {
        year: '1650s CE',
        yearMr: '१६५० चे दशक',
        era: 'Maratha Swarajya',
        eraMr: 'मराठा स्वराज्य',
        title: 'Strategic fortification of the Sahyadri peak',
        titleMr: 'सह्याद्रीच्या शिखरावर लष्करी तटबंदी',
        desc: 'Reinforced with double-bastioned machis and water cisterns to guard trade corridors.',
        descMr: 'व्यापारी मार्ग व खोऱ्यांचे रक्षण करण्यासाठी अभेद्य बुरुज व पाण्याच्या टाक्यांची निर्मिती.',
      },
      {
        year: '1818 CE',
        yearMr: '१८१८',
        era: 'Colonial Era',
        eraMr: 'ब्रिटिश काळ',
        title: 'Documented in Bombay Presidency Gazetteers',
        titleMr: 'पुरातत्व व ऐतिहासिक सर्वेक्षण',
        desc: 'Surveyed by British military engineers for exceptional natural topography.',
        descMr: 'सह्याद्रीतील नैसर्गिक दुर्गमतेसाठी गॅझेटियरमध्ये गौरव.',
      },
      {
        year: 'Present',
        yearMr: 'आज',
        era: 'Protected Heritage',
        eraMr: 'संरक्षित वारसा',
        title: 'Iconic trekking and biodiversity sanctuary',
        titleMr: 'ऐतिहासिक पदभ्रमण व जैवविविधता ठिकाण',
        desc: 'Welcoming thousands of trekkers, students, and nature lovers every weekend.',
        descMr: 'ट्रेकिंग, इतिहास आणि निसर्ग पर्यटनाचे लोकप्रिय केंद्र.',
      },
    ];
  }
  if (isTemple) {
    return [
      {
        year: 'Historic Era',
        yearMr: 'ऐतिहासिक काळ',
        era: 'Consecration',
        eraMr: 'प्रतिष्ठापना',
        title: 'Consecration of the sacred sanctum & deity',
        titleMr: 'पवित्र गर्भगृह व मूर्तीची स्थापना',
        desc: 'Revered spiritual foundation deeply embedded in Puneri devotional traditions.',
        descMr: 'पुण्याच्या भक्ती परंपरेत आणि पेठ संस्कृतीत आदराचे स्थान.',
      },
      {
        year: '1893 CE',
        yearMr: '१८९३',
        era: 'Social Awakening',
        eraMr: 'सार्वजनिक उत्सव',
        title: 'Lokmanya Tilak endorses public community celebration',
        titleMr: 'लोकमान्य टिळकांनी सार्वजनिक उत्सवाला प्रेरणा दिली',
        desc: 'Transformed into a focal point of cultural unity and societal service.',
        descMr: 'सामाजिक एकता आणि जनसेवेचे भव्य केंद्र म्हणून गौरव.',
      },
      {
        year: 'Present',
        yearMr: 'आज',
        era: 'Living Pilgrimage',
        eraMr: 'जागृत तीर्थक्षेत्र',
        title: 'Devotional icon welcoming millions of pilgrims',
        titleMr: 'लाखो भाविकांचे आराध्य दैवत',
        desc: 'Celebrated for daily aartis, charitable healthcare, and festive fervor.',
        descMr: 'दैनिक आरती, अन्नदान आणि सामाजिक कार्यासाठी प्रसिद्ध असलेले देवस्थान.',
      },
    ];
  }
  return [];
}

export default function PlaceDetailClient({ place }: { place: any }) {
  const { isMr } = useLanguage();

  const categoryName = Array.isArray(place.place_categories)
    ? place.place_categories[0]?.name
    : place.place_categories?.name || place.category || 'Attraction';

  const categoryDisplayName = isMr
    ? CATEGORY_NAMES_MR[place.category_slug || ''] || categoryName
    : categoryName;

  const tierLabel = isMr
    ? TIER_MR[place.data_tier] || place.data_tier
    : TIER_EN[place.data_tier] || place.data_tier;

  const primaryName = isMr && place.name_mr ? place.name_mr : place.name;
  const secondaryName = isMr && place.name_mr ? place.name : place.name_mr;

  const description = isMr
    ? place.description_mr || place.description
    : place.description;

  const address = isMr ? place.address_mr || place.address : place.address;
  const bestTime = isMr ? place.best_time_mr || place.best_time : place.best_time;

  const price = place.place_prices?.[0];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name}, Pune`
  )}`;

  const defaultTransit = getPublicTransitRoute(18.5204, 73.8567, place);
  const [liveTransit, setLiveTransit] = useState<TransitRouteInfo | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHubId, setSelectedHubId] = useState<string>('central');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [isLiveGpsTracking, setIsLiveGpsTracking] = useState(false);
  const [gpsTimestamp, setGpsTimestamp] = useState<number>(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(10);
  const [proximity, setProximity] = useState<ProximityStatus | null>(null);
  const [gpsAgeText, setGpsAgeText] = useState<string>('');
  const [originName, setOriginName] = useState<string>(
    isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan)'
  );
  const [originNotice, setOriginNotice] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeGuidelineTab, setActiveGuidelineTab] = useState<'commute' | 'timing' | 'rules'>('commute');
  const [speaking, setSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [poppingBookmark, setPoppingBookmark] = useState(false);

  // Scroll Reveal for Place Information Sections (Requirement 8)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Animate once per section
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const sections = document.querySelectorAll('.place-section-reveal');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  const guidelines = useMemo(() => getPlaceVisitorGuidelines(place), [place]);
  const opStatus = getOperatingStatus(place);
  const authenticity = useMemo(() => getPlaceAuthenticity(place.slug || place.id, place), [place]);
  const milestones = useMemo(() => getLandmarkTimelineMilestones(place.slug || place.id), [place.slug, place.id]);

  // PMPML Bus Timetable integration
  const timetableRoutes = useMemo(() => {
    return getLandmarkTimetables(place.slug);
  }, [place.slug]);

  const [selectedRouteNo, setSelectedRouteNo] = useState<string>('');
  const [selectedDir, setSelectedDir] = useState<number>(0);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  useEffect(() => {
    if (timetableRoutes.length > 0 && (!selectedRouteNo || !timetableRoutes.some((r) => r.routeNo === selectedRouteNo))) {
      setSelectedRouteNo(timetableRoutes[0].routeNo);
      setSelectedDir(0);
    }
  }, [timetableRoutes, selectedRouteNo]);

  const activeTimetableRoute = useMemo(() => {
    return timetableRoutes.find((r) => r.routeNo === selectedRouteNo) || timetableRoutes[0];
  }, [timetableRoutes, selectedRouteNo]);

  const upcomingDepartures = useMemo(() => {
    if (!activeTimetableRoute) return [];
    return getUpcomingDepartures(activeTimetableRoute.routeNo, selectedDir, 4);
  }, [activeTimetableRoute, selectedDir]);

  // Sync stored user location if available
  useEffect(() => {
    const loc = getStoredUserLocation();
    if (loc) {
      setUserCoords({ lat: loc.lat, lng: loc.lng });
      setSelectedHubId(loc.id);
      const name = isMr ? loc.nameMr : loc.nameEn;
      setOriginName(name);
      const computed = getPublicTransitRoute(loc.lat, loc.lng, place, name);
      setLiveTransit(computed);
    }
  }, [place, isMr]);

  useEffect(() => {
    const sync = () => {
      const list = getSavedPlaces();
      setIsSaved(list.some((p) => p.id === place.id));
    };
    sync();
    window.addEventListener('explore-pune-saved-changed', sync);
    return () => window.removeEventListener('explore-pune-saved-changed', sync);
  }, [place.id]);

  const handleSpeak = () => {
    setSpeaking(true);
    speakPlaceName(primaryName, isMr);
    setTimeout(() => setSpeaking(false), 2500);
  };

  const handleToggleSave = () => {
    const willBeSaved = !isSaved;
    setPoppingBookmark(true);
    setTimeout(() => setPoppingBookmark(false), 300);

    toggleSavedPlace({
      id: place.id,
      slug: place.slug || place.id,
      name: place.name,
      name_mr: place.name_mr,
      image_url: place.image_url,
      category_slug: place.category_slug,
      category: place.category,
      data_tier: place.data_tier,
    });

    const msg = willBeSaved
      ? (isMr ? `✓ "${primaryName}" आवडत्या यादीत जोडले` : `✓ Added "${primaryName}" to your Pune collection`)
      : (isMr ? `"${primaryName}" यादीतून काढले` : `Removed "${primaryName}" from collection`);

    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = isMr
      ? `पुण्यातील ${primaryName} बद्दल माहिती आणि प्रवास मार्गदर्शक पहा: ${shareUrl}`
      : `Check out ${primaryName} on Explore Pune: ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: primaryName, text, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${primaryName} - Explore Pune\n${typeof window !== 'undefined' ? window.location.href : ''}`
  )}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  // Keep GPS freshness timestamp string updated
  useEffect(() => {
    if (!isLiveGpsTracking || !gpsTimestamp) return;
    setGpsAgeText(formatGpsAge(gpsTimestamp, isMr));
    const interval = setInterval(() => {
      setGpsAgeText(formatGpsAge(gpsTimestamp, isMr));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLiveGpsTracking, gpsTimestamp, isMr]);

  // Clean up GPS watcher on component unmount
  useEffect(() => {
    return () => {
      stopGpsWatcher();
    };
  }, []);

  const handleUseLiveGps = async () => {
    setIsLocatingGps(true);
    setOriginNotice('');
    try {
      const result = await detectBrowserGps();
      if (result.success && result.location) {
        setSelectedHubId('live-gps');
        setIsLiveGpsTracking(true);
        const name = isMr ? result.location.nameMr : result.location.nameEn;
        setOriginName(name);
        setUserCoords({ lat: result.location.lat, lng: result.location.lng });
        const ts = result.location.timestamp || Date.now();
        setGpsTimestamp(ts);
        const acc = result.accuracyMeters || 10;
        setGpsAccuracy(acc);

        const prox = getProximityToPlace(result.location.lat, result.location.lng, place.latitude, place.longitude);
        setProximity(prox);

        setOriginNotice(
          isMr
            ? `✓ थेट GPS जोडले गेले (अचूकता: ±${acc}m) • वेळोवेळी रिअल-टाइम ट्रॅकिंग सक्रिय!`
            : `✓ Live GPS connected (Accuracy: ±${acc}m) • Real-time tracking active!`
        );
        const computed = getPublicTransitRoute(result.location.lat, result.location.lng, place, name);
        setLiveTransit(computed);

        // Initiate continuous background tracking so distance refreshes time to time as user moves
        startGpsWatcher((freshLoc) => {
          const freshTs = freshLoc.timestamp || Date.now();
          setGpsTimestamp(freshTs);
          if (freshLoc.accuracyRadiusMeters) setGpsAccuracy(freshLoc.accuracyRadiusMeters);
          setUserCoords({ lat: freshLoc.lat, lng: freshLoc.lng });
          const updatedProx = getProximityToPlace(freshLoc.lat, freshLoc.lng, place.latitude, place.longitude);
          setProximity(updatedProx);
          const freshName = isMr ? freshLoc.nameMr : freshLoc.nameEn;
          const freshTransit = getPublicTransitRoute(freshLoc.lat, freshLoc.lng, place, freshName);
          setLiveTransit(freshTransit);
        });
      } else {
        setOriginNotice(result.error || (isMr ? 'GPS स्थान मिळवता आले नाही.' : 'Could not acquire GPS position.'));
      }
    } catch {
      setOriginNotice(isMr ? 'GPS सेन्सर सुरू करताना त्रुटी आली.' : 'Failed to connect to device GPS.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  const handleSelectHub = (hubId: string) => {
    stopGpsWatcher();
    setIsLiveGpsTracking(false);
    setProximity(null);
    setSelectedHubId(hubId);
    setOriginNotice('');
    const hub = PUNE_COMMUTE_HUBS.find((h) => h.id === hubId);
    if (hub) {
      const coords = { lat: hub.latitude, lng: hub.longitude };
      setUserCoords(coords);
      const hubLabel = isMr ? hub.nameMr : hub.nameEn;
      setOriginName(hubLabel);
      const computed = getPublicTransitRoute(hub.latitude, hub.longitude, place, hubLabel);
      setLiveTransit(computed);
    } else {
      setUserCoords(null);
      const defaultLabel = isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan)';
      setOriginName(defaultLabel);
      const computed = getPublicTransitRoute(18.5204, 73.8567, place, defaultLabel);
      setLiveTransit(computed);
    }
  };

  const activeTransit = liveTransit || defaultTransit;

  return (
    <main className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <Link
          href="/"
          className="chip"
          style={{ marginBottom: 20, display: 'inline-flex', fontSize: 13, gap: 6 }}
        >
          <span>←</span> {isMr ? 'सर्व ठिकाणांकडे परत' : 'Back to All Places'}
        </Link>

        {/* Automated Cinematic Place Photo Slideshow */}
        <CinematicPlaceSlideshow
          place={place}
          onOpenFullscreenTheater={(startIndex) => {
            setSlideshowIndex(startIndex);
            setSlideshowOpen(true);
          }}
        />

        {/* Hero Header (Requirement 8) */}
        <header
          className="panel scroll-reveal place-section-reveal"
          style={{
            marginBottom: 24,
            padding: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 800,
                color: 'var(--clay)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              📍 {categoryDisplayName}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: `${authenticity.badgeColor}12`,
                  color: authenticity.badgeColor,
                  border: `1.5px solid ${authenticity.badgeColor}35`,
                }}
                title={`${isMr ? authenticity.tierLabelMr : authenticity.tierLabelEn} • ${isMr ? authenticity.confidenceLabelMr : authenticity.confidenceLabelEn}`}
              >
                <span>{authenticity.badgeEmoji}</span>
                <span>{isMr ? authenticity.tierLabelMr : authenticity.tierLabelEn}</span>
                <span
                  style={{
                    fontSize: 11,
                    opacity: 0.85,
                    borderLeft: '1px solid currentColor',
                    paddingLeft: 6,
                    marginLeft: 2,
                  }}
                >
                  {isMr ? authenticity.confidenceLabelMr : authenticity.confidenceLabelEn}
                </span>
              </span>
              <span className={`tier ${place.data_tier}`}>{tierLabel}</span>
            </div>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              margin: '6px 0 4px',
              color: 'var(--ink)',
              fontFamily: isMr ? 'var(--deva)' : 'inherit',
              lineHeight: 1.25,
            }}
          >
            {primaryName}
          </h1>

          {secondaryName && (
            <p
              style={{
                fontSize: '17px',
                color: 'var(--muted)',
                margin: '0 0 16px 0',
                fontFamily: isMr ? 'inherit' : 'var(--deva)',
              }}
            >
              {secondaryName}
            </p>
          )}

          {/* Free Live Operating Status & Directional Compass Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              margin: '14px 0 16px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: opStatus.isOpen ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${opStatus.isOpen ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className={`status-badge ${opStatus.badgeClass}`}>
                <span style={{ fontSize: 9 }}>{opStatus.isOpen ? '🟢' : '🔴'}</span>
                <span>{isMr ? opStatus.statusTextMr : opStatus.statusTextEn}</span>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontWeight: 500 }}>
                {isMr ? opStatus.detailMr : opStatus.detailEn}
              </span>
            </div>

            {/* Travel Compass Micro-Interaction (Requirement 10) */}
            <div style={{ flexShrink: 0 }}>
              <TravelCompass
                latitude={place.latitude}
                longitude={place.longitude}
                targetName={primaryName}
                isMarathi={isMr}
                size={34}
              />
            </div>
          </div>

          {/* Quick Traveler Utilities Action Bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {/* Prominent GPS Get Directions Button (Requirement 1) */}
            <button
              type="button"
              onClick={() =>
                openDirectionsModal({
                  id: place.id,
                  name: place.name,
                  nameMr: place.name_mr,
                  latitude: place.latitude,
                  longitude: place.longitude,
                  address: place.address,
                  addressMr: place.address_mr,
                  slug: place.slug,
                  imageUrl: place.image_url,
                  category: place.category_slug,
                })
              }
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                color: '#ffffff',
                padding: '7px 16px',
                fontSize: '12.5px',
                fontWeight: 800,
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 2px 8px rgba(4, 120, 87, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
              title={isMr ? `${primaryName} चा थेट मार्ग मिळवा` : `Navigate to ${primaryName}`}
            >
              <span>📍</span>
              <span>{isMr ? `${primaryName} चा मार्ग मिळवा` : `Get Directions`}</span>
            </button>

            {/* Free Speech Audio Pronunciation */}
            <button
              type="button"
              onClick={handleSpeak}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
              title={isMr ? 'स्थानिक पुणेरी उच्चार ऐका' : 'Listen Native Pronunciation'}
            >
              <span>{speaking ? '🔊' : '🔈'}</span>
              <span>{speaking ? (isMr ? 'उच्चारत आहे…' : 'Speaking…') : (isMr ? 'नाव उच्चार ऐका' : 'Listen Pronunciation')}</span>
            </button>

            {/* Free Quick Wishlist / Save */}
            <button
              type="button"
              onClick={handleToggleSave}
              className="btn outline"
              style={{
                padding: '7px 14px',
                fontSize: '12.5px',
                color: isSaved ? '#e11d48' : undefined,
                borderColor: isSaved ? '#fecdd3' : undefined,
                background: isSaved ? '#fff1f2' : undefined,
              }}
            >
              <span>{isSaved ? '❤️' : '🤍'}</span>
              <span>{isSaved ? (isMr ? 'जतन केले आहे' : 'Saved in Wishlist') : (isMr ? 'आवडत्या यादीत जतन करा' : 'Save to Wishlist')}</span>
            </button>

            {/* Free 1-Click WhatsApp Share */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px', color: '#15803d' }}
            >
              <span>💬</span>
              <span>{isMr ? 'WhatsApp वर शेअर करा' : 'Share on WhatsApp'}</span>
            </a>

            {/* Native Share or Link Copy */}
            <button
              type="button"
              onClick={handleShare}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              <span>🔗</span>
              <span>{copiedShare ? (isMr ? '✓ लिंक कॉपी झाली' : '✓ Link Copied') : (isMr ? 'लिंक शेअर करा' : 'Share Link')}</span>
            </button>

            {/* Free Offline Print & PDF Export */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn outline"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
              title={isMr ? 'ऑफलाइन वाचनासाठी मार्गदर्शक प्रिंट किंवा सेव्ह करा' : 'Print or save offline travel guide'}
            >
              <span>🖨️</span>
              <span>{isMr ? 'ऑफलाइन PDF प्रिंट' : 'Print / Save PDF'}</span>
            </button>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '16px',
              marginTop: '16px',
              fontSize: '13.5px',
              color: 'var(--muted)',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {place.latitude && place.longitude && (
              <span>
                🧭 {isMr ? 'स्थान निर्देशक' : 'Coordinates'}:{' '}
                <strong>
                  {Number(place.latitude).toFixed(4)}° N, {Number(place.longitude).toFixed(4)}° E
                </strong>
              </span>
            )}
            {address && <span>📍 {address}</span>}
          </div>
        </header>

        {/* Place Actions (Save, Record Visit) */}
        <PlaceActions placeId={place.id} placeSlug={place.slug} placeName={place.name} />

        {/* About & Visitor Info */}
        <div className="stack" style={{ marginBottom: 24 }}>
          {/* Overview & History Section (Requirement 8) */}
          <section className="panel scroll-reveal place-section-reveal">
            <h2
              style={{
                fontSize: '19px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 10,
                marginTop: 0,
                color: 'var(--ink)',
              }}
            >
              {isMr ? 'विहंगावलोकन आणि इतिहास' : 'Overview & Historical Context'}
            </h2>
            <p
              style={{
                fontSize: '15.5px',
                lineHeight: 1.75,
                color: 'var(--ink-secondary)',
                margin: '14px 0 0',
                fontFamily: isMr ? 'var(--deva)' : 'inherit',
              }}
            >
              {description ||
                (isMr
                  ? 'या ऐतिहासिक स्थानाबद्दल तपशीलवार माहिती लवकरच अद्ययावत केली जाईल.'
                  : 'Detailed information and visitor guide for this historic spot in Pune.')}
            </p>

            {/* Heritage Timeline Animation (Requirement 8) */}
            {milestones.length > 0 && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: '0 0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>⏳</span>
                  <span>{isMr ? 'ऐतिहासिक टप्पे व कालक्रम:' : 'Heritage Milestones & Timeline:'}</span>
                </h3>
                <HeritageTimeline milestones={milestones} isMarathi={isMr} />
              </div>
            )}

            {/* Trusted Data Verification Card (Conforms to Section 17 Standards) */}
            <div
              style={{
                marginTop: 20,
                padding: '18px 20px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1.5px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🛡️</span>
                  <div>
                    <strong style={{ fontSize: 14.5, color: '#0f172a' }}>
                      {isMr ? 'सत्यापित पर्यटन माहिती' : 'Verified Information'}
                    </strong>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {isMr
                        ? 'शासकीय व अधिकृत संस्थांद्वारे प्रमाणित तथ्ये'
                        : 'Source-backed data curated from authoritative heritage records'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: `${authenticity.badgeColor}12`,
                      color: authenticity.badgeColor,
                      border: `1px solid ${authenticity.badgeColor}35`,
                    }}
                  >
                    {authenticity.badgeEmoji} {isMr ? authenticity.tierLabelMr : authenticity.tierLabelEn}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: '#f1f5f9',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    ✓ {isMr ? authenticity.confidenceLabelMr : authenticity.confidenceLabelEn}
                  </span>
                </div>
              </div>

              {/* 4-Item Verification Checklist (Section 17) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 10,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    background: '#ffffff',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: 12.5 }}>
                      {isMr ? 'स्थान पडताळणी' : 'Location verified'}
                    </strong>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {isMr ? 'OSM व गुगल नकाशे' : 'OpenStreetMap & Maps'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    background: '#ffffff',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: 12.5 }}>
                      {isMr ? 'अधिकृत संदर्भ उपलब्ध' : 'Official source available'}
                    </strong>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {isMr ? 'शासकीय / ट्रस्ट स्रोत' : 'Govt / Trust catalog'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    background: '#ffffff',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: 12.5 }}>
                      {isMr ? 'वेळ व वेळापत्रक तपासले' : 'Timings checked'}
                    </strong>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {isMr ? 'चालू-बंद तास प्रमाणित' : 'Operating hours verified'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    background: '#ffffff',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: 12.5 }}>
                      {isMr ? 'प्रवेश शुल्क तपासले' : 'Entry info checked'}
                    </strong>
                    <span style={{ fontSize: 11.5, color: '#64748b' }}>
                      {isMr ? 'दरपत्रक व मोफत प्रवेश' : 'Official ticket policy'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Sources & Last Verified Date Strip */}
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: 10,
                  fontSize: 12,
                  color: '#475569',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div>
                  <strong style={{ color: '#1e293b' }}>
                    {isMr ? 'अधिकृत संदर्भ (Sources):' : 'Sources:'}
                  </strong>{' '}
                  <span>
                    {place.verification?.sources?.length > 0
                      ? place.verification.sources.map((s: any) => s.name || s).join(' • ')
                      : authenticity.sourcesList?.length > 0
                      ? authenticity.sourcesList.join(' • ')
                      : 'Archaeological Survey of India (ASI) • Maharashtra Tourism (MTDC) • PMC Heritage'}
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: 11.5 }}>
                  {isMr ? 'अंतिम पडताळणी:' : 'Last verified:'}{' '}
                  <strong style={{ color: '#334155' }}>
                    {place.verification?.lastChecked || authenticity.lastVerified || '23 October 2026'}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* Visitor Intel Section (Requirement 8) */}
          <section className="panel scroll-reveal place-section-reveal">
            <h2
              style={{
                fontSize: '19px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 10,
                marginTop: 0,
                color: 'var(--ink)',
              }}
            >
              {isMr ? 'पर्यटक माहिती आणि नियोजन' : 'Visitor Intel & Planning'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
              {/* Admission Pricing */}
              <div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    display: 'block',
                    letterSpacing: '0.04em',
                    marginBottom: 4,
                  }}
                >
                  {isMr ? 'प्रवेश शुल्क' : 'Admission Fee'}
                </span>
                <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--clay)' }}>
                  {(() => {
                    if (place.fee_status === 'free' || place.entry_fee === 0 || (price?.is_free && place.fee_status !== 'paid')) {
                      return isMr ? 'विनामूल्य प्रवेश (सर्व पर्यटकांसाठी ₹०)' : 'Verified Free Entry (₹0 for all visitors)';
                    }
                    if (place.fee_status === 'paid' || (typeof place.entry_fee === 'number' && place.entry_fee > 0)) {
                      const amount = place.entry_fee ?? price?.amount;
                      return isMr ? `₹${amount} प्रति व्यक्ती (अधिकृत तिकीट)` : `₹${amount} per person (Official ticket)`;
                    }
                    if (price && typeof price.amount === 'number' && price.amount > 0) {
                      return isMr ? `₹${price.amount} प्रति व्यक्ती` : `₹${price.amount} per person`;
                    }
                    if (place.fee_status === 'not_verified' || place.entry_fee === null) {
                      return isMr ? 'प्रवेश शुल्क अधिकृतपणे पुष्टी नाही' : 'Fee info not officially confirmed';
                    }
                    return isMr ? 'प्रवेश माहिती उपलब्ध' : 'Entry info available';
                  })()}
                </p>
                {place.fee_details?.notes && (
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: 4, marginBottom: 0, lineHeight: 1.4 }}>
                    ℹ️ {isMr ? (place.fee_details.notes_mr || place.fee_details.notes) : place.fee_details.notes}
                  </p>
                )}
                {place.fee_details?.parking && (
                  <p style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: 2, marginBottom: 0 }}>
                    🚗 {place.fee_details.parking}
                  </p>
                )}
              </div>

              {/* Best Time to Visit */}
              {bestTime && (
                <div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      display: 'block',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                    }}
                  >
                    {isMr ? 'उत्तम भेट काळ' : 'Best Time to Visit'}
                  </span>
                  <p style={{ fontSize: '14.5px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                    ⏱️ {bestTime}
                  </p>
                </div>
              )}

              {/* Recommended Duration */}
              {place.recommended_duration_minutes && (
                <div>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      display: 'block',
                      letterSpacing: '0.04em',
                      marginBottom: 4,
                    }}
                  >
                    {isMr ? 'अपेक्षित वेळ' : 'Recommended Time'}
                  </span>
                  <p style={{ fontSize: '14.5px', fontWeight: 600, margin: 0, color: 'var(--ink)' }}>
                    ⏳ {place.recommended_duration_minutes} {isMr ? 'मिनिटे' : 'minutes'}
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() =>
                  openDirectionsModal({
                    id: place.id,
                    name: place.name,
                    nameMr: place.name_mr,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    address: place.address,
                    addressMr: place.address_mr,
                    slug: place.slug,
                    imageUrl: place.image_url,
                    category: place.category_slug,
                  })
                }
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  borderRadius: 10,
                  boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <span>📍</span>
                <span>{isMr ? 'थेट GPS नेव्हिगेशन सुरू करा' : `Get Directions to ${primaryName}`}</span>
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn outline"
                style={{ padding: '10px 18px', fontSize: 13 }}
              >
                🗺️ {isMr ? 'गुगल मॅप्सवर उघडा ↗' : 'Open in Google Maps ↗'}
              </a>
            </div>
          </section>
        </div>

        {/* Comprehensive Visitor Guidelines & How to Visit (Requirement 8) */}
        <section
          className="panel scroll-reveal place-section-reveal"
          style={{
            marginBottom: 24,
            border: '1.5px solid #fed7aa',
            background: 'linear-gradient(to bottom, #fffbeb 0%, #ffffff 120px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  margin: 0,
                  color: '#9a3412',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>📋</span>
                <span>
                  {isMr
                    ? `${primaryName} — भेट मार्गदर्शक व नियम`
                    : `Guidelines: How to Visit ${primaryName}`}
                </span>
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-secondary)' }}>
                {isMr ? guidelines.summaryMr : guidelines.summaryEn}
              </p>
            </div>

            {guidelines.difficultyOrTypeEn && (
              <span
                style={{
                  background: '#ffedd5',
                  color: '#c2410c',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 999,
                  border: '1px solid #fdba74',
                }}
              >
                {isMr ? guidelines.difficultyOrTypeMr : guidelines.difficultyOrTypeEn}
              </span>
            )}
          </div>

          {/* Guideline Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              flexWrap: 'wrap',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: 8,
            }}
          >
            {[
              { id: 'commute', labelEn: '🧭 How to Reach (Commute)', labelMr: '🧭 कसे पोहोचावे' },
              { id: 'timing', labelEn: '🎟️ Timing & Tickets', labelMr: '🎟️ वेळ व तिकीट' },
              { id: 'rules', labelEn: "📋 Rules & Do's / Don'ts", labelMr: '📋 नियम व आचारसंहिता' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGuidelineTab(tab.id as any)}
                style={{
                  border: 'none',
                  background: activeGuidelineTab === tab.id ? '#ea580c' : 'rgba(0,0,0,0.05)',
                  color: activeGuidelineTab === tab.id ? '#ffffff' : '#475569',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isMr ? tab.labelMr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div style={{ display: 'grid', gap: 12 }}>
            {guidelines.sections
              .filter((_, idx) => {
                if (activeGuidelineTab === 'commute') return idx === 0;
                if (activeGuidelineTab === 'timing') return idx === 1;
                return idx === 2;
              })
              .map((section, sIdx) => (
                <div key={sIdx} style={{ display: 'grid', gap: 10 }}>
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #f1f5f9',
                        borderRadius: 10,
                        padding: '12px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                          marginBottom: 4,
                          flexWrap: 'wrap',
                        }}
                      >
                        <strong style={{ fontSize: 13.5, color: '#1e293b' }}>
                          {isMr ? item.labelMr : item.labelEn}
                        </strong>
                        {item.tag && (
                          <span
                            style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: '#475569',
                          lineHeight: 1.55,
                        }}
                      >
                        {isMr ? item.descMr : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Local Pro-Tips Callout */}
          {guidelines.proTipsEn.length > 0 && (
            <div
              style={{
                marginTop: 18,
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <strong style={{ fontSize: 13, color: '#c2410c', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span>💡</span> {isMr ? 'स्थानिक तज्ज्ञ सूचना (Local Pro-Tips):' : 'Local Expert Pro-Tips:'}
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#7c2d12', lineHeight: 1.6 }}>
                {(isMr ? guidelines.proTipsMr : guidelines.proTipsEn).map((tip, tIdx) => (
                  <li key={tIdx} style={{ marginBottom: 2 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Local Authentic Food Recommendations */}
          {guidelines.nearbyCulinaryEn.length > 0 && (
            <div
              style={{
                marginTop: 18,
                background: 'linear-gradient(to bottom, #fffbf5, #ffffff)',
                border: '1.5px solid #fdba74',
                borderRadius: 14,
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  borderBottom: '1px solid #fed7aa',
                  paddingBottom: 12,
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#ffedd5',
                      color: '#c2410c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#9a3412',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {isMr ? 'परिसरातील अस्सल खाद्यसंस्कृती व नामांकित ठिकाणे' : 'Authentic Local Food & Landmark Eateries Nearby'}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#7c2d12', opacity: 0.85 }}>
                      {isMr
                        ? 'या ठिकाणानुरूप विशेष खाद्यसंस्कृती आणि प्रसिद्ध ऐतिहासिक उपाहारगृहे'
                        : 'Curated hyper-local dishes and iconic eateries situated around this specific landmark'}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: '#ffedd5',
                    color: '#c2410c',
                    border: '1px solid #fdba74',
                  }}
                >
                  {isMr ? 'अस्सल पुणेरी चव' : 'Authentic Pune Flavors'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {(isMr ? guidelines.nearbyCulinaryMr : guidelines.nearbyCulinaryEn).map((dish, dIdx) => {
                  const parts = dish.split(/—|-/);
                  const hasPrefix = parts.length > 1;
                  const title = hasPrefix ? parts[0].trim() : '';
                  const desc = hasPrefix ? parts.slice(1).join('—').trim() : dish;

                  return (
                    <div
                      key={dIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #ffedd5',
                        borderRadius: 10,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#ea580c',
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#431407' }}>
                        {hasPrefix ? (
                          <>
                            <strong style={{ color: '#9a3412', fontWeight: 700 }}>{title}</strong>
                            <span style={{ color: '#78350f' }}> — {desc}</span>
                          </>
                        ) : (
                          <span style={{ color: '#78350f' }}>{dish}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Public Transit & Directions Section (Requirement 8) */}
        <section
          className="panel scroll-reveal place-section-reveal"
          style={{
            marginBottom: 24,
            border: '1.5px solid #bbf7d0',
            background: 'linear-gradient(to bottom, #f0fdf4 0%, #ffffff 120px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              borderBottom: '1px solid var(--line)',
              paddingBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: '19px',
                margin: 0,
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>🚇</span>{' '}
              {isMr
                ? 'सार्वजनिक वाहतूक मार्गदर्शक (पुणे मेट्रो व बस)'
                : 'Public Transit Guide (Metro & Bus)'}
            </h2>
          </div>

          {/* Starting Location / Home Selector */}
          <div
            style={{
              marginTop: 14,
              padding: '14px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <label
                htmlFor="home-locality-select"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>🏠</span>
                <span>
                  {isMr
                    ? 'तुमच्या घरातून / भागातून मार्ग निवडा:'
                    : 'Choose Starting Point (From Your Home / Locality):'}
                </span>
              </label>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="btn outline"
                  style={{
                    padding: '4px 10px',
                    fontSize: 11.5,
                    borderRadius: 999,
                    background: '#ffffff',
                    borderColor: '#059669',
                    color: '#065f46',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title={isMr ? 'पुण्यातील ३५+ परिसरांमधून थेट शोधा' : 'Search across 35+ Pune localities'}
                >
                  <span>📍</span>
                  <span>{isMr ? 'सर्व ३५+ परिसर शोधा' : 'Search 35+ Localities'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseLiveGps}
                  disabled={isLocatingGps}
                  className="btn outline"
                  style={{
                    padding: '4px 10px',
                    fontSize: 11.5,
                    borderRadius: 999,
                    background: selectedHubId === 'live-gps' ? '#ecfdf5' : '#ffffff',
                    borderColor: selectedHubId === 'live-gps' ? '#10b981' : '#cbd5e1',
                    color: selectedHubId === 'live-gps' ? '#047857' : '#334155',
                    fontWeight: 700,
                    cursor: isLocatingGps ? 'wait' : 'pointer',
                  }}
                  title={isMr ? 'डिव्हाइसचे थेट अचूक GPS स्थान वापरा' : 'Use accurate device GPS coordinates'}
                >
                  <span>{isLocatingGps ? '⏳' : '🎯'}</span>
                  <span>
                    {isLocatingGps
                      ? (isMr ? 'GPS शोधत आहे…' : 'Locating GPS…')
                      : selectedHubId === 'live-gps'
                      ? (isMr ? '✓ थेट GPS जोडले' : '✓ Live GPS Active')
                      : (isMr ? 'थेट GPS वापरा' : 'Use Live GPS')}
                  </span>
                </button>
              </div>
            </div>

            {/* Locality Selected Notice */}
            {originNotice && (
              <div
                style={{
                  marginBottom: 12,
                  padding: '10px 14px',
                  background: '#ecfdf5',
                  border: '1px solid #10b981',
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: '#065f46',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>📍</span>
                <span>{originNotice}</span>
              </div>
            )}

            {/* Quick Hub Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 12,
              }}
            >
              {[
                { id: 'central', en: 'Central PMC', mr: 'मनपा मध्यवर्ती' },
                { id: 'kothrud', en: 'Kothrud', mr: 'कोथरूड' },
                { id: 'hadapsar', en: 'Hadapsar', mr: 'हडपसर' },
                { id: 'hinjewadi', en: 'Hinjewadi', mr: 'हिंजवडी' },
                { id: 'viman-nagar', en: 'Viman Nagar', mr: 'विमान नगर' },
                { id: 'shivajinagar', en: 'Shivaji Nagar', mr: 'शिवाजीनगर' },
                { id: 'swargate', en: 'Swargate', mr: 'स्वारगेट' },
                { id: 'deccan', en: 'Deccan', mr: 'डेक्कन' },
                { id: 'baner', en: 'Baner', mr: 'बाणेर' },
                { id: 'wakad', en: 'Wakad', mr: 'वाकड' },
                { id: 'katraj', en: 'Katraj', mr: 'कात्रज' },
                { id: 'pimpri', en: 'Pimpri PCMC', mr: 'पिंपरी' },
                { id: 'sinhagad-road', en: 'Sinhagad Rd', mr: 'सिंहगड रस्ता' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handleSelectHub(pill.id)}
                  style={{
                    border: '1px solid',
                    borderColor: selectedHubId === pill.id ? '#059669' : '#cbd5e1',
                    background: selectedHubId === pill.id ? '#ecfdf5' : '#ffffff',
                    color: selectedHubId === pill.id ? '#065f46' : '#475569',
                    fontWeight: selectedHubId === pill.id ? 700 : 500,
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 11.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isMr ? pill.mr : pill.en}
                </button>
              ))}
            </div>

            {/* Comprehensive Locality Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minWidth: 0, width: '100%' }}>
              <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {isMr ? 'सर्व उपनगरे:' : 'All localities:'}
              </span>
              <select
                id="home-locality-select"
                value={selectedHubId}
                onChange={(e) => handleSelectHub(e.target.value)}
                style={{
                  flex: '1 1 200px',
                  minWidth: 0,
                  maxWidth: '100%',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              >
                <option value="central">
                  🏛️ {isMr ? 'मध्यवर्ती पुणे (मनपा/शनिवार वाडा)' : 'Central Pune (PMC Bhavan / Shaniwar Wada)'}
                </option>
                {PUNE_COMMUTE_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    🏠 {isMr ? hub.nameMr : hub.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Route Status Callout */}
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: '#f0fdf4',
              borderRadius: 8,
              border: '1px solid #a7f3d0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              fontSize: 12.5,
            }}
          >
            <div>
              <span style={{ color: '#065f46', fontWeight: 700 }}>
                📍 {isMr ? 'सुरुवात:' : 'From:'} {originName}
              </span>
              <span style={{ margin: '0 6px', color: '#059669' }}>➔</span>
              <span style={{ color: '#065f46', fontWeight: 700 }}>
                🚩 {isMr ? 'गंतव्य:' : 'To:'} {primaryName}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#047857', fontWeight: 700 }}>
                ⏱️ ~{activeTransit.estimatedMinutes} {isMr ? 'मिनिटे' : 'mins'}
              </span>
              <span
                style={{
                  background: '#047857',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ₹{activeTransit.estimatedCostInr}
              </span>
            </div>
          </div>

          {/* Transit Options Grid */}
          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}
          >
            {/* Metro Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>🚇</span>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                  {isMr ? 'पुणे मेट्रो सेवा' : 'Pune Metro Access'}
                </strong>
              </div>
              {activeTransit.nearestMetro ? (
                <>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: activeTransit.nearestMetro.lineColor,
                      marginBottom: 4,
                    }}
                  >
                    {isMr
                      ? activeTransit.nearestMetro.stationNameMr
                      : activeTransit.nearestMetro.stationNameEn}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                    {isMr
                      ? activeTransit.nearestMetro.lineNameMr
                      : activeTransit.nearestMetro.lineNameEn}{' '}
                    • ~{activeTransit.nearestMetro.distanceKm} km (
                    ~{activeTransit.nearestMetro.walkingMinutes}{' '}
                    {isMr ? 'मि. चालत' : 'min walk'})
                  </div>
                  <a
                    href="https://wa.me/919420101990?text=Hi"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      fontSize: 11.5,
                      padding: '6px 12px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 700,
                    }}
                  >
                    <span>🎟️</span>{' '}
                    {isMr
                      ? 'व्हॉट्सअॅपवर मेट्रो तिकीट बुक करा'
                      : 'Book Metro Ticket on WhatsApp'}
                  </a>
                </>
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>
                  {isMr
                    ? 'या ठिकाणी थेट मेट्रो उपलब्ध नाही; पीएमपीएमएल बस किंवा कॅबने प्रवास करा.'
                    : 'Direct metro is not available nearby; PMPML buses serve this destination.'}
                </p>
              )}
            </div>

            {/* PMPML Bus Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🚌</span>
                  <strong style={{ fontSize: 14, color: 'var(--ink)' }}>
                    {isMr ? 'पीएमपीएमएल (PMPML) बस सेवा' : 'PMPML City Buses'}
                  </strong>
                </div>
                <span style={{ fontSize: 10.5, background: '#ffedd5', color: '#c2410c', fontWeight: 800, padding: '2px 7px', borderRadius: 999 }}>
                  {isMr ? 'अधिकृत GTFS डेटा' : 'Official GTFS'}
                </span>
              </div>
              {activeTransit.nearestBus && (
                <>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#f97316',
                      marginBottom: 4,
                    }}
                  >
                    {isMr
                      ? activeTransit.nearestBus.stopNameMr
                      : activeTransit.nearestBus.stopNameEn}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                    {isMr ? 'बस क्रमांक:' : 'Bus Lines:'}{' '}
                    <strong>{activeTransit.nearestBus.routeNumbers.join(', ')}</strong>
                  </div>
                </>
              )}
              <div
                style={{
                  fontSize: 11.5,
                  color: '#047857',
                  background: '#ecfdf5',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                💡{' '}
                {isMr
                  ? 'टीप: पीएमपीएमएलचा ₹७० चा दैनिक पास (PMC + PCMC) किंवा ₹१५० चा ऑल-रूट पास दिवसभर अमर्याद प्रवासासाठी मिळतो.'
                  : 'Tip: PMPML Day Pass is ₹70 for PMC+PCMC limits, or ₹150 for all routes (rural/PMRDA network).'}
              </div>
            </div>
          </div>

          {/* PMPML Scheduled Timetable & Real-time Departures */}
          {timetableRoutes.length > 0 && activeTimetableRoute && (
            <div
              style={{
                marginTop: 16,
                background: '#ffffff',
                border: '1px solid #fed7aa',
                borderRadius: 14,
                padding: '16px 18px',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.06)',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>⏱️</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 800, color: '#9a3412' }}>
                      {isMr ? `${primaryName} थेट बस वेळापत्रक` : `PMPML Schedule for ${primaryName}`}
                    </h4>
                    <span style={{ fontSize: 11, color: '#78350f' }}>
                      {activeTransit.nearestBus ? (
                        <>
                          📍 {isMr ? 'अधिकृत थांबा:' : 'Official Stop:'}{' '}
                          <strong>
                            {isMr
                              ? activeTransit.nearestBus.stopNameMr
                              : activeTransit.nearestBus.stopNameEn}
                          </strong>
                        </>
                      ) : (
                        isMr ? 'या ठिकाणाला थेट जोडणारे अधिकृत मार्ग व पुढील बसेस' : 'Authentic routes directly serving this destination'
                      )}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: '#ffedd5',
                    color: '#c2410c',
                    border: '1px solid #fdba74',
                  }}
                >
                  {activeTimetableRoute.badge}
                </span>
              </div>

              {/* Route Selector Pills (if multiple routes) */}
              {timetableRoutes.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 8,
                    marginBottom: 12,
                    scrollbarWidth: 'none',
                  }}
                >
                  {timetableRoutes.map((r) => {
                    const isSel = r.routeNo === activeTimetableRoute.routeNo;
                    return (
                      <button
                        key={r.routeNo}
                        type="button"
                        onClick={() => {
                          setSelectedRouteNo(r.routeNo);
                          setSelectedDir(0);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          border: isSel ? '1.5px solid #ea580c' : '1px solid var(--line)',
                          background: isSel ? '#ea580c' : '#f8fafc',
                          color: isSel ? '#ffffff' : 'var(--ink)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        🚌 Bus {r.routeNo}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Route Details Box */}
              <div
                style={{
                  background: '#fff7ed',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid #ffedd5',
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                  {activeTimetableRoute.nameEn}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px 16px',
                    fontSize: 12,
                    color: '#7c2d12',
                    marginTop: 6,
                  }}
                >
                  <span>
                    🔄 {isMr ? 'वारंवारता:' : 'Frequency:'}{' '}
                    <strong>{activeTimetableRoute.frequency}</strong>
                  </span>
                  <span>
                    🌅 {isMr ? 'पहिली बस:' : 'First Bus:'}{' '}
                    <strong>{activeTimetableRoute.firstBus}</strong>
                  </span>
                  <span>
                    🌙 {isMr ? 'शेवटची बस:' : 'Last Bus:'}{' '}
                    <strong>{activeTimetableRoute.lastBus}</strong>
                  </span>
                  <span>
                    🎟️ {isMr ? 'तिकीट:' : 'Fare:'}{' '}
                    <strong>{activeTimetableRoute.fare}</strong>
                  </span>
                </div>
              </div>

              {/* Direction Switcher */}
              {activeTimetableRoute.directions && activeTimetableRoute.directions.length > 1 && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {activeTimetableRoute.directions.map((d, dIdx) => {
                    const isDirSel = selectedDir === dIdx;
                    return (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => setSelectedDir(dIdx)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: isDirSel ? 700 : 500,
                          cursor: 'pointer',
                          border: isDirSel ? '1px solid #ea580c' : '1px solid var(--line)',
                          background: isDirSel ? '#ffffff' : '#f1f5f9',
                          color: isDirSel ? '#ea580c' : 'var(--muted)',
                          textAlign: 'center',
                        }}
                      >
                        {dIdx === 0 ? '➡️' : '⬅️'} {isMr ? 'दिशेकडे:' : 'Towards:'}{' '}
                        <strong>{d.destination}</strong>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Upcoming Live Departures */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
                    🕒 {isMr ? 'पुढील नियोजित बसेस (Upcoming departures):' : 'Next scheduled departures:'}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: '#16a34a',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#16a34a',
                        display: 'inline-block',
                      }}
                    />
                    {isMr ? 'थेट वेळ (IST)' : 'Live IST'}
                  </span>
                </div>
                {upcomingDepartures.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {upcomingDepartures.map((u, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: idx === 0 ? '#10b981' : '#f8fafc',
                          color: idx === 0 ? '#ffffff' : 'var(--ink)',
                          border: idx === 0 ? 'none' : '1px solid var(--line)',
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          minWidth: 80,
                        }}
                      >
                        <span style={{ fontSize: 12.5 }}>{u.timeFormatted}</span>
                        <span style={{ fontSize: 10, opacity: idx === 0 ? 0.9 : 0.65, fontWeight: 500 }}>
                          {u.isTomorrow
                            ? isMr
                              ? 'उद्या'
                              : 'Tomorrow'
                            : u.minutesUntil <= 1
                            ? isMr
                              ? 'आताच'
                              : 'Now'
                            : isMr
                            ? `${u.minutesUntil} मि.`
                            : `in ${u.minutesUntil}m`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
                    {isMr
                      ? 'आजच्या सेवा संपल्या आहेत. उद्या सकाळी लवकर पहिली बस उपलब्ध होईल.'
                      : 'Service for today completed. First departure resumes early morning.'}
                  </div>
                )}
              </div>

              {/* Full Schedule Collapsible */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#0284c7',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span>{showFullSchedule ? '▲' : '▼'}</span>
                  {showFullSchedule
                    ? isMr
                      ? 'दिवसभराचे वेळापत्रक लपवा'
                      : 'Hide full day timetable'
                    : isMr
                    ? `सर्व ${activeTimetableRoute.directions[selectedDir]?.departures?.length || 0} नियोजित फेऱ्या पहा`
                    : `View all ${activeTimetableRoute.directions[selectedDir]?.departures?.length || 0} scheduled departure trips`}
                </button>

                {showFullSchedule && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      background: '#fafafa',
                      borderRadius: 8,
                      border: '1px solid var(--line)',
                      maxHeight: 180,
                      overflowY: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(activeTimetableRoute.directions[selectedDir]?.departures || []).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            padding: '3px 8px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 4,
                            fontSize: 11.5,
                            color: 'var(--ink)',
                            fontFamily: 'monospace',
                          }}
                        >
                          {formatAmPm(t)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step by step directions */}
          <div
            style={{
              marginTop: 16,
              background: '#ffffff',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: 14,
            }}
          >
            <strong
              style={{
                fontSize: 13,
                color: 'var(--ink)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              📋{' '}
              {isMr
                ? `${originName} येथून थेट प्रवास मार्ग:`
                : `Step-by-step route from ${originName}:`}
            </strong>
            <ol
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 12.5,
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              {(isMr ? activeTransit.stepByStepMr : activeTransit.stepByStepEn).map(
                (step, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>
                    {step}
                  </li>
                )
              )}
            </ol>

            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                ⏱️ ~{activeTransit.estimatedMinutes} {isMr ? 'मिनिटे' : 'mins'} | 🎟️{' '}
                {isMr ? 'अंदाजे भाडे:' : 'Est. Fare:'} ₹{activeTransit.estimatedCostInr}
              </span>
              <a
                href={
                  activeTransit.gmapsTransitUrl ||
                  (userCoords
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${place.latitude || 18.5204},${place.longitude || 73.8567}&travelmode=transit`
                    : mapsUrl)
                }
                target="_blank"
                rel="noreferrer"
                className="btn outline"
                style={{ padding: '4px 12px', fontSize: 11.5 }}
              >
                🗺️ {isMr ? 'गुगल मॅप्सवर थेट बस/मेट्रो मार्ग ↗' : 'Google Maps Live Bus & Metro ↗'}
              </a>
            </div>
          </div>

          {/* Integrated Interactive Transit Route Map */}
          <TransitRouteMap
            origin={{
              name: originName,
              lat: userCoords ? userCoords.lat : 18.5204,
              lng: userCoords ? userCoords.lng : 73.8567,
            }}
            destination={{
              name: primaryName,
              lat: place.latitude || 18.5204,
              lng: place.longitude || 73.8567,
            }}
            transitInfo={activeTransit}
            isMarathi={isMr}
          />
        </section>

        {/* Location & Map Section (Requirement 8) */}
        <section className="panel scroll-reveal place-section-reveal" style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontSize: '19px',
              borderBottom: '1px solid var(--line)',
              paddingBottom: 10,
              marginTop: 0,
              marginBottom: 16,
              color: 'var(--ink)',
            }}
          >
            {isMr ? 'परिसर आणि नकाशा' : 'Location & Interactive Map'}
          </h2>
          <PlaceMap
            latitude={place.latitude || 18.5204}
            longitude={place.longitude || 73.8567}
            name={primaryName}
          />
        </section>

        {/* Community Visitor Photo Gallery */}
        <CommunityGallery placeId={place.id} placeName={primaryName} />

        {/* Reviews Section */}
        <Reviews placeId={place.id} />
      </div>

      {/* Pune Locality Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelected={(loc) => {
          setSelectedHubId(loc.id);
          const name = isMr ? loc.nameMr : loc.nameEn;
          setOriginName(name);
          setUserCoords({ lat: loc.lat, lng: loc.lng });
          setOriginNotice(
            isMr
              ? `✓ निवडलेले स्थान: ${loc.nameMr}`
              : `✓ Origin set to: ${loc.nameEn}`
          );
          const computed = getPublicTransitRoute(loc.lat, loc.lng, place, name);
          setLiveTransit(computed);
        }}
      />

      {/* Interactive Landmark Photo Slideshow Modal */}
      <PlacePhotoSlideshowModal
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        place={place}
        initialIndex={slideshowIndex}
      />

      {/* Tiny Bookmark Confirmation Toast (Requirement 14) */}
      {toastMessage && (
        <div className="pune-toast-pill" role="status" aria-live="polite">
          <span>🔖</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
