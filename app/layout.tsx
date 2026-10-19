import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import AuthNav from '@/components/AuthNav';

export const metadata: Metadata = {
  title: { default: 'Explore Pune: places, trip planner and local guide', template: '%s | Explore Pune' },
  description: 'Forts, wadas, temples, museums, lakes and viewpoints across Pune, with a clear note on how reliable each listing is, plus a time-based trip planner.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">Explore Pune</Link>
            <nav aria-label="Main"><Link href="/">Places</Link><Link href="/planner">Trip planner</Link><Link href="/blogs">Blogs</Link><Link href="/about">Data and credits</Link><AuthNav /></nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="wrap">
            Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> (ODbL). Descriptions and photos, where shown, keep their original licences. <Link href="/about">Details</Link>
          </div>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
