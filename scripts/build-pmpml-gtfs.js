const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Landmark coordinates (official coordinates from Explore Pune)
const LANDMARK_COORDS = {
  'shaniwar-wada': { name: 'Shaniwar Wada', nameMr: 'शनिवार वाडा', lat: 18.5196, lng: 73.8553 },
  'lal-mahal': { name: 'Lal Mahal', nameMr: 'लाल महाल', lat: 18.5186, lng: 73.8568 },
  'vishrambaug-wada': { name: 'Vishrambaug Wada', nameMr: 'विश्रामबाग वाडा', lat: 18.5129, lng: 73.8532 },
  'aga-khan-palace': { name: 'Aga Khan Palace', nameMr: 'आगाखान पॅलेस', lat: 18.5524, lng: 73.9015 },
  'shinde-chhatri': { name: 'Shinde Chhatri', nameMr: 'शिंदे छत्री', lat: 18.4975, lng: 73.8967 },
  'fergusson-college-heritage': { name: 'Fergusson College', nameMr: 'फर्ग्युसन कॉलेज', lat: 18.5236, lng: 73.8407 },
  'pune-university-heritage-building': { name: 'SPPU Heritage Main Building', nameMr: 'पुणे विद्यापीठ मुख्य इमारत', lat: 18.5529, lng: 73.8247 },
  'bund-garden': { name: 'Bund Garden (Fitzgerald Bridge)', nameMr: 'बंड गार्डन', lat: 18.5365, lng: 73.8825 },
  'shreemant-dagdusheth-halwai-ganpati': { name: 'Shreemant Dagdusheth Ganpati', nameMr: 'श्रीमंत दगडूशेठ हलवाई गणपती', lat: 18.5164, lng: 73.8560 },
  'kasba-ganpati': { name: 'Kasba Ganpati', nameMr: 'कसबा गणपती', lat: 18.5201, lng: 73.8587 },
  'pataleshwar-cave-temple': { name: 'Pataleshwar Cave Temple', nameMr: 'पाताळेश्वर लेणी', lat: 18.5273, lng: 73.8510 },
  'chaturshringi-temple': { name: 'Chaturshringi Temple', nameMr: 'चतुःशृंगी मंदिर', lat: 18.5386, lng: 73.8292 },
  'baps-swaminarayan-mandir': { name: 'BAPS Swaminarayan Mandir', nameMr: 'स्वामिना नारायण मंदिर', lat: 18.4878, lng: 73.8340 },
  'parvati-hill': { name: 'Parvati Hill & Peshwa Shrines', nameMr: 'पार्वती टेकडी', lat: 18.4965, lng: 73.8488 },
  'alandi-dnyaneshwar-mandir': { name: 'Alandi Sant Dnyaneshwar Samadhi', nameMr: 'आळंदी ज्ञानेश्वर माऊली समाधी', lat: 18.6756, lng: 73.8986 },
  'dehu-tukaram-mandir': { name: 'Dehu Sant Tukaram Maharaj Gatha Mandir', nameMr: 'देहू संत तुकाराम महाराज मंदिर', lat: 18.7188, lng: 73.7712 },
  'tulshibaug-temple': { name: 'Tulshibaug Ram Mandir', nameMr: 'तुळशीबाग राम मंदिर', lat: 18.5144, lng: 73.8558 },
  'iskcon-nvcc-kondhwa': { name: 'ISKCON NVCC Kondhwa', nameMr: 'इस्कॉन मंदिर कोंढवा', lat: 18.4485, lng: 73.8842 },
  'raja-dinkar-kelkar-museum': { name: 'Raja Dinkar Kelkar Museum', nameMr: 'राजा दिनकर केळकर संग्रहालय', lat: 18.5113, lng: 73.8543 },
  'joshi-miniature-railway': { name: 'Joshi\'s Museum of Miniature Railways', nameMr: 'जोशी रेल्वे संग्रहालय', lat: 18.5036, lng: 73.8188 },
  'tribal-museum': { name: 'Tribal Cultural Museum', nameMr: 'आदिवासी संग्रहालय', lat: 18.5348, lng: 73.8797 },
  'okayama-friendship-garden': { name: 'Okayama Friendship Garden (Pu La Deshpande)', nameMr: 'पु. ल. देशपांडे उद्यान', lat: 18.4925, lng: 73.8322 },
  'sarasbaug': { name: 'Sarasbaug & Talyatla Ganpati', nameMr: 'सारसबाग व तळ्यातील गणपती', lat: 18.5028, lng: 73.8538 },
  'sambhaji-park': { name: 'Chhatrapati Sambhaji Garden', nameMr: 'छत्रपती संभाजी उद्यान', lat: 18.5208, lng: 73.8447 },
  'empress-botanical-garden': { name: 'Empress Botanical Garden', nameMr: 'एम्प्रेस गार्डन', lat: 18.5126, lng: 73.8992 },
  'rajiv-gandhi-zoological-park': { name: 'Rajiv Gandhi Zoological Park (Katraj Zoo)', nameMr: 'राजीव गांधी प्राणी संग्रहालय (कात्रज)', lat: 18.4552, lng: 73.8584 },
  'khadakwasla-dam': { name: 'Khadakwasla Dam & Chowpatty', nameMr: 'खडकवासला धरण', lat: 18.4358, lng: 73.7638 },
  'pashan-lake': { name: 'Pashan Bird Sanctuary & Lake', nameMr: 'पाषाण तलाव', lat: 18.5360, lng: 73.7845 },
  'vetal-tekdi': { name: 'Vetal Tekdi (ARAI Viewpoint)', nameMr: 'वेताळ टेकडी', lat: 18.5230, lng: 73.8190 },
  'taljai-hills': { name: 'Taljai Hills Forest Reserve', nameMr: 'तळजाई टेकडी', lat: 18.4835, lng: 73.8475 },
  'sinhagad-fort': { name: 'Sinhagad Fort (Kalyan Darwaza & Tanaji Memorial)', nameMr: 'सिंहगड किल्ला', lat: 18.3663, lng: 73.7558 },
  'rajgad-fort': { name: 'Rajgad Fort (Suvela & Padmavati Machi)', nameMr: 'राजगड किल्ला', lat: 18.2570, lng: 73.6820 },
  'torna-fort': { name: 'Torna Fort (Prachandagad / Menghai)', nameMr: 'तोरणा किल्ला', lat: 18.2770, lng: 73.6230 },
  'lohagad-fort': { name: 'Lohagad Fort (Vinchukata)', nameMr: 'लोहगड किल्ला', lat: 18.7090, lng: 73.4790 },
  'purandar-fort': { name: 'Purandar Fort (Birthplace of Sambhaji Maharaj)', nameMr: 'पुरंदर किल्ला', lat: 18.2810, lng: 73.9780 },
  'karla-caves': { name: 'Karla Buddhist Caves & Ekvira Mandir', nameMr: 'कार्ले लेणी व एकवीरा आई मंदिर', lat: 18.7820, lng: 73.4700 },
};

// 14 Starting Hubs with their coordinates
const HUBS = [
  { id: 'pune-station', name: 'Pune Railway Station', nameMr: 'पुणे रेल्वे स्टेशन', lat: 18.5284, lon: 73.8739 },
  { id: 'swargate', name: 'Swargate Bus Terminal', nameMr: 'स्वारगेट बस टर्मिनल', lat: 18.5018, lon: 73.8586 },
  { id: 'shivajinagar', name: 'Shivajinagar Station', nameMr: 'शिवाजीनगर स्थानक', lat: 18.5314, lon: 73.8446 },
  { id: 'katraj', name: 'Katraj Bus Depot', nameMr: 'कात्रज बस डेपो', lat: 18.4575, lon: 73.8587 },
  { id: 'hadapsar', name: 'Hadapsar Gadital', nameMr: 'हडपसर गाडीतळ', lat: 18.4999, lon: 73.9390 },
  { id: 'nigdi', name: 'Nigdi Bhakti Shakti Stand', nameMr: 'निगडी भक्ती शक्ती स्टँड', lat: 18.6540, lon: 73.7745 },
  { id: 'wakad', name: 'Wakad / Dange Chowk', nameMr: 'वाकड / डांगे चौक', lat: 18.5987, lon: 73.7667 },
  { id: 'hinjawadi', name: 'Hinjawadi Shivaji Chowk', nameMr: 'हिंजवडी शिवाजी चौक', lat: 18.5912, lon: 73.7391 },
  { id: 'kothrud', name: 'Kothrud Bus Depot', nameMr: 'कोथरूड बस डेपो', lat: 18.5020, lon: 73.8050 },
  { id: 'aundh', name: 'Aundh Bremen Chowk', nameMr: 'औंध ब्रेमेन चौक', lat: 18.5580, lon: 73.8075 },
  { id: 'baner', name: 'Baner Phata', nameMr: 'बाणेर फाटा', lat: 18.5590, lon: 73.7868 },
  { id: 'bhosari', name: 'Bhosari Nashik Phata', nameMr: 'भोसरी नाशिक फाटा', lat: 18.6042, lon: 73.8242 },
  { id: 'viman-nagar', name: 'Viman Nagar / Airport Corner', nameMr: 'विमान नगर / विमानतळ कॉर्नर', lat: 18.5679, lon: 73.9143 },
  { id: 'chandani-chowk', name: 'Chandani Chowk / Bavdhan', nameMr: 'चांदणी चौक / बावधन', lat: 18.5080, lon: 73.7850 },
];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function build() {
  console.log('--- 1. PARSING ROUTES ---');
  const routesData = fs.readFileSync('data/pmpml-extracted/routes.txt', 'utf-8').trim().split('\n');
  const routesMap = {}; // route_id -> { id, busNo, name }
  const busNoToRoutes = {}; // busNo -> Array<route>
  for (let i = 1; i < routesData.length; i++) {
    const line = routesData[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    const id = parts[0];
    const busNo = parts[2];
    const name = parts.slice(3, parts.length - 1).join(',').replace(/\uFFFD/g, '↔');
    const rObj = { id, busNo, name };
    routesMap[id] = rObj;
    if (!busNoToRoutes[busNo]) busNoToRoutes[busNo] = [];
    busNoToRoutes[busNo].push(rObj);
  }
  console.log(`Loaded ${Object.keys(routesMap).length} routes.`);

  console.log('--- 2. PARSING STOPS ---');
  const stopsData = fs.readFileSync('data/pmpml-extracted/stops.txt', 'utf-8').trim().split('\n');
  const stopsMap = {};
  const stopsList = [];
  for (let i = 1; i < stopsData.length; i++) {
    const line = stopsData[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    const id = parts[0];
    const name = parts[1];
    const lat = parseFloat(parts[2]);
    const lon = parseFloat(parts[3]);
    if (!isNaN(lat) && !isNaN(lon)) {
      const sObj = { id, name, lat, lon };
      stopsMap[id] = sObj;
      stopsList.push(sObj);
    }
  }
  console.log(`Loaded ${stopsList.length} stops.`);

  console.log('--- 3. MAPPING TRIPS & STOPS ---');
  const tripToRoute = {};
  const tripsData = fs.readFileSync('data/pmpml-extracted/trips.txt', 'utf-8').trim().split('\n');
  for (let i = 1; i < tripsData.length; i++) {
    const parts = tripsData[i].split(',');
    if (parts.length >= 3) {
      tripToRoute[parts[2]] = parts[0];
    }
  }

  const stopToBuses = {}; // stopId -> Set of bus numbers
  const fileStream = fs.createReadStream('data/pmpml-extracted/stop_times.txt');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  for await (const line of rl) {
    count++;
    if (count === 1) continue;
    const parts = line.split(',');
    if (parts.length >= 4) {
      const tripId = parts[0];
      const stopId = parts[3];
      const routeId = tripToRoute[tripId];
      if (routeId && routesMap[routeId]) {
        const busNo = routesMap[routeId].busNo;
        if (!stopToBuses[stopId]) stopToBuses[stopId] = new Set();
        stopToBuses[stopId].add(busNo);
      }
    }
  }
  console.log(`Processed ${count} stop times.`);

  console.log('--- 4. LOCATING NEAREST PMPML STOPS FOR LANDMARKS ---');
  const landmarkStops = {};
  for (const [slug, info] of Object.entries(LANDMARK_COORDS)) {
    // Find stops within 2.5 km, sorted by distance
    const nearby = [];
    for (const s of stopsList) {
      const dist = haversine(info.lat, info.lng, s.lat, s.lon);
      if (dist <= 2.5) {
        const buses = stopToBuses[s.id] ? Array.from(stopToBuses[s.id]).sort() : [];
        if (buses.length > 0) {
          nearby.push({
            stopId: s.id,
            stopName: s.name,
            lat: s.lat,
            lon: s.lon,
            distanceKm: Math.round(dist * 100) / 100,
            distanceMeters: Math.round(dist * 1000),
            walkMinutes: Math.max(1, Math.round(dist * 12)),
            buses: buses.slice(0, 12),
          });
        }
      }
    }
    nearby.sort((a, b) => a.distanceMeters - b.distanceMeters);
    landmarkStops[slug] = {
      placeName: info.name,
      placeNameMr: info.nameMr,
      lat: info.lat,
      lng: info.lng,
      nearestStops: nearby.slice(0, 3), // top 3 closest real PMPML stops
    };
  }

  console.log('--- 5. COMPUTING HUB-TO-LANDMARK DIRECT BUS CORRIDORS ---');
  // For each hub, find its nearest stops, and see which bus numbers connect to landmark stops!
  const hubCorridors = {};
  for (const hub of HUBS) {
    hubCorridors[hub.id] = {
      hubName: hub.name,
      hubNameMr: hub.nameMr,
      destinations: {},
    };

    // Find hub stops (within 800m)
    const hubStops = [];
    for (const s of stopsList) {
      const d = haversine(hub.lat, hub.lon, s.lat, s.lon);
      if (d <= 0.8 && stopToBuses[s.id]) {
        hubStops.push({
          stopId: s.id,
          name: s.name,
          buses: Array.from(stopToBuses[s.id]),
        });
      }
    }

    const hubBuses = new Set();
    for (const hs of hubStops) {
      for (const b of hs.buses) hubBuses.add(b);
    }

    for (const [slug, lData] of Object.entries(landmarkStops)) {
      const connectingBuses = [];
      for (const ls of lData.nearestStops) {
        for (const b of ls.buses) {
          if (hubBuses.has(b) && !connectingBuses.includes(b)) {
            connectingBuses.push(b);
          }
        }
      }

      if (connectingBuses.length > 0) {
        hubCorridors[hub.id].destinations[slug] = {
          directBuses: connectingBuses.map((bNo) => {
            const r = busNoToRoutes[bNo]?.[0];
            return {
              busNo: bNo,
              routeName: r ? r.name : `Bus ${bNo}`,
            };
          }),
          arrivalStop: lData.nearestStops[0]?.stopName || 'Nearby Stop',
          walkFromStopMeters: lData.nearestStops[0]?.distanceMeters || 100,
        };
      }
    }
  }

  console.log('--- 6. CREATING OPTIMIZED COMPILED JSON ---');
  const compiledData = {
    generatedAt: new Date().toISOString(),
    totalRoutes: Object.keys(routesMap).length,
    totalStops: stopsList.length,
    hubs: HUBS,
    landmarkStops,
    hubCorridors,
    allRoutesSample: Object.values(routesMap).slice(0, 100),
  };

  const outPath = path.join(__dirname, '..', 'data', 'pmpml-gtfs.json');
  fs.writeFileSync(outPath, JSON.stringify(compiledData, null, 2), 'utf-8');
  console.log('SUCCESS: Generated', outPath, 'Size:', (fs.statSync(outPath).size / 1024).toFixed(1), 'KB');
}

build();
