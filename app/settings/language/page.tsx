import React from "react";
import { SubmitButton } from "@components/submit-button";
import LanguageSettingsAction from "@/app/actions/settings/language/action";
import Link from "next/link";
import {useIsMobile} from "@components/mediaQuery";

const LanguageSettingsPage = () => {
    var isMobile = true;
    return isMobile ? (
        <div className="flex min-h-screen">
            <div className="fixed top-20 left-4 z-50">
                <div className="group inline-block relative">
                    <button
                        className="text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{backgroundColor: "hsl(10, 100%, 90%)"}}
                    >
                        <svg
                            className="h-6 w-6"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <div
                        className="absolute hidden group-hover:block mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                        <div className="py-1">
                            <a href="/settings"
                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profiel</a>
                            <a href="/settings/language"
                               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Taal Instellingen
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div
                className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow justify-center items-center">
                <LanguageSettingsAction/>
            </div>
        </div>
    ) : (
        <div className="flex min-h-screen">
            Sidebar
            <div
                className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Instellingen</h2> {/* Static title */}
                    <SubmitButton
                        className="px-6 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{backgroundColor: "#771D1D"}}
                    >
                        Uitloggen {/* Static logout button text */}
                    </SubmitButton>
                </div>
                <ul className="space-y-4 flex-1">
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-900">
                        <Link href="/settings">Profiel</Link> {/* Static profile link */}
                    </li>
                    <li className="text-base font-semibold text-[#771D1D] cursor-pointer hover:text-gray-700">
                        <Link href="/settings/language">Taalinstellingen</Link> {/* Static language settings link */}
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div
                className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow justify-center items-center">
                <LanguageSettingsAction/>
            </div>
        </div>
    );
};

export default LanguageSettingsPage;
