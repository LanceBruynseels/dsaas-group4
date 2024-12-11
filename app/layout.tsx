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
    title: 'Vlinder',
    description: 'Vlinder speciaal voor jouw',
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
            <footer className="flex flex-row w-screen h-fit text-red-950 justify-between border-t border-red-950 py-5">
                <div className="hidden w-full h-fit gap-2 md:flex md:justify-center md:items-center">
                    <Link href={"/share"} className="text-red-950 w-[60%] text-center hover:text-red-950">
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