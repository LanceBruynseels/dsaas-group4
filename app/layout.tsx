import { GeistSans } from "geist/font/sans";
import NavBar from '@/components/navbar';
import "./globals.css";
import UserDisplay from '@/components/UserDisplay';
import Providers from '@/components/Providers';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: 'Your Site Title',
    description: 'Your site description',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="nl" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
      <Providers>
        <main className="min-h-screen flex flex-col">
          <nav className="w-full h-fit">
            <NavBar />
          </nav>
          <div className="flex-1 w-full">{children}</div>
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            {/* ... footer content ... */}
          </footer>
        </main>
      </Providers>
      </body>
      </html>
  );
}