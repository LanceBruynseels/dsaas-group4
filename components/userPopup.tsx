'use client';

import { FlowbiteCarousel } from "@components/flowbiteCarousel"; // Import your custom carousel
import { useRouter } from "next/router";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import RenderProfileTags from "@components/renderProfileTags"; // Assuming you're using Next.js for navigation

export function UserPopup({ currentMatch, isOpen, onClose }) {

    if (!isOpen || !currentMatch) return null;

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1280); // Tailwind's `md` breakpoint
        };

        // Set initial value and attach listener
        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full h-[600px] max-w-4xl p-4 bg-white rounded-lg shadow-lg lg:p-6">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    ✖
                </button>

                <div className="flex flex-col h-full  lg:flex-row p-4">
                    <Image
                        className="absolute top-0 items-center z-50 hidden lg:block"
                        src="/new-match.png"
                        alt="new-match"
                        width={200}
                        height={200}
                    />

                    <FlowbiteCarousel
                        pictures={currentMatch.publicUrls || []}
                        infoSection={
                            <>
                                <h2 className="text-3xl font-extrabold mb-8 text-[#00AA00]">
                                New Match Found! 🎉🎉
                                </h2>
                                <RenderProfileTags currentMatch={currentMatch}></RenderProfileTags>
                            </>}
                />

                <div className="flex flex-col items-center w-full mt-6 lg:mt-0 lg:w-1/2 lg:pl-6">
                {/* "New Match Found" Text */}
                        {!isSmallScreen ? (<>
                        <h2 className="text-3xl font-extrabold mb-8 text-[#00AA00]">
                            New Match Found! 🎉🎉
                        </h2>
                        <div className="flex flex-col items-start">
                            <h2 className="text-2xl font-bold">
                                {currentMatch.first_name},{" "}
                                {currentMatch.dob &&
                                    new Date().getFullYear() -
                                    new Date(currentMatch.dob).getFullYear()}{" "}
                                years
                            </h2>
                            {currentMatch?.profile_data?.genders?.length > 0 && (
                                <div className="mt-4">
                                    <strong>Gender</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {currentMatch.profile_data.genders.map((gender, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm"
                                            >
                                                {gender}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="mt-4">
                                <strong>Personality</strong>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {currentMatch.profile_data.personalities.map((personality, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm"
                                        >
                                            {personality}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4">
                                <strong>Interests</strong>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {currentMatch.profile_data.interests.map((interest, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div></>):(<div/>)}
                        {/* Start Chat Button */}
                        <button
                            className=" items-center px-6 py-2 mt-6 w-[200px] text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-600"
                        >
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
