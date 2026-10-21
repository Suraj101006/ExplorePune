import { generateItineraryPdf } from '../lib/generateItineraryPdf.ts';
import fs from 'fs';

const samplePlan = {
  planTitle: 'Plan 1: Classic Heritage & Peshwa History',
  planTheme: 'Iconic historical landmarks, ancient forts, and cultural wadas across Pune.',
  badge: '🏛️',
  startLocationName: 'Shaniwar Wada (Old City)',
  startTime: '09:30 AM',
  travelMode: 'public_transit',
  totalDurationMinutes: 180,
  bufferMinutes: 25,
  estimatedCost: 125,
  stops: [
    {
      index: 1,
      name: 'Shaniwar Wada',
      arrivalTime: '09:30 AM',
      departureTime: '10:15 AM',
      visitMinutes: 45,
      travelMinutes: 0,
      entryCost: 25,
      transitSummary: 'Near Budhwar Peth / Mandai Metro (Purple Line). Buses: 2, 3, 9, 11.',
      nearestMetro: 'Budhwar Peth (0.3 km)',
      nearestBus: 'Shaniwar Wada Stop',
      transitStepByStep: ['Alight at Budhwar Peth Metro Station.', 'Walk 350m to Dilli Darwaza.'],
    },
    {
      index: 2,
      name: 'Lal Mahal',
      arrivalTime: '10:25 AM',
      departureTime: '10:55 AM',
      visitMinutes: 30,
      travelMinutes: 10,
      entryCost: 0,
      transitSummary: 'Opposite Shaniwar Wada across Shivaji Road.',
      nearestMetro: 'Budhwar Peth (0.4 km)',
      nearestBus: 'Lal Mahal Stop',
      transitStepByStep: ['Walk across Shivaji Road to red palace.'],
    },
  ],
};

const doc = generateItineraryPdf(samplePlan);
const output = doc.output();
fs.writeFileSync('C:/Users/Suraj/explore-pune/scripts/sample-verified.pdf', Buffer.from(output, 'binary'));
console.log('Verified generateItineraryPdf works! Output length:', output.length);
