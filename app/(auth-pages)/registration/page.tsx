"use client";
import React, { useState } from 'react';
import { register } from '@/app/actions/auth/registration/registration';
import { useRouter } from 'next/navigation'; // for redirect

const Registration: React.FC = () => {
    const router = useRouter();
    const [status, setStatus] = useState<{
        type: 'error' | 'success' | null;
        message: string | null;
    }>({ type: null, message: null });

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
        <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#FFDFDB' }}>
            <div className="flex w-full max-w-7xl justify-around items-center px-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-6">
                    <img src="/logo.jpg" alt="VLinder Logo" className="h-60" />
                </div>

                {/* Form Section */}
                <div className="bg-red-600 text-white p-10 rounded-lg shadow-2xl w-96">
                    <h2 className="text-3xl font-bold mb-6">Registreer</h2>

                    {status.message && (
                        <div
                            className={`p-3 rounded-md mb-4 ${
                                status.type === 'success'
                                    ? 'bg-green-600'
                                    : 'bg-red-800'
                            }`}
                        >
                            {status.message}
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
                                <option value="faciliteit Antwerpen">faciliteit Antwerpen</option>
                                <option value="faciliteit Gent">faciliteit Gent</option>
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
                                <option value="Jan">Jan</option>
                                <option value="Peter">Peter</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-md font-semibold transition-colors duration-200"
                        >
                            Registreer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;