import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Explore Pune',
  description:
    'Explore Pune privacy policy: data protection under DPDP Act 2023, local storage usage, user accounts, and location privacy.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
