import React from "react";
import Image from "next/image";
import { SubmitButton } from "@/components/submit-button";
import Slider from "@/components/slider";
import ToggleLabel from "@/components/toggleLabel";
import { supabase } from "@/utils"; // Import your Supabase client

export default function SettingsPage({
                                         personalityTags,
                                         religionTags,
                                         genderTags,
                                     }: {
    personalityTags: string[];
    religionTags: string[];
    genderTags: string[];
}) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Instellingen</h2>
                <ul className="space-y-4 flex-1">
                    <li className="text-base font-medium text-gray-700 cursor-pointer hover:text-gray-900">Profiel</li>
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Notificaties</li>
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-700">Taal Instellingen</li>
                </ul>
                <SubmitButton
                    className="px-6 py-2 text-white font-bold rounded-md hover:bg-red-600 mt-auto"
                    style={{ backgroundColor: "#771D1D" }}
                >
                    Log uit
                </SubmitButton>
            </div>

            {/* Main Content */}
            <div
                className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] overflow-y-auto">
                {/* Profile Picture and Inputs */}
                <div className="flex flex-col justify-center items-center mb-4">
                    <div className="relative">
                        <Image
                            src="/profileImage.png" // Replace with a valid image path
                            alt="Profiel foto"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                                 stroke="currentColor" className="w-4 h-4 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15.232 5.232l3.536 3.536m-2.036-7.036a1.5 1.5 0 00-2.121 0L3 14.707V21h6.293l10.121-10.121a1.5 1.5 0 000-2.121L15.232 1.196z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Voornaam</label>
                            <input
                                type="text"
                                placeholder="Voornaam"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Achternaam</label>
                            <input
                                type="text"
                                placeholder="Achternaam"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Personality</label>
                        <ClientTags tags={personalityTags} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Religion</label>
                        <ClientTags tags={religionTags} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <ClientTags tags={genderTags} />
                    </div>
                </div>

                {/* Sliders */}
                <div className="flex justify-between gap-4 mt-4">
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Afstand" unit="km" min={5} max={30} defaultValue={15} />
                    </div>
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Leeftijd" unit="jaar" min={18} max={60} defaultValue={24} />
                    </div>
                </div>

                {/* Additional Fields */}
                <div className="flex justify-between gap-4 mt-4">
                    <div className="flex-1 px-20 w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Geboorte datum</label>
                        <input
                            type="date"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex-1 px-20 w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Organisatie</label>
                        <input
                            type="text"
                            placeholder="Organisatie"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-2 py-5 flex justify-center">
                    <SubmitButton
                        className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                        pendingText="Vernieuw profiel...">
                        Vernieuw profiel
                    </SubmitButton>
                </div>
            </div>
        </div>
    );
}

function ClientTags({ tags }: { tags: string[] }) {
    return (
        <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
                <ToggleLabel key={tag} tag={tag} />
            ))}
        </div>
    );
}

// Fetch the tags server-side
export async function getServerSideProps() {
    // Fetch the tags from the database
    try {
        const { data: personalityData, error: personalityError } = await supabase
            .from("personality_tags")
            .select("tag_name");

        if (personalityError) throw new Error(personalityError.message);

        const { data: religionData, error: religionError } = await supabase
            .from("religion_tags")
            .select("tag_name");

        if (religionError) throw new Error(religionError.message);

        const { data: genderData, error: genderError } = await supabase
            .from("gender_tags")
            .select("tag_name");

        if (genderError) throw new Error(genderError.message);

        return {
            props: {
                personalityTags: personalityData?.map((tag: { tag_name: string }) => tag.tag_name) || [],
                religionTags: religionData?.map((tag: { tag_name: string }) => tag.tag_name) || [],
                genderTags: genderData?.map((tag: { tag_name: string }) => tag.tag_name) || [],
            },
        };
    } catch (error) {
        console.error("Error fetching tags:", error);
        return {
            props: {
                personalityTags: [],
                religionTags: [],
                genderTags: [],
            },
        };
    }
}
