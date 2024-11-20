import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import NavBar from '@/components/navbar';
import Image from "next/image";
import "./globals.css";
// for session handler
import UserDisplay from '@/components/UserDisplay';
// import { getServerSession } from "next-auth/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {

    const session = await getServerSession(authOptions); // for session handler
    // console.log('Session in layout:', session);
    console.log('Layout - Session:', {
        exists: !!session,
        user: session?.user,
        expires: session?.expires
    });

    return (

      <html lang="nl" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
      >
        <main className="min-h-screen flex flex-col bg-[#FFDFDB]">
          <nav className="w-full border-b border-red-950 h-16 flex justify-between items-center px-5">
            {/* Logo + Navigation */}
            <NavBar />

            <UserDisplay session={session} />
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

