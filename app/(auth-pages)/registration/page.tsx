"use client";
import React, { useState, useEffect } from 'react';
import { register } from '@/app/actions/auth/registration/registration';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Institution {
    id: number;
    institution: string;
}

interface Caretaker {
    id: string;
    display_name: string;
    role: string;
}

const Registration: React.FC = () => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [status, setStatus] = useState<{
        type: 'error' | 'success' | null;
        message: string | null;
    }>({type: null, message: null});

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch institutions
            const { data: institutionsData, error: institutionsError } = await supabase
                .from('institutions')
                .select('id, institution')
                .order('institution');

            if (institutionsError) {
                console.error('Error fetching institutions:', institutionsError);
                return;
            }

            setInstitutions(institutionsData || []);

            // Fetch only caretakers with role "caretaker"
            const { data: caretakersData, error: caretakersError } = await supabase
                .from('caretakers')
                .select('id, display_name, role')
                .eq('role', 'caretaker')
                .order('display_name');

            if (caretakersError) {
                console.error('Error fetching caretakers:', caretakersError);
                return;
            }

            setCaretakers(caretakersData || []);
        };

        fetchData();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsLoading(true);
            const result = await register(formData);

            if (result.success) {
                setStatus({
                    type: 'success',
                    message: result.redirect?.message || 'Registratie succesvol!'
                });

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: "hsl(10, 100%, 90%)" }}>
            <div className="flex w-full max-w-7xl justify-around items-center px-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-6">
                    <img src="/vlinder.png" alt="VLinder Logo" className="h-60" />
                    <h1 className="font-bold text-6xl">Vlinder</h1>
                </div>

                {/* Form Section */}
                <div className="bg-red-600 text-white p-12 rounded-lg shadow-2xl w-[36rem]" style={{ backgroundColor: "#771D1D" }}>
                    <h2 className="text-3xl font-bold mb-8">Registreer</h2>

                    {/* Status Messages */}
                    {status.type && (
                        <div className={`${
                            status.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
                        } border px-4 py-3 rounded relative mb-4`}>
                            {status.message}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-8">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-left">
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
                                <label htmlFor="first_name" className="block text-sm font-medium text-left">
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
                                <label htmlFor="last_name" className="block text-sm font-medium text-left">
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

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-left">
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

                        {/* Institution and Caretaker */}
                        <div className="flex justify-between space-x-6">
                            <div className="flex-1">
                                <label htmlFor="institution_id" className="block text-sm font-medium text-left">
                                    Organisatie
                                </label>
                                <select
                                    id="institution_id"
                                    name="institution_id"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                >
                                    <option value="">Selecteer organisatie</option>
                                    {institutions.map((inst) => (
                                        <option key={inst.id} value={inst.id}>
                                            {inst.institution}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="caretaker_id" className="block text-sm font-medium text-left">
                                    Begeleider
                                </label>
                                <select
                                    id="caretaker_id"
                                    name="caretaker_id"
                                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                                    required
                                >
                                    <option value="">Selecteer begeleider</option>
                                    {caretakers.map((caretaker) => (
                                        <option key={caretaker.id} value={caretaker.id}>
                                            {caretaker.display_name}
                                        </option>
                                    ))}
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
                            {isLoading ? "Bezig met registreren..." : "Registreer"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;