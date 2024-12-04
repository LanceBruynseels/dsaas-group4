"use client";
import React, { useState } from "react";
import { register } from "@/app/actions/auth/registration/registration";
import { useRouter } from "next/navigation";
import Image from "next/image"; // for redirect

const Registration: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [status, setStatus] = useState<{
        type: "error" | "success" | null;
        message: string | null;
    }>({ type: null, message: null });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(event.currentTarget); // Extract form data
        setIsLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                setStatus({
                    type: "success",
                    message: result.redirect?.message || "Registratie succesvol!",
                });

                if (result.redirect?.destination) {
                    setTimeout(() => {
                        router.push(result.redirect!.destination);
                    }, 1500);
                }
            } else {
                setStatus({
                    type: "error",
                    message: result.error || "Registratie mislukt",
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "Er is een onverwachte fout opgetreden.",
            });
        } finally {
            setIsLoading(false);
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
                    <Image src="/vlinder.png" alt="VLinder Logo" className="h-60" width={50} height={50}/>
                    <h1 className="font-bold text-6xl">Vlinder</h1>
                </div>

                {/* Form Section */}
                <div
                    className="bg-red-600 text-white p-10 rounded-lg shadow-2xl w-96"
                    style={{ backgroundColor: "#771D1D" }}
                >
                    <h2 className="text-3xl font-bold mb-6">Registreer</h2>

                    {/* Status Messages */}
                    {status.type === "error" && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {status.message}
                        </div>
                    )}
                    {status.type === "success" && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                <option value="faciliteit Heverlee">faciliteit Heverlee</option>
                                <option value="faciliteit Kessel-lo">faciliteit Kessel-lo</option>
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
                                <option value="Chris">Chris</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ backgroundColor: "#FCA5A5" }}
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
