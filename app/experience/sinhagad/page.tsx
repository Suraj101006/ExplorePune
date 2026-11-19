import type { Metadata } from 'next';
import { Sinhagad2DGame } from '@/components/games/sinhagad/Sinhagad2DGame';

export const metadata: Metadata = {
  title: 'Sinhagad Fort 2D Archaeological Exploration | Explore Pune',
  description:
    'Playable, historically accurate 2D architectural recreation of Sinhagad Fort (Kondhana), featuring Pune Darwaza and Daru Kothar based on 2017 State Archaeology survey drawings.',
  keywords: [
    'Sinhagad Fort 2D Game',
    'Pune Darwaza',
    'Daru Kothar Sinhagad',
    'Explore Pune Game',
    'Maratha Architecture 2D',
    'Kimaya Architects Sinhagad',
    'Historical Fort Game',
  ],
  openGraph: {
    title: 'Sinhagad Fort 2D Archaeological Exploration | Explore Pune',
    description:
      'Step into the authentic 17th-century Maratha hill citadel of Sinhagad. Explore Pune Darwaza and the bomb-proof vaulted Daru Kothar.',
    images: ['/images/places/sinhagad-fort.jpg'],
  },
};

export default function SinhagadGamePage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-slate-950 flex flex-col">
      <Sinhagad2DGame />
    </main>
  );
}
