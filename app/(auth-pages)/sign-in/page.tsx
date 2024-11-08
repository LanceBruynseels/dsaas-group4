"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { login } from 'app/actions/auth/sign-in/action';  // Import login from action.ts

const SignInPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const result = await login(formData);

            window.location.href = '/protected/home';

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} />
                    <h1 className="text-5xl font-bold text-gray-800">VLINDER</h1>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
                    <h2 className="text-2xl font-semibold mb-4">Log in</h2>
                    <p className="text-sm mb-6">
                        Hebt u nog geen account?{" "}
                        <Link href="/register" className="underline text-white hover:text-gray-200">
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
