'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useExperience } from '@/components/experience/context/ExperienceContext';
import { getPlaygroundGameData } from '@/lib/experience/selectors';
import { playgroundAudio } from './playgroundAudio';
import { markGameCompleted, PLAYGROUND_STAMPS } from './playgroundMilestone';
import {
  Compass,
  RotateCcw,
  FastForward,
  Award,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
} from 'lucide-react';

interface RelicInspectorGameProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  labelEn: string;
  labelMr: string;
  detailEn: string;
  detailMr: string;
}

interface HistoricalRelic {
  id: string;
  nameEn: string;
  nameMr: string;
  epochEn: string;
  epochMr: string;
  materialEn: string;
  materialMr: string;
  provenanceEn: string;
  provenanceMr: string;
  descriptionEn: string;
  descriptionMr: string;
  icon: string;
  color: string;
  hotspots: Hotspot[];
}

const HISTORIC_RELICS: HistoricalRelic[] = [
  {
    id: 'tambat-bamb',
    nameEn: 'Kasba Tambat Copper Bamb (Water Boiler)',
    nameMr: 'कसबा पेठ पारंपरिक तांब्याचा बंब',
    epochEn: '18th Century Peshwa Era',
    epochMr: '१८ वे शतक • पेशवे काळ',
    materialEn: 'Hand-beaten Pure Red Copper (Matharkaam) with Brass Base',
    materialMr: 'हाताने ठोकलेले अस्सल तांबे (माथारकाम) व पितळी तळ',
    provenanceEn: 'Tambat Ali Artisanal Quarter, Kasba Peth, Pune',
    provenanceMr: 'तांबट आळी कारागीर वस्ती, कसबा पेठ, पुणे',
    descriptionEn:
      'Ingenious pre-electrical thermal engineering: a vertical cylindrical copper boiler containing an internal vertical charcoal flue that heats 20 litres of bath water in under 12 minutes.',
    descriptionMr:
      'विद्युत उपकरणांशिवाय पाणी तापवण्याचा पारंपरिक चमत्कार: मध्यभागी कोळशाची शेगडी आणि भोवताली २० लिटर पाणी १२ मिनिटांत उकळवणारा तांबट कारागिरांचा बंब.',
    icon: '🏺',
    color: '#b45309',
    hotspots: [
      {
        id: 'h1',
        x: 50,
        y: 25,
        labelEn: 'Charcoal Exhaust Flue',
        labelMr: 'मध्यवर्ती कोळशाची धुरी',
        detailEn:
          'Vertical brass flue passing through the water chamber to maximize thermal convection.',
        detailMr: 'पाण्याच्या मधोमध जाणारी पितळी नळी, ज्यामुळे उष्णता संपूर्ण पाण्यात वेगाने पसरते.',
      },
      {
        id: 'h2',
        x: 75,
        y: 60,
        labelEn: 'Hand-Hammered Matharkaam Relief',
        labelMr: 'माथारकाम नक्षी व मजबूती',
        detailEn:
          'Over 1,200 individual hammer dimples increasing tensile resistance to hydrostatic pressure.',
        detailMr:
          '१,२०० हून अधिक हाताने मारलेले खळगे, ज्यामुळे तांब्याचा पृष्ठभाग कडक व मजबूत बनतो.',
      },
      {
        id: 'h3',
        x: 25,
        y: 75,
        labelEn: 'Cast-Bronze Spigot Tap',
        labelMr: 'ओतीव पितळी तोटी (नळ)',
        detailEn:
          'Threaded bronze brass tap allowing safe dispensing of hot water into copper buckets.',
        detailMr: 'गरम पाणी बाहेर काढण्यासाठी बसवलेली अस्सल ओतीव पितळी तोटी.',
      },
    ],
  },
  {
    id: 'peshwa-seal',
    nameEn: 'Peshwa Imperial Royal Seal (राजमुद्रा)',
    nameMr: 'पेशवे शाही मोर्तब व राजमुद्रा',
    epochEn: '1732–1818 CE Peshwa Regime',
    epochMr: 'इ.स. १७३२–१८१८ • पेशवे साम्राज्य',
    materialEn: 'Cast Bronze and Panchadhatu Alloy with Teak Handle',
    materialMr: 'पंचधातू व ब्राँझ मोर्तब, सागवानी लाकडी मूठ',
    provenanceEn: 'Shaniwar Wada Archives & State Secretariat, Pune',
    provenanceMr: 'शनिवार वाडा दप्तरखाना, पुणे',
    descriptionEn:
      'The sacred state seal used by the Peshwa Prime Ministers to ratify treaties, land grants (Sanads), and royal decrees across the Maratha Empire from Attock to Cuttack.',
    descriptionMr:
      'अटक ते कटक पसरलेल्या मराठा साम्राज्यात तह, सनदा आणि हुकूमनाम्यांवर अधिकृत शिक्कामोर्तब करणारी पेशव्यांची राजमुद्रा.',
    icon: '📜',
    color: '#ea580c',
    hotspots: [
      {
        id: 'h1',
        x: 50,
        y: 30,
        labelEn: 'Modi Script Inscription',
        labelMr: 'मोडी लिपीतील अक्षरमुद्रा',
        detailEn:
          'Engraved in fluent Modi cursive: “श्री राजा शिवछत्रपतींच्या आज्ञेने चालणारे...”',
        detailMr: '“श्री राजा शिवछत्रपती” यांच्या नावाने कारभार करण्याची नम्र घोषणा करणारी मोडी अक्षरे.',
      },
      {
        id: 'h2',
        x: 35,
        y: 65,
        labelEn: 'Panchadhatu Metallurgy',
        labelMr: 'पंचधातूचे मिश्रण',
        detailEn:
          'Five sacred metals ensuring indelible vermilion ink impressions without corrosion.',
        detailMr: 'तांबे, पितळ, जस्त, सोने व चांदीचे प्रमाण, ज्यामुळे शेकडो वर्षे शिक्का झिजत नाही.',
      },
      {
        id: 'h3',
        x: 70,
        y: 70,
        labelEn: 'Imperial Sun & Crescent Emblem',
        labelMr: 'सूर्य व अर्धचंद्र कोरिव काम',
        detailEn:
          'Emblem signifying that the charter endures as long as the sun and moon shine in the sky.',
        detailMr: '“यावच्चंद्रदिवाकरौ” — सूर्य आणि चंद्र असेपर्यंत हे दानपत्र अबाधित राहील हे दर्शवणारे चिन्ह.',
      },
    ],
  },
  {
    id: 'tanaji-dhal',
    nameEn: 'Tanaji’s Rhino-Hide Battle Shield (ढाल)',
    nameMr: 'नरवीर तानाजींची गेंड्याच्या कातडीची ढाल',
    epochEn: '1670 CE Battle of Sinhagad',
    epochMr: 'इ.स. १६७० • सिंहगड युद्ध',
    materialEn: 'Rhinoceros Hide, Steel Bosses, and Velvet Padding',
    materialMr: 'कडक गेंड्याचे कातडे, पोलादी नक्षीदार बोंडे, मखमली अस्तर',
    provenanceEn: 'Sinhagad Memorial & Raja Dinkar Kelkar Collection',
    provenanceMr: 'सिंहगड स्मारक व राजा केळकर संग्रहालय संग्रह',
    descriptionEn:
      'The legendary curved Maratha battle shield carried during the night assault on Sinhagad. Rhino hide was renowned for stopping musket balls and sword thrusts while remaining remarkably lightweight.',
    descriptionMr:
      'सिंहगडाच्या रात्रीच्या मोहिमेत वापरलेली वजनाने हलकी पण तलवारीचे वार रोखणारी अत्यंत मजबूत गेंड्याच्या कातडीची ढाल.',
    icon: '🛡️',
    color: '#78350f',
    hotspots: [
      {
        id: 'h1',
        x: 50,
        y: 50,
        labelEn: 'Central Tempered Steel Boss',
        labelMr: 'मध्यवर्ती पोलादी बोंड',
        detailEn:
          'High-carbon Maratha Wootz steel boss designed to shatter enemy sword blades upon impact.',
        detailMr: 'शत्रूच्या तलवारीचा वार अडवून तिची धार मोडण्यासाठी मध्यभागी बसवलेले कठीण पोलाद.',
      },
      {
        id: 'h2',
        x: 30,
        y: 35,
        labelEn: 'Boiled Rhino Hide Layer',
        labelMr: 'उकळवून कडक केलेले कातडे',
        detailEn:
          'Rhinoceros leather treated in medicinal oils, practically impervious to Mughal curved talwars.',
        detailMr: 'विशेष तेलात प्रक्रिया करून वज्रासारखे मजबूत बनवलेले कातडे.',
      },
      {
        id: 'h3',
        x: 70,
        y: 70,
        labelEn: 'Inner Grip Ring System',
        labelMr: 'आतील पकडीच्या कड्या',
        detailEn:
          'Dual leather strap grips and cotton padded cushion protecting knuckles during combat impact.',
        detailMr: 'हाताला हिसका बसू नये म्हणून आतमध्ये मऊ गादी आणि दोन चामडी पट्टे.',
      },
    ],
  },
  {
    id: 'gandhi-charkha',
    nameEn: 'Gandhi’s Yerwada Folding Box Charkha (पेटी चरखा)',
    nameMr: 'गांधीजींचा येरवडा लाकडी पेटी चरखा',
    epochEn: '1930 CE Freedom Movement',
    epochMr: 'इ.स. १९३० • स्वातंत्र्य लढा',
    materialEn: 'Polished Indian Teakwood, Brass Spindle, and Cotton Cord',
    materialMr: 'पॉलिश केलेले सागवान, पितळी तकळी व सुती दोरी',
    provenanceEn: 'Yerwada Central Jail & National Gandhi Memorial Pune',
    provenanceMr: 'येरवडा मध्यवर्ती कारागृह व राष्ट्रीय गांधी स्मारक, पुणे',
    descriptionEn:
      'The compact, book-sized folding wooden spinning wheel conceptualized inside Yerwada Central Jail in Pune. Designed for utmost portability so freedom fighters could spin khadi yarn while traveling.',
    descriptionMr:
      'पुण्याच्या येरवडा कारागृहात कैदेत असताना तयार केलेला जगातील पहिला पुस्तकासारखा मिटणारा पेटी चरखा, ज्याने स्वदेशी चळवळ घराघरांत पोहोचवली.',
    icon: '🧵',
    color: '#0284c7',
    hotspots: [
      {
        id: 'h1',
        x: 40,
        y: 40,
        labelEn: 'Book-Fold Teakwood Box',
        labelMr: 'पुस्तकासारखी मिटणारी पेटी',
        detailEn:
          'Folds flat into a 9x12 inch wooden case with brass clasp, easily carried under the arm.',
        detailMr: 'सहज प्रवासात नेता यावी म्हणून बनवलेली सागवानी लाकडी पेटी.',
      },
      {
        id: 'h2',
        x: 75,
        y: 45,
        labelEn: 'Precision Ratio Spindle Wheel',
        labelMr: 'अचूक गती देणारी चक्रे',
        detailEn:
          'Geared pulleys providing a 1:40 ratio for spinning ultra-fine count Khadi thread smoothly.',
        detailMr: 'बारीक सुत कातण्यासाठी १:४० चे गुणोत्तर देणारी लहान-मोठी चक्रे.',
      },
      {
        id: 'h3',
        x: 55,
        y: 80,
        labelEn: 'Yerwada Jail Production Stamp',
        labelMr: 'येरवडा कारागृह छाप',
        detailEn:
          'Historical stamp inscribed: “Yeravda Portable Charkha — Swaraj Through Self-Reliance”.',
        detailMr: 'स्वावलंबनातून स्वराज्याचा संदेश देणारा ऐतिहासिक येरवडा कारागृहाचा शिक्का.',
      },
    ],
  },
  {
    id: 'bsa-bicycle',
    nameEn: '1914 BSA Military Folding Paratrooper Bicycle',
    nameMr: '१९१४ ची मिलिटरी फोल्डिंग सायकल',
    epochEn: '1914–1918 CE WWI & Pune Cantonment',
    epochMr: 'इ.स. १९१४ • पहिले महायुद्ध व पुणे छावणी',
    materialEn: 'Tubular British Steel, Leather Brooks Saddle, Solid Rubber',
    materialMr: 'मजबूत ब्रिटिश स्टील पाईप, लेदर सीट, रबरी टायर',
    provenanceEn: 'Pune Military Cantonment & Southern Command Heritage Cell',
    provenanceMr: 'पुणे लष्कर छावणी व दक्षिण कमान संग्रहालय',
    descriptionEn:
      'A remarkable early 20th-century folding tactical bicycle used by Pune garrison dispatch riders. It hinges in the center within 10 seconds to be strapped to soldiers’ backs or vehicles.',
    descriptionMr:
      'पुण्याच्या लष्कर छावणीत वापरली जाणारी १० सेकंदात दुमडणारी लष्करी सायकल; पहिल्या महायुद्धात संदेशवहनासाठी क्रांतिकारी ठरली.',
    icon: '🚲',
    color: '#059669',
    hotspots: [
      {
        id: 'h1',
        x: 50,
        y: 45,
        labelEn: 'Central Wing-Nut Folding Hinge',
        labelMr: 'मध्यवर्ती विंग-नट बिजागरी',
        detailEn:
          'Dual quick-release wing-nuts enabling the entire tubular frame to fold parallel.',
        detailMr: 'हात फिरवून अवघ्या काही सेकंदांत सायकल दुमडता येणारी खास बिजागरी.',
      },
      {
        id: 'h2',
        x: 30,
        y: 65,
        labelEn: 'Puncture-Proof Military Tires',
        labelMr: 'पंक्चर-प्रूफ लष्करी टायर्स',
        detailEn:
          'Reinforced rubber tread suited for rugged Deccan basalt gravel and wet cantonment terrain.',
        detailMr: 'दगडाळ सह्याद्री वाटांवर सहज धावणारे मजबूत लष्करी रबरी टायर.',
      },
      {
        id: 'h3',
        x: 75,
        y: 35,
        labelEn: 'Turnable Quick-Lock Handlebars',
        labelMr: 'वळवता येणारे हँडल',
        detailEn:
          'Handlebars rotated 90 degrees parallel to the frame for compact storage in trenches.',
        detailMr: 'कमी जागेत ठेवता यावे म्हणून फ्रेमला समांतर होणारे हँडल.',
      },
    ],
  },
];

export default function RelicInspectorGame({ onComplete, onSkip }: RelicInspectorGameProps) {
  const { isMr, isLiteMode, isAudioEnabled } = useExperience();
  const gameData = getPlaygroundGameData().relicGame;

  // Sync audio mute state
  useEffect(() => {
    playgroundAudio.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  // Current relic index (0 to 4)
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const activeRelic = HISTORIC_RELICS[currentIdx];

  // 3D Card tilt angles
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [manualRotation, setManualRotation] = useState<number>(0);

  // Active inspected hotspot
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Track inspected relics
  const [inspectedRelics, setInspectedRelics] = useState<string[]>([HISTORIC_RELICS[0].id]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Card reference for mouse tilt
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle card tilt on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLiteMode || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -12;
      const rotY = ((x - centerX) / centerX) * 15;

      setRotateX(rotX);
      setRotateY(rotY);
    },
    [isLiteMode]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  // Hotspot click
  const handleHotspotClick = useCallback(
    (hotspot: Hotspot) => {
      setActiveHotspot(hotspot);
      playgroundAudio.playRelicChime();

      // Mark this relic as inspected
      if (!inspectedRelics.includes(activeRelic.id)) {
        const next = [...inspectedRelics, activeRelic.id];
        setInspectedRelics(next);

        if (next.length >= HISTORIC_RELICS.length && !isCompleted) {
          setIsCompleted(true);
          playgroundAudio.playSuccessChime();
          markGameCompleted('relic');
          if (onComplete) setTimeout(onComplete, 1400);
        }
      }
    },
    [activeRelic.id, inspectedRelics, isCompleted, onComplete]
  );

  // Next / Prev relic navigation
  const handlePrevRelic = useCallback(() => {
    setActiveHotspot(null);
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : HISTORIC_RELICS.length - 1));
    playgroundAudio.playRelicChime();
  }, []);

  const handleNextRelic = useCallback(() => {
    setActiveHotspot(null);
    setCurrentIdx((prev) => (prev < HISTORIC_RELICS.length - 1 ? prev + 1 : 0));
    playgroundAudio.playRelicChime();

    const nextRelicId = HISTORIC_RELICS[(currentIdx + 1) % HISTORIC_RELICS.length].id;
    if (!inspectedRelics.includes(nextRelicId)) {
      const next = [...inspectedRelics, nextRelicId];
      setInspectedRelics(next);
      if (next.length >= HISTORIC_RELICS.length && !isCompleted) {
        setIsCompleted(true);
        playgroundAudio.playSuccessChime();
        markGameCompleted('relic');
        if (onComplete) setTimeout(onComplete, 1400);
      }
    }
  }, [currentIdx, inspectedRelics, isCompleted, onComplete]);

  // Reset
  const handleReset = useCallback(() => {
    setCurrentIdx(0);
    setActiveHotspot(null);
    setInspectedRelics([HISTORIC_RELICS[0].id]);
    setIsCompleted(false);
  }, []);

  // Skip
  const handleSkip = useCallback(() => {
    markGameCompleted('relic');
    setIsCompleted(true);
    setInspectedRelics(HISTORIC_RELICS.map((r) => r.id));
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevRelic();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextRelic();
      } else if (e.key >= '1' && e.key <= '3') {
        const hIdx = parseInt(e.key, 10) - 1;
        if (activeRelic.hotspots[hIdx]) {
          handleHotspotClick(activeRelic.hotspots[hIdx]);
        }
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevRelic, handleNextRelic, handleHotspotClick, handleReset, activeRelic]);

  const completedStamp = PLAYGROUND_STAMPS.relic;

  return (
    <div
      className="exp-relic-inspector"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '1.5rem',
        borderRadius: '1.25rem',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(8, 11, 17, 0.98))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.1)',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            <Compass size={12} />
            <span>{isMr ? 'खेळ ४: राजा केळकर संग्रहालय खजिना' : 'GAME 4: KELKAR RELIC INSPECTOR'}</span>
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: isMr ? 'var(--exp-font-display-mr)' : 'var(--exp-font-display-en)',
              color: '#f8fafc',
            }}
          >
            {isMr ? gameData.titleMr : gameData.titleEn}
          </h3>
          <p
            style={{
              margin: '0.35rem 0 0 0',
              fontSize: '0.875rem',
              color: '#94a3b8',
              maxWidth: '650px',
              lineHeight: 1.5,
            }}
          >
            {isMr
              ? 'पुण्याच्या इतिहासातील ५ दुर्मिळ ऐतिहासिक वस्तूंची ३D तपासणी करा: तांबट बंब, पेशवे मुद्रा, तानाजींची ढाल, येरवडा चरखा आणि १९१४ ची सायकल.'
              : 'Interactive 3D card tilt & layered examination of 5 authentic Pune historical relics: Kasba Tambat copper bamb, Peshwa seal, Tanaji’s rhino dhal, Gandhi’s Yerwada charkha, and 1914 folding bicycle.'}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleReset}
            className="exp-btn-subtle"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              cursor: 'pointer',
              minHeight: '44px',
            }}
            title={isMr ? 'पुन्हा सुरुवात करा (R)' : 'Reset (R)'}
            aria-label={isMr ? 'खेळ रीसेट करा' : 'Reset relic inspection'}
          >
            <RotateCcw size={14} />
            <span>{isMr ? 'रीसेट' : 'Reset'}</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="exp-btn-skip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
            }}
            aria-label={isMr ? 'हा खेळ वगळा' : 'Skip this game'}
          >
            <FastForward size={14} />
            <span>{isMr ? 'वगळा (Skip)' : 'Skip Game'}</span>
          </button>
        </div>
      </div>

      {/* Relic Carousel Thumbnails */}
      <div
        role="tablist"
        aria-label={isMr ? 'ऐतिहासिक वस्तूंची यादी' : 'Historical Relics Selector'}
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'thin',
        }}
      >
        {HISTORIC_RELICS.map((relic, idx) => {
          const isSelected = idx === currentIdx;
          const isInspected = inspectedRelics.includes(relic.id);
          return (
            <button
              key={relic.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setCurrentIdx(idx);
                setActiveHotspot(null);
                playgroundAudio.playRelicChime();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.6rem',
                background: isSelected
                  ? 'rgba(56, 189, 248, 0.2)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? '1px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: isSelected ? '#fff' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minHeight: '44px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{relic.icon}</span>
              <span>{idx + 1}. {isMr ? relic.nameMr.split(' ')[0] : relic.nameEn.split(' ')[0]}</span>
              {isInspected && <CheckCircle2 size={13} color="#10b981" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: 3D Tilt Card + Detailed Archival Ledger */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
          alignItems: 'center',
        }}
      >
        {/* Left: 3D Tilting Relic Card with Interactive Hotspots */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: '1000px',
            position: 'relative',
            height: '350px',
            borderRadius: '1rem',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '1rem',
              background: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.7) 0%, rgba(8, 11, 17, 0.98) 90%)`,
              border: `2px solid ${activeRelic.color}66`,
              boxShadow: `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px ${activeRelic.color}33`,
              transform: isLiteMode
                ? 'none'
                : `rotateX(${rotateX}deg) rotateY(${rotateY + manualRotation}deg) scale3d(1.02, 1.02, 1.02)`,
              transition: 'transform 0.1s ease-out, border-color 0.4s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Relic Specular Highlight & Glass Shine */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Giant Relic Icon Illustration */}
            <div
              style={{
                fontSize: '5.5rem',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.8))',
                transform: 'scale(1.15)',
                userSelect: 'none',
              }}
            >
              {activeRelic.icon}
            </div>

            {/* Relic Epoch Badge */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.72rem',
                color: '#fdba74',
                fontWeight: 600,
                fontFamily: 'var(--exp-font-mono)',
              }}
            >
              {isMr ? activeRelic.epochMr : activeRelic.epochEn}
            </div>

            {/* 3 Hotspot Pins on Relic Card */}
            {activeRelic.hotspots.map((hotspot, hIdx) => {
              const isActive = activeHotspot?.id === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => handleHotspotClick(hotspot)}
                  style={{
                    position: 'absolute',
                    top: `${hotspot.y}%`,
                    left: `${hotspot.x}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive ? '#38bdf8' : 'rgba(234, 88, 12, 0.9)',
                    border: '2px solid #fff',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                    cursor: 'pointer',
                    zIndex: 4,
                    animation: 'pulse 1.5s infinite alternate',
                  }}
                  title={isMr ? hotspot.labelMr : hotspot.labelEn}
                  aria-label={`Hotspot ${hIdx + 1}: ${
                    isMr ? hotspot.labelMr : hotspot.labelEn
                  }`}
                >
                  {hIdx + 1}
                </button>
              );
            })}

            {/* 3D Tilt Instruction Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                fontSize: '0.7rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              <Eye size={12} />
              <span>
                {isMr
                  ? 'माऊस फिरवून ३D कार्ड वळवा किंवा १-३ दाबून तपासा'
                  : 'Move cursor to 3D tilt card • Press 1-3 for hotspots'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Archival Inspection Ledger & Hotspot Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Relic Archival Ledger */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.85rem',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.65rem',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                }}
              >
                {isMr ? activeRelic.nameMr : activeRelic.nameEn}
              </h4>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#38bdf8',
                  fontFamily: 'var(--exp-font-mono)',
                }}
              >
                {currentIdx + 1} / {HISTORIC_RELICS.length}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                lineHeight: 1.5,
                margin: '0 0 0.85rem 0',
              }}
            >
              {isMr ? activeRelic.descriptionMr : activeRelic.descriptionEn}
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                fontSize: '0.78rem',
                color: '#94a3b8',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '0.65rem',
              }}
            >
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isMr ? 'धातू/घटक: ' : 'Material: '}</strong>
                {isMr ? activeRelic.materialMr : activeRelic.materialEn}
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isMr ? 'स्थान/नोंद: ' : 'Provenance: '}</strong>
                {isMr ? activeRelic.provenanceMr : activeRelic.provenanceEn}
              </div>
            </div>
          </div>

          {/* Active Hotspot Detail Card */}
          {activeHotspot ? (
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                animation: 'fadeInUp 0.3s ease',
              }}
            >
              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  marginBottom: '0.35rem',
                }}
              >
                🔍 {isMr ? activeHotspot.labelMr : activeHotspot.labelEn}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.5 }}>
                {isMr ? activeHotspot.detailMr : activeHotspot.detailEn}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '0.85rem',
                borderRadius: '0.75rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                fontSize: '0.8rem',
                color: '#94a3b8',
                textAlign: 'center',
              }}
            >
              {isMr
                ? '३D कार्डवरील १, २ किंवा ३ क्रमांकाच्या बिंदूवर टॅप करून ऐतिहासिक माहिती तपासा'
                : 'Click hotspot points 1, 2, or 3 on the 3D card to examine archival details'}
            </div>
          )}

          {/* Carousel Next / Prev Controls */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handlePrevRelic}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '44px',
              }}
              aria-label={isMr ? 'मागील वस्तू तपासा' : 'Previous Relic'}
            >
              <ChevronLeft size={16} />
              <span>{isMr ? 'मागील वस्तू' : 'Previous'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextRelic}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                border: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: '44px',
              }}
              aria-label={isMr ? 'पुढील वस्तू तपासा' : 'Next Relic'}
            >
              <span>{isMr ? 'पुढील वस्तू' : 'Next Relic'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '1.25rem',
            borderRadius: '0.85rem',
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'fadeInUp 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={22} color="#facc15" />
            <strong style={{ fontSize: '1.05rem', color: '#fef08a' }}>
              {isMr
                ? 'अभिनंदन! ५ ऐतिहासिक वस्तूंचे सखोल निरीक्षण पूर्ण!'
                : 'Priceless artifact cataloged with museum records!'}
            </strong>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
            }}
          >
            <Info size={16} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              {isMr ? (
                <>
                  <strong>राजा दिनकर केळकर संग्रहालय (२०,०००+ वस्तू संग्रह):</strong> डॉ. दिनकर
                  केळकरांनी संपूर्ण भारतभरातून गोळा केलेल्या ऐतिहासिक साधनांची नोंद तुमच्या
                  पासपोर्टमध्ये झाली आहे. तुमचा डिजिटल पासपोर्ट शिक्का अनलॉक झाला आहे!
                </>
              ) : (
                <>
                  <strong>Raja Dinkar Kelkar Museum (20,000+ Curated Relics):</strong> You have
                  examined the everyday masterpieces of Maratha craftsmanship and history. Your
                  Kelkar Museum Curator digital stamp has been awarded!
                </>
              )}
            </div>
          </div>

          <div
            style={{
              alignSelf: 'flex-start',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              fontSize: '0.75rem',
              color: '#fef08a',
              fontWeight: 600,
            }}
          >
            {completedStamp.icon} {isMr ? completedStamp.titleMr : completedStamp.titleEn} •{' '}
            {isMr ? completedStamp.sealTextMr : completedStamp.sealTextEn}
          </div>
        </div>
      )}
    </div>
  );
}
