// app/settings/page.tsx
import { createClient } from "@/utils/supabase/server";
import React from "react";
import { SubmitButton } from "@/components/submit-button";
import Slider from "@/components/slider";
import ProfilePicture from "@/components/profilePicture";
import FilterSection from "@/components/filterselection";
import InputFieldsSection from "@components/InputFieldSection";
import Link from "next/link";

const SettingsPage = async () => {
    const userId = 'abb0c0af-904c-4c52-b19b-5be0fc3da588'; // Hardcoded userId

    let filterData = {
        personalities: [],
        relationship_goals: [],
        genders: [],
        interests: [],
        disabilities: [],
        home_statuses: [],
        religions: [],
    };

    try {
        // Fetch all filter data
        const { data: filterDataResponse, error: filterError } = await createClient().rpc("get_all_filter_data");
        if (filterError) {
            console.error("Error fetching filter data:", filterError);
        } else {
            filterData = filterDataResponse || filterData;
        }
    }
    catch (error) {
        console.error("Unexpected error:", error);
    }


    return (
        <div className="flex">
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
                    <li className="text-base font-semibold text-[#771D1D] cursor-pointer hover:text-[#771D1D]">
                        <Link href="/settings">Profiel</Link>
                    </li>
                    <li className="text-base text-gray-500 cursor-pointer hover:text-gray-700">
                        <Link href="/settings/language">Taal Instellingen</Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow">
                {/* Profile Picture Section */}
                <div className="flex flex-col justify-center items-center mb-6">
                    <ProfilePicture userId={userId} />
                </div>

                {/* Input Fields Section */}
                <InputFieldsSection
                    fields={[
                        { label: "Mijn voornaam", type: "text", value: "" },
                        { label: "Mijn achternaam", type: "text", value: "" },
                    ]}
                />

                {/* Filter Sections */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <FilterSection
                        title="Mijn persoonlijkheid"
                        data={filterData.personalities}
                        keyField="personality_id"
                        labelField="personality"
                    />
                    <FilterSection
                        title="Mijn relatiedoel"
                        data={filterData.relationship_goals}
                        keyField="relationship_goals_id"
                        labelField="relationship_goals"
                    />
                    <FilterSection
                        title="Mijn gender"
                        data={filterData.genders}
                        keyField="gender_id"
                        labelField="gender"
                    />
                    <FilterSection
                        title="Mijn interesses"
                        data={filterData.interests}
                        keyField="id"
                        labelField="interest"
                    />
                    <FilterSection
                        title="Mijn beperking"
                        data={filterData.disabilities}
                        keyField="disability_id"
                        labelField="disability"
                    />
                    <FilterSection
                        title="Mijn thuisstatus"
                        data={filterData.home_statuses}
                        keyField="home_status_id"
                        labelField="home_status"
                    />
                    <FilterSection
                        title="Mijn religie"
                        data={filterData.religions}
                        keyField="religion_id"
                        labelField="religion"
                    />
                </div>

                {/* Sliders */}
                <div className="flex justify-between gap-4 mt-4 mb-6">
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Afstand" unit="km" min={5} max={30} defaultValue={15} sliderColor="#771D1D" />
                    </div>
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Leeftijd" unit="jaar" min={18} max={60} defaultValue={24} sliderColor="#771D1D" />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-2 py-5 flex justify-center">
                    <SubmitButton
                        className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                        pendingText="Vernieuw profiel..."
                    >
                        Vernieuw profiel
                    </SubmitButton>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
