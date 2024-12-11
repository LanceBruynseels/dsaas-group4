"use client";
import React, { useState } from 'react';
import { register } from '@/app/actions/auth/registration/registration';
import { useRouter } from 'next/navigation'; // for redirect

const Registration: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [status, setStatus] = useState<{
        type: 'error' | 'success' | null;
        message: string | null;
    }>({type: null, message: null});

    const handleSubmit = async (formData: FormData) => {
        try {
            const result = await register(formData);

            if (result.success) {
                // set status message from the API response
                setStatus({
                    type: 'success',
                    message: result.redirect?.message || 'Registratie succesvol!'
                });

                // handle redirect if provided by the API
                if (result.redirect?.destination) {
                    setTimeout(() => {
                        router.push(result.redirect!.destination);
                    }, 1500);
                }
            } else {
                setStatus({
                    type: 'error',
                    message: result.error || 'Registratie mislukt'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Er is een onverwachte fout opgetreden.'
            });
        }
    };

    return (
        <div
            className="min-h-screen flex justify-center items-center"
            style={{ backgroundColor: "hsl(10, 100%, 90%)" }}
        >
            <div className="flex w-full max-w-7xl justify-around items-center px-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-6">
                    <img src="/vlinder.png" alt="VLinder Logo" className="h-60" />
                    <h1 className="font-bold text-6xl">Vlinder</h1>
                </div>

                {/* Form Section */}
                <div
                    className="bg-red-600 text-white p-12 rounded-lg shadow-2xl w-[36rem]"
                    style={{ backgroundColor: "#771D1D" }}
                >
                    <h2 className="text-3xl font-bold mb-8">Registreer</h2>

                    {/* Status Messages */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            {success}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-8">
                        {/* Gebruikersnaam */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-left"
                            >
                                Gebruikersnaam
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            />
                        </div>

                        {/* Voornaam and Achternaam */}
                        <div className="flex justify-between space-x-6">
                            <div className="flex-1">
                                <label
                                    htmlFor="first_name"
                                    className="block text-sm font-medium text-left"
                                >
                                    Voornaam
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="last_name"
                                    className="block text-sm font-medium text-left"
                                >
                                    Achternaam
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                />
                            </div>
                        </div>

                        {/* Paswoord */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-left"
                            >
                                Paswoord
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            />
                        </div>

                        {/* Faciliteit and Begeleider */}
                        <div className="flex justify-between space-x-6">
                            <div className="flex-1">
                                <label
                                    htmlFor="facility"
                                    className="block text-sm font-medium text-left"
                                >
                                    Faciliteit
                                </label>
                                <select
                                    id="facility"
                                    name="facility"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                >
                                    <option value="">Selecteer faciliteit</option>
                                    <option value="faciliteit Leuven">
                                        faciliteit Leuven
                                    </option>
                                    <option value="faciliteit Heverlee">
                                        faciliteit Heverlee
                                    </option>
                                    <option value="faciliteit Kessel-lo">
                                        faciliteit Kessel-lo
                                    </option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="supervisor"
                                    className="block text-sm font-medium text-left"
                                >
                                    Begeleider
                                </label>
                                <select
                                    id="supervisor"
                                    name="supervisor"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                >
                                    <option value="">Selecteer begeleider</option>
                                    <option value="Kris">Kris</option>
                                    <option value="Jan">Jan</option>
                                    <option value="Chris">Chris</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ backgroundColor: "#FCA5A5" }}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-4 rounded-md font-semibold disabled:opacity-50"
                        >
                            {isLoading
                                ? "Bezig met registreren..."
                                : "Registreer"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;