import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy & DPDP Transparency',
  description: 'Learn how Explore Pune uses essential cookies, local device storage, and privacy controls in full compliance with India’s Digital Personal Data Protection (DPDP) Act 2023.',
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: 'Cookie Policy & DPDP Transparency | Explore Pune',
    description: 'Learn how Explore Pune uses essential cookies, local device storage, and privacy controls in full compliance with India’s Digital Personal Data Protection (DPDP) Act 2023.',
    url: 'https://explorepune-guide.vercel.app/cookies',
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
