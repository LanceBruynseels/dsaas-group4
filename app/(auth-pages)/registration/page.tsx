"use client";
import React from 'react';
import { registerAction } from "@/app/actions/auth/registration/registration";
import { useFormState } from "react-dom";

const initialState = {
    error: null,
    success: null
};

const Registration: React.FC = () => {
    const [state, formAction] = useFormState(registerAction, initialState);

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

                    {/* Status Messages */}
                    {state?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {state.error}
                        </div>
                    )}
                    {state?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            {state.success}
                        </div>
                    )}

                    <form action={formAction} className="space-y-6">
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
                                <option value="faciliteit Leuven">faciliteit Leuven</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supervisor" className="block text-sm font-medium">
                                begeleider
                            </label>
                            <select
                                id="supervisor"
                                name="supervisor"
                                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                required
                            >
                                <option value="Kris">Kris</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-md font-semibold"
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