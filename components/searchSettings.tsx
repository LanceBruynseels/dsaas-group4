'use client'

import React, {Suspense, useState} from "react";
import Loading from "@components/loading";
import FilterSection from "@components/filterselection";
import CustomSlider from "@components/customSlider";
import SliderSettings from "@components/settings/sliderSettings";
import {ChevronFirst, ChevronLast} from "lucide-react";
import Image from "next/image";

class SeachSettingsProps {
    filterData: any;
    userId: string;
    sliderAgeRange: any;
}

export default function SearchSettings({filterData, userId, sliderAgeRange} : SeachSettingsProps) {
    const [expanded, setExpanded] = useState(true)

    return (
        <div className="flex flex-row align-middle lg:basis-1/2 ">
            <div className={`flex flex-row items-center justify-end transition-all ${
                expanded ? "" : "w-full"
            }`}>
                <button
                    onClick={() => setExpanded((curr) => !curr)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 "
                >
                    {expanded ? <ChevronLast/> : <ChevronFirst/>}
                </button>
            </div>
            <div
                className={`sm:hidden md:hidden shadow-md lg:flex lg:flex-col  rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] transition-all ${
                    expanded ? "p-4 w-full m-4" : "w-10 m-4"
                }`}>
                <div
                     className={`flex flex-row justify-between items-center ${
                         expanded ? "p-4" : "px-1 py-4"
                     }`}>
                    <h2 className={`text-xl font-bold overflow-hidden  ${
                        expanded ? "w-60" : "w-0"
                    }`}>Zoek instellingen</h2>
                    <div>
                        <Image src="/search-settings.png" alt="Bell Icon" height={25} width={25}/>
                    </div>

                </div>
                <div className={`h-full transition${
                    expanded ? " max-h-[650px] px-4 overflow-y-auto  scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50 h-32 flex flex-col" : "overflow-clip"
                }`}>
                    {expanded && (
                        <Suspense fallback={<Loading />}>
                            {/* Personality Options */}
                            <FilterSection
                                title="Persoonlijkheid"
                                table="personality"
                                data={filterData.data.personalities}
                                keyField="personality_id"
                                labelField="personality"
                                user_id={userId}
                            />

                            {/* Relationship goals Options */}
                            <FilterSection
                                title="Relatiedoel"
                                table="relationship_goals"
                                data={filterData.data.relationship_goals}
                                keyField="relationship_goals_id"
                                labelField="relationship_goals"
                                user_id={userId}
                            />

                            {/* Gender Options */}
                            <FilterSection
                                title="Gender"
                                table="gender"
                                data={filterData.data.genders}
                                keyField="gender_id"
                                labelField="gender"
                                user_id={userId}
                            />

                            {/* Interests Options */}
                            <FilterSection
                                title="Interesses"
                                table="interests"
                                data={filterData.data.interests}
                                keyField="id"
                                labelField="interest"
                                user_id={userId}
                            />

                            {/* Disability Options */}
                            <FilterSection
                                title="Beperking"
                                table="disability"
                                data={filterData.data.disabilities}
                                keyField="disability_id"
                                labelField="disability"
                                user_id={userId}
                            />

                            {/* Home status Options */}
                            <FilterSection
                                title="Thuis status"
                                table="home_status"
                                data={filterData.data.home_statuses}
                                keyField="home_status_id"
                                labelField="home_status"
                                user_id={userId}
                            />

                            {/* Religion Options */}
                            <FilterSection
                                title="Religie"
                                table="religion"
                                data={filterData.data.religions}
                                keyField="religion_id"
                                labelField="religion"
                                user_id={userId}
                            />

                            {/* Age Slider */}
                            <CustomSlider
                                label="Zoek leeftijd"
                                minValue={18}
                                maxValue={99}
                                defaultValue={[sliderAgeRange.min_age, sliderAgeRange.max_age]}
                                user_id={userId}
                            />

                            {/* Distance Slider */}
                            <div className="mb-4">
                                <SliderSettings
                                    label="Afstand tot anderen"
                                    unit="km"
                                    min={5}
                                    max={30}
                                    defaultValue={filterData.data.distance || 15}
                                    userId={userId}
                                    sliderColor="#771D1D"
                                    table="search_distance"
                                />
                            </div>
                        </Suspense>
                    )}
                </div>
            </div>
        </div>
    )
}