'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Eye,
  CheckCircle2,
  X,
  RotateCw,
  Compass,
  MapPin,
  ExternalLink,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface ExperienceCuriosityCabinetProps {
  isMr: boolean;
}

interface HeritageRelic {
  id: string;
  name: string;
  nameMr: string;
  category: string;
  craftOrEra: string;
  provenance: string;
  significance: string;
  wherePreserved: string;
  placeSlug: string;
  imageUrl: string;
  funFact: string;
}

const HERITAGE_RELICS: HeritageRelic[] = [
  {
    id: 'tambat-copper-bamb',
    name: 'Kasba Tambat Copper Bamb',
    nameMr: 'कसबा तांबट तांब्याचा बंब',
    category: 'Living Metalcraft (400 Years)',
    craftOrEra: 'Hand-beaten "Matharkaam" Copper Craft',
    provenance: 'Kasba Peth, Pune (Continuous since 1600s)',
    significance: 'Traditional cylindrical wood-fired water heating vessel hand-hammered from pure red copper, featuring thousands of distinct indentation hammer facets that expand heat absorption.',
    wherePreserved: 'Tambat Ali Artisans, Kasba Peth',
    placeSlug: 'tambat-ali-craft-quarter',
    imageUrl: '/images/places/tambat-ali-craft-quarter.jpg',
    funFact: 'Peshwa cannon founders originally settled the Tambat coppersmiths in Pune to manufacture artillery and coins before they pivoted into domestic heirloom vessels.',
  },
  {
    id: 'peshwa-rajmudra',
    name: 'Peshwa Imperial Rajmudra',
    nameMr: 'पेशवे कालीन राजमुद्रा',
    category: 'Maratha Royal Heraldry (18th Century)',
    craftOrEra: 'Bronze & Brass Royal Seal',
    provenance: 'Shaniwar Wada Administrative Archive',
    significance: 'The official imperial seal stamped on sanads (royal decrees) granting rights across the Maratha Empire from the Deccan to Delhi.',
    wherePreserved: 'BISM Archive & Kelkar Museum',
    placeSlug: 'shaniwar-wada',
    imageUrl: '/images/places/shaniwar-wada.jpg',
    funFact: 'Decrees stamped with this seal governed trade routes stretching over 2,000 kilometres across the Indian subcontinent.',
  },
  {
    id: 'tanaji-maratha-dhal',
    name: 'Tanaji’s Maratha Warrior Dhal',
    nameMr: 'नरवीर तानाजींची ढाल',
    category: 'Maratha Military Armor (1670 CE)',
    craftOrEra: 'Layered Rhinoceros Hide & Steel Studs',
    provenance: 'Sinhagad Battle of 1670',
    significance: 'Hardened leather combat shield capable of deflecting curved Mughal talwars during night escalations of vertical cliffs.',
    wherePreserved: 'Tanaji Memorial, Sinhagad Fort',
    placeSlug: 'sinhagad-fort',
    imageUrl: '/images/places/sinhagad-fort.jpg',
    funFact: 'When his shield broke during the duel with Udaybhan Rathod at Sinhagad, Tanaji tied his turban cloth around his left forearm to parry blows.',
  },
  {
    id: 'gandhi-charkha',
    name: 'Aga Khan Palace Heritage Charkha',
    nameMr: 'आगाखान पॅलेस ऐतिहासिक चरखा',
    category: 'Freedom Movement Relic (1942)',
    craftOrEra: 'Teakwood Box Spinning Wheel (Yerwada Pattern)',
    provenance: 'Quit India Internment (1942-1944)',
    significance: 'The hand-operated spinning wheel used daily by Mahatma Gandhi and Kasturba Gandhi during their imprisonment at Aga Khan Palace.',
    wherePreserved: 'Aga Khan Palace Memorial Hall',
    placeSlug: 'aga-khan-palace',
    imageUrl: '/images/places/aga-khan-palace.jpg',
    funFact: 'The compact folding box charkha was invented right here in Pune at the Yerwada Central Jail in the 1930s.',
  },
  {
    id: 'vintage-paratrooper-bicycle',
    name: '1914 BSA Paratrooper Folding Bicycle',
    nameMr: '१९१४ बी.एस.ए. फोल्डिंग सायकल',
    category: 'Mechanical Heritage & Pune Bicycle Lore',
    craftOrEra: 'British Airborne Steel Folding Frame',
    provenance: 'Vikram Pendse Cycles Collection, Karve Nagar',
    significance: 'Rare WWII airborne bicycle designed to be dropped by parachute with paratroopers, celebrating Pune’s status as the historic "Bicycle City of India".',
    wherePreserved: 'Vikram Pendse Cycles Museum',
    placeSlug: 'vikram-pendse-cycles-museum',
    imageUrl: '/images/places/vikram-pendse-cycles-museum.jpg',
    funFact: 'In the 1960s, Pune had more registered bicycles per capita than any other city in Asia.',
  },
];

const CURIOSITY_TRIVIA = [
  {
    question: 'Why does Trishund Ganpati in Somwar Peth have three trunks and ride a peacock?',
    questionMr: 'सोमवार पेठेतील त्रिशुंड गणपतीला तीन सोंडा का आहेत आणि ते मोरावर का बसले आहेत?',
    answer: 'Built in 1770 by the ascetic Bhimjigiri Gosavi, this temple merges Shaivite, Vaishnavite, and Tantric iconography. The peacock mount is associated with Lord Kartikeya (Murugan), symbolizing the unity of brothers Ganesha and Kartikeya.',
    answerMr: '१७७० मध्ये गोसावी संप्रदायाच्या संतांनी बांधलेले हे मंदिर शैव, वैष्णव आणि तांत्रिक शिल्पकलेचा अनोखा मिलाफ आहे. मोर हे कार्तिकेयाचे वाहन असल्याने येथे गणेश आणि कार्तिकेयाचे ऐक्य दर्शवले आहे.',
  },
  {
    question: 'How did Pune become the only Indian city with a dedicated Mini-Train city?',
    questionMr: 'पुण्यात भारतातले एकमेव कार्यरत मिनिएचर रेल्वे शहर कसे तयार झाले?',
    answer: 'B.S. Joshi spent over 40 years handcrafting 1:87 scale working trains, signals, level crossings, and stations in Kothrud, creating an internationally celebrated animated mechanical marvel.',
    answerMr: 'बी.एस. जोशी यांनी ४० हून अधिक वर्षे मेहनत घेऊन कोथरूडमध्ये १:८७ प्रमाणात धावणाऱ्या खऱ्याखुऱ्या मॉडेल ट्रेन्स, सिग्नल्स आणि स्थानकांचे स्वयंचलित जग उभे केले.',
  },
  {
    question: 'What is the secret behind the "Tarri" of authentic Puneri Misal?',
    questionMr: 'अस्सल पुणेरी मिसळीच्या लाल तर्रीचे रहस्य काय आहे?',
    answer: 'Authentic Puneri misal balances home-roasted "goda masala" with jaggery and coconut, slow-cooked in copper vessels so the aromatic spiced oil floats cleanly to the top without artificial coloring.',
    answerMr: 'पुणेरी मिसळीत कांदा-लसूण आणि खास भाजलेला गोडा मसाला, गूळ आणि खोबऱ्याचा संतुलित वापर केला जातो. मंद आचेवर शिजवल्याने लाल तेलाचा तवंग (कट) वर तरंगतो.',
  },
];

export default function ExperienceCuriosityCabinet({ isMr }: ExperienceCuriosityCabinetProps) {
  const [selectedRelic, setSelectedRelic] = useState<HeritageRelic | null>(null);
  const [openTriviaIdx, setOpenTriviaIdx] = useState<number | null>(null);

  return (
    <section id="curiosities" className="exp-section exp-curiosities-section" aria-label="Interactive Heritage Relics">
      <div className="exp-container">
        {/* Section Header */}
        <div className="exp-section-header">
          <div className="exp-section-badge">
            <Sparkles size={14} />
            <span>{isMr ? 'खेळकर शोध • कौतुक संग्रहालय' : 'PLAYFUL DISCOVERY • CABINET OF CURIOSITIES'}</span>
          </div>
          <h2 className="exp-section-title">
            {isMr ? 'पुण्याचा स्पर्श करता येणारा वारसा' : 'Tactile Heritage & Living Relics'}
          </h2>
          <p className="exp-section-subtitle">
            {isMr
              ? 'तांबट आळीचा तांब्याचा बंब, तानाजींची ढाल आणि गांधीजींचा चरखा — पुण्याच्या इतिहासातील ५ मौल्यवान वस्तूंचा परस्परसंवादी शोध घ्या.'
              : 'Interact with 5 authentic heritage objects that shaped Pune’s culture. Tap to inspect historical relics, examine craftsmanship, and reveal fascinating local secrets.'}
          </p>
        </div>

        {/* 5 Relics Tactile Carousel Grid */}
        <div className="exp-relics-grid">
          {HERITAGE_RELICS.map((relic) => (
            <div
              key={relic.id}
              className="exp-relic-card"
              onClick={() => setSelectedRelic(relic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedRelic(relic);
                }
              }}
              aria-label={`Inspect ${relic.name}`}
            >
              <div className="exp-relic-media">
                <Image
                  src={relic.imageUrl}
                  alt={relic.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="exp-relic-img"
                />
                <div className="exp-relic-overlay" />
                <div className="exp-relic-badge">
                  <Sparkles size={11} />
                  <span>{relic.craftOrEra.split('(')[0]}</span>
                </div>
              </div>

              <div className="exp-relic-body">
                <span className="exp-relic-cat">{relic.category}</span>
                <h3 className="exp-relic-name">
                  {isMr ? relic.nameMr : relic.name}
                </h3>
                <p className="exp-relic-desc">{relic.significance.slice(0, 95)}…</p>

                <div className="exp-relic-action">
                  <span>{isMr ? 'वस्तू तपासा' : 'Inspect Relic'}</span>
                  <Eye size={14} className="icon" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Curiosity Radar / Trivia Accordion */}
        <div className="exp-trivia-card">
          <div className="exp-trivia-header">
            <div className="exp-trivia-kicker">
              <HelpCircle size={15} style={{ color: 'var(--exp-gold)' }} />
              <span>{isMr ? 'पुणे कुतूहल रडार • तुम्हाला माहीत आहे का?' : 'PUNE CURIOSITY RADAR • DID YOU KNOW?'}</span>
            </div>
            <h3 className="exp-trivia-title">
              {isMr ? 'पुण्याच्या गुप्त गोष्टी आणि स्थानिक रहस्ये' : 'Hidden Trivia of the Historic City'}
            </h3>
          </div>

          <div className="exp-trivia-list">
            {CURIOSITY_TRIVIA.map((t, idx) => {
              const isOpen = openTriviaIdx === idx;
              return (
                <div key={idx} className={`exp-trivia-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setOpenTriviaIdx(isOpen ? null : idx)}
                    className="exp-trivia-question-btn"
                  >
                    <span>{isMr ? t.questionMr : t.question}</span>
                    <span className="arrow">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="exp-trivia-answer-box">
                      <p>{isMr ? t.answerMr : t.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Relic Inspection Modal Drawer */}
      {selectedRelic && (
        <div
          className="exp-modal-backdrop"
          onClick={() => setSelectedRelic(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="exp-modal-card relic-inspector"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="exp-relic-modal-hero">
              <Image
                src={selectedRelic.imageUrl}
                alt={selectedRelic.name}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="img"
              />
              <div className="overlay" />
              <button
                type="button"
                onClick={() => setSelectedRelic(null)}
                className="exp-modal-close inside"
                aria-label="Close relic inspector"
              >
                <X size={20} />
              </button>

              <div className="hero-text">
                <span className="category">{selectedRelic.category}</span>
                <h3 className="title">{isMr ? selectedRelic.nameMr : selectedRelic.name}</h3>
              </div>
            </div>

            <div className="exp-modal-scroll">
              <div className="exp-relic-details-grid">
                <div className="detail-item">
                  <span className="lbl">{isMr ? 'शिल्पकला / युग:' : 'Craft / Era:'}</span>
                  <span className="val">{selectedRelic.craftOrEra}</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">{isMr ? 'उगमस्थान:' : 'Historical Provenance:'}</span>
                  <span className="val">{selectedRelic.provenance}</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">{isMr ? 'सध्या कुठे जतन आहे:' : 'Preserved At:'}</span>
                  <span className="val">{selectedRelic.wherePreserved}</span>
                </div>
              </div>

              <h4 className="section-sub">{isMr ? 'ऐतिहासिक महत्त्व:' : 'Historical Significance:'}</h4>
              <p className="exp-relic-full-desc">{selectedRelic.significance}</p>

              {/* Curiosity Fact Box */}
              <div className="exp-relic-funfact">
                <Sparkles size={16} style={{ color: 'var(--exp-gold)', flexShrink: 0 }} />
                <div>
                  <span className="title">{isMr ? 'रोचक सत्य:' : 'Curiosity Fact:'}</span>
                  <p className="text">{selectedRelic.funFact}</p>
                </div>
              </div>

              <div className="exp-relic-actions">
                <Link
                  href={`/places/${selectedRelic.placeSlug}`}
                  className="exp-btn-primary"
                >
                  <MapPin size={15} />
                  <span>{isMr ? 'संबंधित वारसा ठिकाण पाहा' : 'Visit Monument Destination'}</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
