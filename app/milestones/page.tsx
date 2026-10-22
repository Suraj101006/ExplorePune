'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/LanguageContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { compressImageFile } from '@/lib/imageUtils';
import { downloadCertificatePdf } from '@/lib/generateCertificatePdf';
import { getActiveTrip, ActiveTrip } from '@/lib/activeTrip';

interface MilestoneItem {
  id: string;
  badge: string;
  nameEn: string;
  nameMr: string;
  descEn: string;
  descMr: string;
  criteriaType: 'distinct_places' | 'approved_blogs';
  criteriaValue: number;
  categoryLink: string;
  actionTextEn: string;
  actionTextMr: string;
  badgeImg: string;
}

interface PlaceOption {
  id: string;
  slug: string;
  name: string;
  name_mr?: string;
}

interface PublicCommunityCheckin {
  id: string;
  place_name: string;
  user_name: string;
  visited_at: string;
  image_url: string;
  notes?: string;
}

const MILESTONES_DATA: MilestoneItem[] = [
  {
    id: 'm1',
    badge: '🚩',
    nameEn: 'First Step: Punekar Initiate',
    nameMr: 'पहिलं पाऊल: पुणेकर प्रारंभ',
    descEn: 'Set foot into Pune’s living history! Check in with photo proof at your first landmark.',
    descMr: 'ऐतिहासिक पुण्यात तुमचं पहिलं पाऊल! पहिल्या ऐतिहासिक वास्तूचा फोटो जोडून प्रवास सुरू करा.',
    criteriaType: 'distinct_places',
    criteriaValue: 1,
    categoryLink: '/places/shaniwar-wada',
    actionTextEn: 'Unlock Shaniwar Wada ➔',
    actionTextMr: 'शनिवार वाडा अनलॉक करा ➔',
    badgeImg: '/images/places/shaniwar-wada.jpg',
  },
  {
    id: 'm2',
    badge: '🥾',
    nameEn: 'Tekdi Champion: Sunrise Conqueror',
    nameMr: 'टेकडी सम्राट: सकाळचा भ्रमंतीवीर',
    descEn: 'Embrace Pune’s legendary morning ritual! Summit 2 hills like Vetal Tekdi, Taljai, or Parvati.',
    descMr: 'अस्सल पुणेरी सकाळ! वेताळ टेकडी, तळजाई अथवा पर्वती अशा २ मानाच्या टेकड्यांवर शिखर गाठा.',
    criteriaType: 'distinct_places',
    criteriaValue: 2,
    categoryLink: '/places/vetal-tekdi',
    actionTextEn: 'Climb Vetal Tekdi ➔',
    actionTextMr: 'वेताळ टेकडी चढा ➔',
    badgeImg: '/images/places/vetal-tekdi.jpg',
  },
  {
    id: 'm3',
    badge: '⚔️',
    nameEn: 'Sahyadri Shiledar: Fortress Conqueror',
    nameMr: 'सह्याद्री शिलेदार: गडकोट दुर्गवीर',
    descEn: 'Walk the battlegrounds of Tanaji & Shivaji Maharaj! Conquer 3 Sahyadri fortresses.',
    descMr: 'तानाजी मालुसरे व शिवरायांच्या पदस्पर्शाने पावन झालेले सह्याद्रीचे ३ अभेद्य गड-किल्ले सर करा!',
    criteriaType: 'distinct_places',
    criteriaValue: 3,
    categoryLink: '/places/sinhagad-fort',
    actionTextEn: 'Scale Sinhagad Citadel ➔',
    actionTextMr: 'सिंहगड गडकोट सर करा ➔',
    badgeImg: '/images/places/sinhagad-fort.jpg',
  },
  {
    id: 'm4',
    badge: '🏛️',
    nameEn: 'Peshwa Royal Envoy: Wada Whisperer',
    nameMr: 'पेशवाई वारसदार: पेठा व वाडे भ्रमंती',
    descEn: 'Enter the seat of imperial Maratha power! Explore 4 royal wadas and historic peth mansions.',
    descMr: 'मराठा साम्राज्याचा गौरवशाली इतिहास! शनिवार वाडा, विश्रामबाग वाडा अशा ४ ऐतिहासिक वास्तूंचा वेध घ्या.',
    criteriaType: 'distinct_places',
    criteriaValue: 4,
    categoryLink: '/places/vishrambaug-wada',
    actionTextEn: 'Discover Vishrambaug Wada ➔',
    actionTextMr: 'विश्रामबाग वाडा शोधा ➔',
    badgeImg: '/images/places/vishrambaug-wada.jpg',
  },
  {
    id: 'm5',
    badge: '🛕',
    nameEn: 'Devasthan Darshan: Puneri Pilgrim',
    nameMr: 'मंगलमूर्ती भक्त: पुण्यनगरी तीर्थयात्रा',
    descEn: 'From 8th-century basalt shrines to Dagdusheth: seek blessings at 5 sacred temples.',
    descMr: '८व्या शतकातील पाताळेश्वर ते लाडक्या दगडूशेठ गणपतीपर्यंत ५ पवित्र देवस्थानांचे मंगल दर्शन घ्या.',
    criteriaType: 'distinct_places',
    criteriaValue: 5,
    categoryLink: '/places/shreemant-dagdusheth-halwai-ganpati',
    actionTextEn: 'Darshan at Dagdusheth ➔',
    actionTextMr: 'दगडूशेठ गणपती दर्शन ➔',
    badgeImg: '/images/places/shreemant-dagdusheth-halwai-ganpati.jpg',
  },
  {
    id: 'm6',
    badge: '🌊',
    nameEn: 'Valley Wanderer: Ghats & Waters',
    nameMr: 'घाटमाथा भटकंती: जलधारा व निसर्गदूत',
    descEn: 'Chase the mist of the Western Ghats! Trace 6 scenic dams, roaring waterfalls, or lakes.',
    descMr: 'सह्याद्रीच्या कुशीतील खडकवासला, मुळशी अथवा पानशेत अशा ६ निसर्गरम्य तलाव व जलधारांना भेट द्या.',
    criteriaType: 'distinct_places',
    criteriaValue: 6,
    categoryLink: '/places/khadakwasla-dam',
    actionTextEn: 'Breeze at Khadakwasla ➔',
    actionTextMr: 'खडकवासला सफरीला चला ➔',
    badgeImg: '/images/places/khadakwasla-dam.jpg',
  },
  {
    id: 'm7',
    badge: '📜',
    nameEn: 'Living Archive: Cultural Curator',
    nameMr: 'इतिहास संशोधक: वारसा दालन शिरोमणी',
    descEn: 'Decode 20,000+ antiquities and wartime valour! Visit 7 curated museums and national memorials.',
    descMr: 'राजा केळकर संग्रहालय, राष्ट्रीय युद्ध स्मारक अशा ७ ज्ञानमंदिरे व वारसा दालनांची मुशाफिरी करा.',
    criteriaType: 'distinct_places',
    criteriaValue: 7,
    categoryLink: '/places/raja-dinkar-kelkar-museum',
    actionTextEn: 'Marvel at Kelkar Treasury ➔',
    actionTextMr: 'राजा केळकर दालन पहा ➔',
    badgeImg: '/images/places/raja-dinkar-kelkar-museum.jpg',
  },
  {
    id: 'm8',
    badge: '👑',
    nameEn: 'Supreme Punekar: Living Heritage Legend',
    nameMr: 'मानाचा पहिला पुणेकर: समग्र वारसा सम्राट',
    descEn: 'The ultimate crown of Pune heritage! Complete 10 authenticated expeditions across forts & peths.',
    descMr: 'पुणे वारशाचा सर्वोच्च मुकुट! गड, पेठा, वाडे व देवस्थाने अशा १० ऐतिहासिक स्थळांची यशस्वी सफर पूर्ण करा.',
    criteriaType: 'distinct_places',
    criteriaValue: 10,
    categoryLink: '/places/aga-khan-palace',
    actionTextEn: 'Honor Aga Khan Memorial ➔',
    actionTextMr: 'आगाखान पॅलेस दर्शन ➔',
    badgeImg: '/images/places/aga-khan-palace.jpg',
  },
  {
    id: 'm9',
    badge: '✍️',
    nameEn: 'Pune Katha-Kaar: Voice of the Valley',
    nameMr: 'पुणे कथाकार: अस्सल भटकंती शब्दवीर',
    descEn: 'Pen your own travelogue! Share your first real trek chronicle or hidden culinary secret.',
    descMr: 'तुमचा भटकंतीचा खरा अनुभव! एक्सप्लोर पुणेवर तुमची पहिली पर्यटन कथा प्रसिद्ध करून शब्दवीर बना.',
    criteriaType: 'approved_blogs',
    criteriaValue: 1,
    categoryLink: '/places/pataleshwar-cave-temple',
    actionTextEn: 'Unearth Pataleshwar Caves ➔',
    actionTextMr: 'पाताळेश्वर लेणी शोधा ➔',
    badgeImg: '/images/places/pataleshwar-cave-temple.jpg',
  },
  {
    id: 'm10',
    badge: '🌟',
    nameEn: 'Heritage Laureate: Master Chronicler',
    nameMr: 'वारसा दीपस्तंभ: ज्येष्ठ प्रवास वार्ताहर',
    descEn: 'Inspire thousands of travelers! Publish 3 verified expeditions and comprehensive guides.',
    descMr: 'भावी पर्यटकांचे मार्गदर्शक व्हा! ३ सविस्तर व दर्जेदार प्रवास वर्णने प्रसिद्ध करून दीपस्तंभ ठरा.',
    criteriaType: 'approved_blogs',
    criteriaValue: 3,
    categoryLink: '/places/lal-mahal',
    actionTextEn: 'Relive Lal Mahal Saga ➔',
    actionTextMr: 'लाल महाल गाथा अनुभवा ➔',
    badgeImg: '/images/places/lal-mahal.jpg',
  },
];

export default function MilestonesPage() {
  const { user, ready } = useAuth();
  const { isMr, t } = useLanguage();
  const [visitsCount, setVisitsCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [placesList, setPlacesList] = useState<PlaceOption[]>([]);
  const [communityCheckins, setCommunityCheckins] = useState<PublicCommunityCheckin[]>([]);

  // Check-in Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [visitNote, setVisitNote] = useState('');
  const [isPublic, setIsPublic] = useState(false); // DEFAULT TO PRIVATE AS REQUESTED
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [congratsModal, setCongratsModal] = useState<MilestoneItem | null>(null);
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStats = async () => {
    if (!user) return;
    try {
      const [visitsSnap, blogsSnap] = await Promise.all([
        getDocs(query(collection(db, 'visits'), where('user_id', '==', user.uid))),
        getDocs(query(collection(db, 'blogs'), where('author_id', '==', user.uid), where('status', '==', 'published'))),
      ]);
      setVisitsCount(visitsSnap.size);
      setBlogsCount(blogsSnap.size);
    } catch (err) {
      console.error('Failed to load user milestone stats:', err);
    }
  };

  useEffect(() => {
    loadStats();
    setActiveTrip(getActiveTrip());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load places for dropdown & community public check-ins
  useEffect(() => {
    (async () => {
      try {
        const placesSnap = await getDocs(query(collection(db, 'places'), where('status', '==', 'published')));
        const pl: PlaceOption[] = placesSnap.docs.map((d) => ({
          id: d.id,
          slug: d.data().slug || d.id,
          name: d.data().name,
          name_mr: d.data().name_mr,
        }));
        setPlacesList(pl);
        if (pl.length > 0) setSelectedPlaceId(pl[0].id);

        // Load recent public check-ins
        const publicSnap = await getDocs(query(collection(db, 'visits'), where('is_public', '==', true)));
        const pub: PublicCommunityCheckin[] = publicSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        pub.sort((a, b) => (b.visited_at || '').localeCompare(a.visited_at || ''));
        setCommunityCheckins(pub.slice(0, 8));
      } catch (err) {
        console.error('Failed to load places/community check-ins:', err);
      }
    })();
  }, []);

  // Compute progress for each milestone
  const getMilestoneProgress = (m: MilestoneItem) => {
    if (!user) return { current: 0, target: m.criteriaValue, isUnlocked: false, percent: 0 };

    let current = 0;
    if (m.criteriaType === 'approved_blogs') {
      current = blogsCount;
    } else {
      current = visitsCount;
    }

    const target = m.criteriaValue;
    const isUnlocked = current >= target;
    const percent = Math.min(100, Math.round((current / target) * 100));

    return { current, target, isUnlocked, percent };
  };

  const unlockedCount = MILESTONES_DATA.filter((m) => getMilestoneProgress(m).isUnlocked).length;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormError('');
    try {
      setSubmitting(true);
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
    } catch (err: any) {
      setFormError(err.message || 'Failed to process image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!user) {
      setFormError(isMr ? 'कृपया प्रथम लॉगिन करा.' : 'Please sign in first.');
      return;
    }

    if (!imagePreview) {
      setFormError(
        isMr
          ? '⚠️ यशोगाथा पदक पूर्ण करण्यासाठी कृपया या ठिकाणाचे छायाचित्र (फोटो) जोडा.'
          : '⚠️ To complete the milestone check-in, please add a photo of this place.'
      );
      return;
    }

    const selectedPlace = placesList.find((p) => p.id === selectedPlaceId);
    if (!selectedPlace) {
      setFormError(isMr ? 'कृपया ठिकाण निवडा.' : 'Please select a place.');
      return;
    }

    try {
      setSubmitting(true);
      const visitId = `${user.uid}_${selectedPlace.id}_${Date.now()}`;
      await setDoc(doc(db, 'visits', visitId), {
        place_id: selectedPlace.id,
        place_slug: selectedPlace.slug,
        place_name: selectedPlace.name,
        place_name_mr: selectedPlace.name_mr || selectedPlace.name,
        user_id: user.uid,
        user_name: user.displayName || user.email?.split('@')[0] || 'Pune Explorer',
        user_avatar: user.photoURL || null,
        visited_at: visitDate,
        notes: visitNote || null,
        image_url: imagePreview,
        is_public: isPublic, // STRICT PRIVACY DEFAULT (FALSE / PRIVATE)
        created_at: new Date().toISOString(),
      });

      const newVisits = visitsCount + 1;
      setVisitsCount(newVisits);

      // Check if a new milestone was unlocked with this check-in!
      const justUnlocked = MILESTONES_DATA.find(
        (m) => m.criteriaType === 'distinct_places' && m.criteriaValue === newVisits
      );
      if (justUnlocked) {
        setCongratsModal(justUnlocked);
      }

      setModalOpen(false);
      setImagePreview(null);
      setVisitNote('');
      setIsPublic(false); // Reset to default private

      // Notify window
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('explore-pune-visit-logged', { detail: { placeId: selectedPlace.id, isPublic } }));
      }
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || (isMr ? 'नोंद करता आली नाही.' : 'Failed to record visit.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCertificate = (m: MilestoneItem) => {
    downloadCertificatePdf({
      explorerName: user?.displayName || user?.email?.split('@')[0] || 'Pune Explorer',
      milestoneTitle: isMr ? m.nameMr : m.nameEn,
      milestoneTitleMr: m.nameMr,
      milestoneBadge: m.badge,
      milestoneDesc: isMr ? m.descMr : m.descEn,
      dateUnlocked: new Date().toISOString().slice(0, 10),
      isMr,
    });
  };

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Hero Banner with Check-In Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div style={{ maxWidth: 720 }}>
          <div className="hero-pill">
            <span>🏆</span> {t('milestones.badge')}
          </div>
          <h1 style={{ fontSize: 34, margin: '6px 0 10px', color: 'var(--ink)' }}>
            {t('milestones.title')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            {t('milestones.sub')}
          </p>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => {
              setModalOpen(true);
              setFormError('');
              setImagePreview(null);
              setIsPublic(false);
            }}
            className="btn"
            style={{
              padding: '12px 22px',
              fontSize: 14,
              fontWeight: 800,
              background: '#c2410c',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(194, 65, 12, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span>📸</span>
            <span>{isMr ? 'छायाचित्र जोडून पदक मिळवा' : 'Check-In with Photo Proof'}</span>
          </button>
        )}
      </div>

      {/* Active Trip Linked Visits Banner */}
      {activeTrip && activeTrip.stops.some((s) => s.isVisited) && (
        <div
          style={{
            marginBottom: 24,
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '1.5px solid #86efac',
            borderRadius: 'var(--radius)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 26 }}>📍</span>
            <div>
              <strong style={{ fontSize: 14, color: '#166534', display: 'block' }}>
                {isMr ? 'सहल नियोजकामधील पूर्ण झालेली ठिकाणे' : 'Visits Synced From Your Guided Trip'}
              </strong>
              <span style={{ fontSize: 12.5, color: '#15803d' }}>
                {activeTrip.stops.filter((s) => s.isVisited).map((s) => (isMr && s.placeNameMr ? s.placeNameMr : s.placeName)).join(', ')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const firstVisited = activeTrip.stops.find((s) => s.isVisited);
              if (firstVisited) {
                setSelectedPlaceId(firstVisited.placeId);
              }
              setModalOpen(true);
              setFormError('');
              setImagePreview(null);
              setIsPublic(false);
            }}
            className="btn"
            style={{ fontSize: 12.5, padding: '7px 16px', background: '#16a34a' }}
          >
            📸 {isMr ? 'या ठिकाणांचा फोटो जोडा' : 'Add Photo Proof For These'}
          </button>
        </div>
      )}

      {/* User Status Card */}
      {ready && user ? (
        <div
          className="panel"
          style={{
            marginBottom: 32,
            background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-light) 100%)',
            border: '1.5px solid var(--primary-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                🏅
              </div>
              <div>
                <h2 style={{ fontSize: 20, margin: 0, color: 'var(--ink)' }}>
                  {user.displayName || user.email?.split('@')[0]}
                  {isMr ? ' यांची भ्रमंती प्रगती' : "'s Explorer Progress"}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                  {isMr
                    ? `${visitsCount} ठिकाणांना फोटोसह भेट दिली • ${blogsCount} कथा प्रकाशित • ${unlockedCount} / ${MILESTONES_DATA.length} पदके संपादन`
                    : `${visitsCount} visits with verified photos • ${blogsCount} travelogues published • ${unlockedCount} of ${MILESTONES_DATA.length} badges unlocked`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(true);
                  setFormError('');
                  setImagePreview(null);
                  setIsPublic(false);
                }}
                className="btn"
                style={{ fontSize: 13, padding: '8px 16px', background: '#c2410c' }}
              >
                📸 {isMr ? 'नवीन भेट नोंदवा' : 'Log New Place Visit'}
              </button>
              <Link href="/account" className="btn outline" style={{ fontSize: 13, padding: '8px 16px' }}>
                👤 {isMr ? 'माझे खाते' : 'My Account'}
              </Link>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
              <span>{isMr ? 'एकूण यशोगाथा प्रगती' : 'Total Explorer Mastery'}</span>
              <span>{Math.round((unlockedCount / MILESTONES_DATA.length) * 100)}%</span>
            </div>
            <div style={{ height: 10, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(unlockedCount / MILESTONES_DATA.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary) 0%, #10b981 100%)',
                  borderRadius: 999,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="panel"
          style={{
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            background: 'var(--amber-light)',
            borderColor: 'var(--amber-border)',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, color: 'var(--amber-ink)' }}>
              👋 {isMr ? 'तुमची स्वतःची पदके मिळवण्यासाठी तयार आहात?' : 'Ready to earn your badges?'}
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
              {isMr
                ? 'लॉगिन करा, ठिकाणांचे फोटो जोडून भेट नोंदवा आणि अधिकृत यशोगाथा पदके अनलॉक करा.'
                : 'Sign in to log visits with photo proofs, unlock explorer badges, and download official certificates.'}
            </p>
          </div>
          <Link href="/login" className="btn" style={{ padding: '8px 18px' }}>
            {isMr ? 'लॉगिन करा' : 'Sign In Now'}
          </Link>
        </div>
      )}

      {/* Milestones Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          marginBottom: 44,
        }}
      >
        {MILESTONES_DATA.map((m) => {
          const { current, target, isUnlocked, percent } = getMilestoneProgress(m);

          return (
            <div
              key={m.id}
              className="panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isUnlocked ? '2px solid #10b981' : '1px solid var(--line)',
                boxShadow: isUnlocked ? '0 10px 25px -5px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isUnlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'var(--sage-bg)',
                    color: 'var(--sage-ink)',
                    border: '1px solid var(--sage-border)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  🎉 {isMr ? 'संपादन केले' : 'Unlocked'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <Image
                    src={m.badgeImg}
                    alt={m.nameEn}
                    width={48}
                    height={48}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isUnlocked ? '2px solid #10b981' : '1px solid var(--line)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, color: 'var(--ink)' }}>
                      {isMr ? m.nameMr : m.nameEn}
                    </h3>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      {isMr ? m.nameEn : m.nameMr}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: 'var(--ink-secondary)', lineHeight: 1.5, margin: '0 0 16px', minHeight: 44 }}>
                  {isMr ? m.descMr : m.descEn}
                </p>
              </div>

              {/* Progress Bar & Actions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                  <span>{isMr ? 'प्रगती (फोटो पुरावा)' : 'Progress (Photo Proof)'}</span>
                  <span>
                    {user
                      ? `${Math.min(current, target)} / ${target}`
                      : `0 / ${target}`}
                  </span>
                </div>

                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: isUnlocked
                        ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(90deg, var(--primary) 0%, #d97706 100%)',
                      borderRadius: 999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--line)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isUnlocked ? '#059669' : 'var(--clay)' }}>
                    {isUnlocked
                      ? (isMr ? '✅ पदक प्राप्त झाले' : '✅ Milestone Unlocked!')
                      : (isMr ? `अजून ${Math.max(0, target - current)} भेटी बाकी` : `${Math.max(0, target - current)} more to unlock`)}
                  </span>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadCertificate(m)}
                        className="btn"
                        style={{ padding: '6px 12px', fontSize: 11.5, background: '#047857' }}
                        title={isMr ? 'प्रमाणपत्र डाऊनलोड करा (PDF)' : 'Download Milestone Certificate (PDF)'}
                      >
                        🎓 {isMr ? 'प्रमाणपत्र (PDF)' : 'Certificate (PDF)'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setModalOpen(true);
                          setFormError('');
                          setImagePreview(null);
                          setIsPublic(false);
                        }}
                        className="btn clay"
                        style={{ padding: '6px 12px', fontSize: 11.5 }}
                      >
                        📸 {isMr ? 'फोटो जोडा' : 'Add Photo'}
                      </button>
                    )}

                    <Link
                      href={m.categoryLink}
                      className="btn outline"
                      style={{ padding: '6px 12px', fontSize: 11.5 }}
                    >
                      {isMr ? m.actionTextMr : m.actionTextEn}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Community Explorer Feed */}
      {communityCheckins.length > 0 && (
        <section
          className="panel"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
            border: '1.5px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 20, margin: 0, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🌐</span>
                <span>{isMr ? 'सहप्रवाशांचे सार्वजनिक चेक-इन्स (Community Feed)' : 'Recent Community Explorer Check-Ins'}</span>
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
                {isMr
                  ? 'पुण्यातील सहप्रवाशांनी शेअर केलेले अस्सल सार्वजनिक फोटो'
                  : 'Live verified visits and public photos shared by Pune explorers'}
              </p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '4px 10px', borderRadius: 999 }}>
              {communityCheckins.length} {isMr ? 'नवीन फोटो' : 'Recent Photos'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 14,
            }}
          >
            {communityCheckins.map((item) => (
              <div
                key={item.id}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  background: '#ffffff',
                }}
              >
                <div style={{ height: 130, width: '100%', background: '#000' }}>
                  <img
                    src={item.image_url}
                    alt={item.place_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <strong style={{ fontSize: 12, color: 'var(--ink)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {item.place_name}
                  </strong>
                  <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                    <span>👤 {item.user_name}</span>
                    <span>{item.visited_at}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHECK-IN PHOTO PROOF MODAL */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius)',
              maxWidth: 520,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📸</span>
                <span>{isMr ? 'यशोगाथा पूर्तता व छायाचित्र चेक-इन' : 'Milestone Photo Check-In'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteMilestoneSubmit} style={{ display: 'grid', gap: 14 }}>
              {/* Place Selection */}
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="modal-place-select">
                  {isMr ? 'तुम्ही भेट दिलेले ठिकाण निवडा:' : 'Select Visited Landmark:'}
                </label>
                <select
                  id="modal-place-select"
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                  required
                >
                  {placesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isMr ? p.name_mr || p.name : p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Date */}
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="modal-date">
                  {isMr ? 'भेटीची तारीख:' : 'Date of Visit:'}
                </label>
                <input
                  id="modal-date"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>

              {/* Photo Proof (REQUIRED) */}
              <div className="field" style={{ margin: 0 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{isMr ? 'ठिकाणाचे छायाचित्र (आवश्यक पुरावा):' : 'Place Photo Proof (Required):'}</span>
                  <span style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700 }}>
                    {imagePreview ? (isMr ? '✓ फोटो निवडला' : '✓ Photo Ready') : (isMr ? '* आवश्यक' : '* Required')}
                  </span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '24px',
                      border: '2px dashed var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 32 }}>📷</span>
                    <strong style={{ fontSize: 13, color: 'var(--ink)' }}>
                      {submitting
                        ? (isMr ? 'फोटो प्रोसेस होत आहे…' : 'Processing image…')
                        : (isMr ? 'कॅमेऱ्याने फोटो काढा किंवा फाईल निवडा' : 'Take a photo or choose from device')}
                    </strong>
                    <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                      {isMr ? 'पीएनजी, जेपीईजी (आपोआप कॉम्प्रेस केले जाईल)' : 'PNG, JPEG up to 10MB (auto-compressed)'}
                    </span>
                  </button>
                ) : (
                  <div
                    style={{
                      position: 'relative',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      background: '#000',
                      maxHeight: 200,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Proof"
                      style={{ maxHeight: 200, width: 'auto', objectFit: 'contain' }}
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontSize: 14,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy Setting (DEFAULT TO PRIVATE) */}
              <div
                style={{
                  padding: '12px 14px',
                  background: isPublic ? '#f0fdf4' : '#f8fafc',
                  border: `1.5px solid ${isPublic ? '#86efac' : '#cbd5e1'}`,
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
                  {isMr ? 'गोपनीयता सेटिंग (Privacy Setting):' : 'Photo Visibility & Privacy:'}
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  {/* Private Option (Default) */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      cursor: 'pointer',
                      fontSize: 12.5,
                      color: !isPublic ? 'var(--ink)' : 'var(--muted)',
                      fontWeight: !isPublic ? 700 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="modal-privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      style={{ width: 'auto', marginTop: 2 }}
                    />
                    <div>
                      <strong>🔒 {isMr ? 'खाजगी (Private - डीफॉल्ट)' : 'Private (Only Me - Default)'}</strong>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                        {isMr
                          ? 'केवळ तुमच्या वैयक्तिक खात्यात व यशोगाथा प्रगतीमध्ये दिसेल.'
                          : 'Only visible to you in your personal milestone log.'}
                      </div>
                    </div>
                  </label>

                  {/* Public Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      cursor: 'pointer',
                      fontSize: 12.5,
                      color: isPublic ? '#047857' : 'var(--muted)',
                      fontWeight: isPublic ? 700 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="modal-privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      style={{ width: 'auto', marginTop: 2 }}
                    />
                    <div>
                      <strong>🌐 {isMr ? 'सार्वजनिक (Community Gallery)' : 'Public (Community Gallery)'}</strong>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                        {isMr
                          ? 'इतर सर्व प्रवाशांना या ठिकाणाच्या सार्वजनिक गॅलरीमध्ये तुमचे फोटो दिसेल.'
                          : 'Show on this place page in the Community Gallery for fellow travelers to see.'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="modal-note">
                  {isMr ? 'अनुभव किंवा टीप (ऐच्छिक):' : 'Travel Note or Caption (optional):'}
                </label>
                <input
                  id="modal-note"
                  value={visitNote}
                  onChange={(e) => setVisitNote(e.target.value)}
                  maxLength={300}
                  placeholder={isMr ? 'उदा. शनिवार वाड्याची संध्याकाळ अप्रतिम होती!' : 'e.g. Stunning architectural experience!'}
                />
              </div>

              {formError && (
                <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 700 }}>
                  {formError}
                </div>
              )}

              <button
                className="btn"
                disabled={submitting}
                style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 700, background: '#c2410c' }}
              >
                {submitting
                  ? (isMr ? 'अपलोड होत आहे…' : 'Uploading visit…')
                  : (isMr ? '✓ भेट निश्चित करा व यशोगाथा मिळवा' : '✓ Confirm Check-In & Complete Milestone')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION UNLOCK MODAL */}
      {congratsModal && (
        <div
          onClick={() => setCongratsModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius)',
              maxWidth: 460,
              width: '100%',
              padding: 28,
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              border: '2px solid #10b981',
            }}
          >
            <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🎉</span>
            <div
              style={{
                display: 'inline-block',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                borderRadius: 999,
                padding: '3px 12px',
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
              }}
            >
              {isMr ? 'नवीन यशोगाथा अनलॉक झाली!' : 'NEW MILESTONE UNLOCKED!'}
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: 22, color: 'var(--ink)' }}>
              {congratsModal.badge} {isMr ? congratsModal.nameMr : congratsModal.nameEn}
            </h3>

            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
              {isMr ? congratsModal.descMr : congratsModal.descEn}
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  handleDownloadCertificate(congratsModal);
                }}
                className="btn"
                style={{ padding: '8px 18px', fontSize: 13, background: '#047857' }}
              >
                🎓 {isMr ? 'प्रमाणपत्र (PDF) डाऊनलोड करा' : 'Download Certificate (PDF)'}
              </button>
              <button
                type="button"
                onClick={() => setCongratsModal(null)}
                className="btn outline"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                {isMr ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
