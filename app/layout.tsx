import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import NavBar from '@/components/navbar';
import Image from "next/image";
import "./globals.css";

// const defaultUrl = process.env.VERCEL_URL
//     ? https://${process.env.VERCEL_URL}
// : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="nl" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <main className="min-h-screen flex flex-col">
          <nav className="w-full border-b border-red-950 h-16 flex justify-between items-center px-5">
            {/* Logo + Navigation */}
            <NavBar />
            {/* Account Section */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-800">Mijn Account</span>
              <Image
                  src="/mock-picture.webp"
                  alt="Profile Picture"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-500"
              />
            </div>
          </nav>

          {/* Main Content */}
          <div className="flex-1 w-full">{children}</div>

          {/* Footer */}
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Powered by{" "}
              <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
              >
                Supabase
              </a>
            </p>
            <ThemeSwitcher />
          </footer>
        </main>
      </ThemeProvider>
      </body>
      </html>
  );
}