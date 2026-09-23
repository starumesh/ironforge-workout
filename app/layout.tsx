import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IronForge — Strength & Muscle Building Program',
  description:
    'A structured 4-day workout program focused on strength and muscle building with pre/post workout routines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
