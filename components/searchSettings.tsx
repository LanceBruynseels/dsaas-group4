'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Loading from '@components/loading';
import FilterSection from '@components/filterselection';
import CustomSlider from '@components/customSlider';
import SliderSettings from '@components/settings/sliderSettings';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import Image from 'next/image';

class SearchSettingsProps {
    filterData: any;
    userId: string;
    sliderAgeRange: any;
}

export default function SearchSettings({ filterData, userId, sliderAgeRange }: SearchSettingsProps) {
    const [expanded, setExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle screen size changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)'); // Adjust based on your breakpoint
        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
            setExpanded(!e.matches); // Default to expanded on desktop, collapsed on mobile
        };

        // Initial check and listener setup
        handleMediaChange(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    // Shared Filter Sections
    const renderFilterSections = () => (
        <>
            <FilterSection
                title="Persoonlijkheid"
                table="personality"
                data={filterData.data.personalities}
                keyField="personality_id"
                labelField="personality"
                user_id={userId}
            />
            <FilterSection
                title="Relatiedoel"
                table="relationship_goals"
                data={filterData.data.relationship_goals}
                keyField="relationship_goals_id"
                labelField="relationship_goals"
                user_id={userId}
            />
            <FilterSection
                title="Gender"
                table="gender"
                data={filterData.data.genders}
                keyField="gender_id"
                labelField="gender"
                user_id={userId}
            />
            <FilterSection
                title="Interesses"
                table="interests"
                data={filterData.data.interests}
                keyField="id"
                labelField="interest"
                user_id={userId}
            />
            <FilterSection
                title="Beperking"
                table="disability"
                data={filterData.data.disabilities}
                keyField="disability_id"
                labelField="disability"
                user_id={userId}
            />
            <FilterSection
                title="Thuis status"
                table="home_status"
                data={filterData.data.home_statuses}
                keyField="home_status_id"
                labelField="home_status"
                user_id={userId}
            />
            <FilterSection
                title="Religie"
                table="religion"
                data={filterData.data.religions}
                keyField="religion_id"
                labelField="religion"
                user_id={userId}
            />
            <CustomSlider
                label="Zoek leeftijd"
                minValue={18}
                maxValue={99}
                defaultValue={[sliderAgeRange.min_age, sliderAgeRange.max_age]}
                user_id={userId}
            />
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
        </>
    );

    // Mobile Layout
    const mobileLayout = (
        <div className={`absolute ${
                expanded ? 'top-[100px] w-auto p-4 rounded-lg z-20 left-4 right-4 mb-4' : 'right-5 top-[100px] w-12 h-12 cursor-pointer rounded-lg z-10'
            } bg-red-50 transition-all`}
        >
            {expanded ? (
                <>
                    <div className="flex flex-row justify-between items-center p-4">
                        <h2 className="text-xl font-bold">Zoek instellingen</h2>
                        <button onClick={() => setExpanded(false)}>
                            <svg
                                className="w-6 h-6 text-gray-800 dark:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                />
                            </svg>
                        </button>
                    </div>
                    <Suspense fallback={<Loading />}>{renderFilterSections()}</Suspense>
                </>
            ) : (
                <div className="flex items-center justify-center h-full" onClick={() => setExpanded(true)}>
                    <Image src="/search-settings.png" alt="Search Settings Icon" height={25} width={25} />
                </div>
            )}
        </div>
    );

    // Desktop Layout
    const desktopLayout = (
        <div className="flex flex-row align-middle basis-1/2">
            <div className={`flex flex-row items-center justify-end ${expanded ? '' : 'w-full'}`}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                    {expanded ? <ChevronLast /> : <ChevronFirst />}
                </button>
            </div>
            <div
                className={`shadow-md flex flex-col rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] transition-all ${
                    expanded ? 'p-4 w-full m-4' : 'w-10 m-4 cursor-pointer'
                }`}
            >
                {expanded && (
                    <>
                        <h2 className="text-xl font-bold">Zoek instellingen</h2>
                        <div className="h-full max-h-[650px] px-4 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50">
                            <Suspense fallback={<Loading />}>{renderFilterSections()}</Suspense>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return <>{isMobile ? mobileLayout : desktopLayout}</>;
}
