"use client";
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

const SignInPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => null;
  }, []);

  // async function handleSubmit(event: React.FormEvent) {
  //   event.preventDefault();
  //   setIsLoading(true);
  //   setError(null);
  //
  //   const formData = new FormData(event.target as HTMLFormElement);
  //
  //   try {
  //     const result = await login(formData);
  //
  //     if (result.success) {
  //       console.log("Login successful, navigating to /protected/home");
  //       // Redirect using the URL provided by the server (from result.redirect)
  //       // router.push(result.redirect);  // Use `result.redirect` to ensure correct redirection
  //       router.push(result.redirect.destination);
  //     } else {
  //       setError(result.error || "An unexpected error occurred");
  //       console.log("Login failed:", result.error);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "An unexpected error occurred");
  //     console.error("Error during login:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/home');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }


  return isMobile ? ( // mobile version --------------------------------------------------------------------
      <div className="min-h-screen flex flex-col items-center p-4 pt-20"
           style={{ backgroundColor: "hsl(10, 100%, 90%)" }}>
        <div
            className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
          {/* Left Side: Logo and Brand */}
          <div className="flex flex-col items-center space-y-2 mb-6">
            <img
                src="/vlinder.png"
                alt="Vlinder Logo"
                className="h-16 w-auto"
            />
            <h1 className="font-bold text-xl text-gray-800">Vlinder</h1>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg " style={{backgroundColor: "#771D1D"}}>
            <h2 className="text-2xl font-semibold mb-4">Log in</h2>
            <p className="text-sm mb-6">
              Hebt u nog geen account?{" "}
              <Link href="/sign-up" className="underline text-white hover:text-gray-200">
                Registreer
              </Link>
            </p>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Gebruikersnaam
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                    required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Paswoord
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-2 border bg-white rounded-lg text-gray-800 focus:outline-none focus:border-pink-300"
                    required
                />
              </div>
              <button
                  type="submit"
                  disabled={isLoading}
                  style={{backgroundColor: '#FCA5A5'}}
                  className="w-full hover:bg-pink-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Bezig met inloggen..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
  ) : ( // laptop version ---------------------------------------------------------------------------
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div
            className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
          {/* Left Side: Logo and Brand */}
          <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} priority/>
            <h1 className="text-5xl font-bold text-gray-800">VLINDER</h1>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
            <h2 className="text-2xl font-semibold mb-4">Log in</h2>
            <p className="text-sm mb-6">
              Hebt u nog geen account?{" "}
              <Link href="/sign-up" className="underline text-white hover:text-gray-200">
                Registreer
              </Link>
            </p>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="username">
                  Gebruikersnaam
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                    required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Paswoord
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-2 border bg-white rounded-lg text-gray-800 focus:outline-none focus:border-pink-300"
                    required
                />
              </div>
              <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: '#FCA5A5' }}
                  className="w-full hover:bg-pink-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Bezig met inloggen..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SignInPage;