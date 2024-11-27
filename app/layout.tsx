import { GeistSans } from "geist/font/sans";
import NavBar from '@/components/navbar';
import "./globals.css";
import UserDisplay from '@/components/UserDisplay';
import Providers from '@/components/Providers';


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
          <nav className="w-full border-b border-red-950 h-16 flex justify-between items-center px-5">
            <NavBar />
            <UserDisplay />
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