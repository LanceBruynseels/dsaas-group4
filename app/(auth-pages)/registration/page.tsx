"use client";
import React, { useState } from 'react';

const Registration: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        try {
            setIsLoading(true);
            setError(null);

            // call the API directly
            const response = await fetch('/api/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.get("username"),
                    password: formData.get("password"),
                    facility: formData.get("facility"),
                    supervisor: formData.get("supervisor")
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error);
            }

            setSuccess("Registratie succesvol!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: "hsl(10, 100%, 90%)" }}>
            <div className="flex w-full max-w-7xl justify-around items-center px-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-6">
                    <img src="/vlinder.png" alt="VLinder Logo" className="h-60" />
                </div>

                {/* Form Section */}
                <div className="bg-red-600 text-white p-10 rounded-lg shadow-2xl w-96">
                    <h2 className="text-3xl font-bold mb-6">Registreer</h2>

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

                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Gebruikersnaam
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Paswoord
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="facility" className="block text-sm font-medium">
                                Faciliteit
                            </label>
                            <select
                                id="facility"
                                name="facility"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            >
                                <option value="">Selecteer faciliteit</option>
                                <option value="faciliteit Leuven">faciliteit Leuven</option>
                                {/* Add more facilities as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supervisor" className="block text-sm font-medium">
                                Begeleider
                            </label>
                            <select
                                id="supervisor"
                                name="supervisor"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            >
                                <option value="">Selecteer begeleider</option>
                                <option value="Kris">Kris</option>
                                {/* Add more supervisors as needed */}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-md font-semibold disabled:opacity-50"
                        >
                            {isLoading ? "Bezig met registreren..." : "Registreer"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;