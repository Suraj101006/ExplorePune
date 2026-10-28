import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account & Preferences | Explore Pune',
  description: 'Manage your profile, saved itineraries, and travel preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
