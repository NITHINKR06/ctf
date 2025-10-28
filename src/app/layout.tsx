import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from '@/components/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CTF Dashboard - Capture The Flag Platform',
  description: 'Test your cybersecurity skills with our CTF challenges',
  keywords: 'CTF, Capture The Flag, Cybersecurity, Hacking, Challenges',
  authors: [{ name: 'CTF Platform' }],
  openGraph: {
    title: 'CTF Dashboard - Capture The Flag Platform',
    description: 'Test your cybersecurity skills with our CTF challenges',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}