import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Explore Pune',
  description:
    'Terms of service, community discussion guidelines, travel safety disclaimers, and user obligations for Explore Pune.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
