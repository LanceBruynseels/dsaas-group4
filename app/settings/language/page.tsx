import React from 'react';
import { SubmitButton } from '@components/submit-button';
import Link from 'next/link';
import GoogleTranslate from '@components/settings/googleTranslate';

const LanguageSettingsPage = () => {
    return (
        <div className="flex flex-col min-h-screen sm:flex-row">
            {/* Sidebar */}
            <aside className="flex flex-col basis-1/4 p-6 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] rounded-lg shadow-md m-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#771D1D]">Instellingen</h2>
                </div>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="/settings"
                                className="text-base text-gray-600 hover:text-gray-900 transition"
                            >
                                Profiel
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/settings/language"
                                className="text-base font-semibold text-[#771D1D] hover:text-gray-700 transition"
                            >
                                Taal Instellingen
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex flex-col basis-3/4 p-6 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] rounded-lg shadow-md m-2 justify-center items-center">
                <div className="mt-4">
                    <GoogleTranslate />
                </div>
            </main>
        </div>
    );
};

export default LanguageSettingsPage;