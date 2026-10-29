import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDirEn = path.join(__dirname, '../website-marketing-kit/public/audio/en');
const audioDirMr = path.join(__dirname, '../website-marketing-kit/public/audio/mr');

fs.mkdirSync(audioDirEn, { recursive: true });
fs.mkdirSync(audioDirMr, { recursive: true });

const scriptData = [
  {
    scene: 'scene1_intro',
    startSec: 0,
    endSec: 10,
    en: "Welcome to Pune, Maharashtra's historic cultural capital and a vibrant modern metropolis. Navigating this dynamic city just got smarter, faster, and completely effortless.",
    mr: "महाराष्ट्राची ऐतिहासिक सांस्कृतिक राजधानी आणि आधुनिक शहर, आपले पुणे. या शहरात प्रवास करणे आता झाले आहे अधिक सोपे, वेगवान आणि स्मार्ट."
  },
  {
    scene: 'scene2_website',
    startSec: 10,
    endSec: 22,
    en: "Introducing Explore Pune, your all-in-one public transit and city discovery platform. Built with a clean, responsive interface, it puts the entire city at your fingertips—with instant search across one hundred and six verified locations.",
    mr: "सादर करत आहोत एक्सप्लोर पुणे, सार्वजनिक वाहतूक आणि शहर दर्शनाचे अधिकृत डिजिटल व्यासपीठ. स्वच्छ आणि जलद इंटरफेसद्वारे १०६ हून अधिक ऐतिहासिक व पर्यटन स्थळे आता आपल्या बोटांवर."
  },
  {
    scene: 'scene3_map',
    startSec: 22,
    endSec: 38,
    en: "Explore Pune with high-precision interactive geographic maps. Locate every heritage fort, serene lake, and cultural hub with verified coordinates, elevation contours, and neighborhood clusters—from Shivajinagar to the Sahyadri trails.",
    mr: "अचूक परस्परसंवादी नकाशांद्वारे पुणे एक्सप्लोर करा. शिवाजीनगरपासून सिंहगडाच्या पायथ्यापर्यंत प्रत्येक किल्ला, तलाव आणि सांस्कृतिक स्थळाचे अचूक स्थान व माहिती एका क्लिकवर मिळवा."
  },
  {
    scene: 'scene4_pmpml',
    startSec: 38,
    endSec: 55,
    en: "Mastering Pune's bus network is now simple. With verified PMPML bus schedules and route timetables, plan journeys effortlessly—like Bus Route 51 connecting Shanipar directly to Sinhagad Fort, with buses running every twenty minutes.",
    mr: "पीएमपीएमएल बस प्रवास आता अत्यंत सुलभ. अधिकृत बस वेळापत्रक आणि मार्गांची खात्रीशीर माहिती, जसे की शनिवार पेठ ते सिंहगड पायथा जोडणारी बस क्रमांक ५१, जी दर वीस मिनिटांनी धावते."
  },
  {
    scene: 'scene5_metro',
    startSec: 55,
    endSec: 72,
    en: "Experience the speed of Pune Metro. Seamlessly navigate the Purple Line from PCMC to Swargate, and the Aqua Line from Vanaz to Ramwadi. Check interchange connections at Civil Court, live station nodes, and exact fares.",
    mr: "पुणे मेट्रोच्या गतीचा अनुभव घ्या. पिंपरी चिंचवड ते स्वारगेट पर्पल लाईन आणि वनाझ ते रामवाडी अक्वा लाईन. सिव्हिल कोर्ट इंटरचेंज, प्रत्येक मेट्रो स्टेशन आणि अधिकृत तिकीट दरांची सविस्तर माहिती."
  },
  {
    scene: 'scene6_journey',
    startSec: 72,
    endSec: 90,
    en: "Plan complete multi-stop journeys across the city. Select your origin, pick your destination, and let the smart directions engine curate a step-by-step route combining metro, feeder buses, and walking trails with exportable itineraries.",
    mr: "संपूर्ण शहर प्रवासाचे परिपूर्ण नियोजन करा. तुमचे ठिकाण निवडा आणि स्मार्ट मार्गदर्शकाद्वारे मेट्रो, पीएमपीएमएल बस आणि चालण्याचे मार्ग यांचा सुरेख समन्वय साधा. एका क्लिकवर सहल आयोजक वापरा."
  },
  {
    scene: 'scene7_brand',
    startSec: 90,
    endSec: 102,
    en: "Explore Pune. Find your route. Discover public transport. Built with zero ads, lightning-fast client performance, and complete respect for Pune's cultural soul.",
    mr: "पुणे जाणून घ्या. तुमचा मार्ग शोधा. सार्वजनिक वाहतुकीचा लाभ घ्या. विना जाहिरात, अतिशय जलद आणि अस्सल पुणेरी संस्कृतीचा आदर करणारे डिजिटल मार्गदर्शक."
  },
  {
    scene: 'scene8_closing',
    startSec: 102,
    endSec: 112,
    en: "Your City. Your Journey. Your Pune. Start exploring today at explore-pune-eosin.vercel.app.",
    mr: "तुमचे शहर. तुमचा प्रवास. आपले पुणे. आजच भेट द्या: एक्सप्लोर पुणे डॉट व्हर्सल डॉट ॲप."
  }
];

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.arrayBuffer();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function downloadTTS(text, lang, outPath) {
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 2000) {
    console.log(`  Already exists: ${path.basename(outPath)}`);
    return;
  }
  const sentences = text.match(/[^.!?।:]+[.!?।:]+/g) || [text];
  const buffers = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${lang}&client=tw-ob`;
    const buffer = await fetchWithRetry(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    buffers.push(Buffer.from(buffer));
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(outPath, Buffer.concat(buffers));
  console.log(`  Saved: ${path.basename(outPath)} (${fs.statSync(outPath).size} bytes)`);
}

function formatSrtTime(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, '0');
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}

async function run() {
  console.log('Generating remaining English & Marathi narration audio...');
  let srtEn = '';
  let srtMr = '';

  for (let i = 0; i < scriptData.length; i++) {
    const item = scriptData[i];
    console.log(`[${i + 1}/${scriptData.length}] Checking ${item.scene}...`);

    const enPath = path.join(audioDirEn, `${item.scene}.mp3`);
    const mrPath = path.join(audioDirMr, `${item.scene}.mp3`);

    await downloadTTS(item.en, 'en-IN', enPath);
    await downloadTTS(item.mr, 'mr', mrPath);

    srtEn += `${i + 1}\n${formatSrtTime(item.startSec)} --> ${formatSrtTime(item.endSec)}\n${item.en}\n\n`;
    srtMr += `${i + 1}\n${formatSrtTime(item.startSec)} --> ${formatSrtTime(item.endSec)}\n${item.mr}\n\n`;
  }

  fs.writeFileSync(path.join(__dirname, '../explore-pune-metro-transit-en.srt'), srtEn.trim());
  fs.writeFileSync(path.join(__dirname, '../explore-pune-metro-transit-mr.srt'), srtMr.trim());
  fs.writeFileSync(path.join(__dirname, '../website-marketing-kit/public/subtitles-en.srt'), srtEn.trim());
  fs.writeFileSync(path.join(__dirname, '../website-marketing-kit/public/subtitles-mr.srt'), srtMr.trim());

  console.log('All audio segments and SRT subtitle files generated successfully!');
}

run().catch(console.error);
