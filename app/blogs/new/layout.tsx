import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Write a Story | Explore Pune',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogNewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
