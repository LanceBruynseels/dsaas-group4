import { GeistSans } from "geist/font/sans";
import NavBar from '@/components/navbar';
// import UserDisplay from '@/components/UserDisplay'
import "./globals.css";
import UserDisplay from '@/components/UserDisplay';
import Providers from '@/components/Providers';
import { Metadata } from 'next';
import Metrics from "@/app/metrics";
import Link from "next/link";

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
            <Metrics />
          <nav className="w-full h-fit">
            <NavBar/>
            {/*<UserDisplay/>*/}
          </nav>
          <div className="flex-1 w-full">{children}</div>
            <footer
                className="w-full border-t-red-950 flex items-center justify-center border-t mx-auto text-center text-xs py-16">
                <div className="flex flex-col items-center justify-center w-full text-white text-[4vh]">
                    <Link href={"/share"} className="text-white hover:text-red-950">
                        Deel met vrienden!
                    </Link>
                </div>
            </footer>

        </main>
      </Providers>
      </body>
      </html>
  );
}