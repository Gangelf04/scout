import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthSessionProvider } from '@/components/providers/session-provider';
import { Header } from '@/components/layout/header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Scout - Sports Card Scouting App',
  description: 'Find the next big sports card investments before everyone else'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthSessionProvider>
          <div className='min-h-screen bg-background'>
            <Header />
            <main className='container mx-auto py-6'>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
