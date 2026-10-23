import type { Metadata } from 'next';
import CommunityClient from '@/components/CommunityClient';

export const metadata: Metadata = {
  title: 'Pune Community | Real Experiences, Tips & Discussions',
  description:
    'Discover Pune through authentic experiences, local travel tips, questions, and recommendations shared by visitors and locals for forts, heritage, and temples.',
};

export default function CommunityPage() {
  return <CommunityClient />;
}
