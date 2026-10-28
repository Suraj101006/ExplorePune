import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Explore Pune',
  description: 'Sign in to access your personal Pune journeys, saved places, travel badges, and community stories.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
