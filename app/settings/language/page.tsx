// app/settings/language/page.tsx
import React from "react";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

// This page will handle the language settings
const LanguageSettingsPage = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Instellingen</h2>
                    <SubmitButton
                        className="px-6 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                    >
                        Log uit
                    </SubmitButton>
                </div>
                <ul className="space-y-4 flex-1">
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-900">
                        <Link href="/settings">Profiel</Link></li>
                    <li className="text-base font-semibold text-[#771D1D] cursor-pointer hover:text-gray-700">
                        <Link href="/settings/language">Taal Instellingen</Link>
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow justify-center items-center">
                <div className="w-full max-w-md p-6 bg-pink-100 rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                    <h2 className="text-2xl font-bold mb-6 text-center">Taal Instellingen</h2>

                    <div className="space-y-6">
                        {/* Language selection form */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700">Selecteer Taal</label>
                            <select className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md">
                                <option value="nl">Nederlands</option>
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                                {/* Add other language options as needed */}
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 flex justify-center">
                            <SubmitButton
                                className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                                style={{ backgroundColor: "#771D1D" }}
                            >
                                Opslaan
                            </SubmitButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageSettingsPage;
