'use client'

import React, {Suspense, useEffect, useState} from "react";
import {FlowbiteCarousel} from "@components/flowbiteCarousel";
import {NextResponse} from "next/server";
import Loading from "@components/loading";
import {UserPopup} from "@components/userPopup";
import RenderProfileTags from "@components/renderProfileTags";

interface ProfileData {
    genders: string[];         // or a specific type for gender values
    distance: number;
    interests: string[];       // or a specific type for interests
    religions: string[];       // or a specific type for religions
    home_status: string[];     // or a specific type for home status
    disabilities: string[];    // or a specific type for disabilities
    personalities: string[];   // or a specific type for personalities
    relationship_goals: string[]; // or a specific type for relationship goals
}

export interface MatchingUser {
    id: number;
    profile_picture_url: string;
    location: string | null;
    user_id: string;
    dob: string;
    first_name: string;
    last_name: string;
    relationship_goal_match: number;
    personality_match: number;
    gender_match: number;
    interest_match: number;
    disability_match: number;
    home_status_match: number;
    religion_match: number;
    distance_match: number;
    total_match_score: number;
    profile_data: ProfileData;
    publicUrls: string[];
}

interface MatchingUserProps {
    userId: string
}

export default function MatchingCard({ userId}: MatchingUserProps) {
    const [matchBuffer, setMatchBuffer] = useState<MatchingUser[]>([]);
    const [isPopupOpen, setPopupOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const refreshMatches = async () => {
        try {
            setIsLoading(true); // Start loading
            setMatchBuffer([]);
            const response = await fetch("/api/home/fetchMatches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                const matchData : MatchingUser[] = jsonResponse.allMatchData;
                console.log("matchData", matchData);
                //console.log("jsonResponse",jsonResponse);
                setMatchBuffer(matchData);
            }
        } catch (error) {
            console.error("Error fetching initial matches:", error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    useEffect(() => {
        refreshMatches();
    }, []);

    //console.log("matchingCard:", userId);
    useEffect(() => {
        // Ensure the buffer is initially filled
        if (matchBuffer && matchBuffer.length < 2) {
            fetchAdditionalUsers();
        }
    }, [matchBuffer]);

    const fetchAdditionalUsers = async () => {
        try {
            const response = await fetch("/api/home/fetchNewMatch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const jsonResponse: MatchingUser = await response.json();

            if (response.status == 200) {
                setMatchBuffer((prevBuffer) => [...prevBuffer, jsonResponse].slice(0, 5)); // Keep buffer size at 5
                console.log(matchBuffer);
            }

        } catch (error) {
            console.error("Error fetching new user:", error);
        }
    };

    const buttonMatchingAction = async (actionType: string) => {
        currentMatch = matchBuffer[0]; // The first user in the buffer
        if (!currentMatch) return;

        try {
            await fetch("/api/home/matching", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    actionType,
                    currentMatch: currentMatch.user_id,
                    userId: userId,
                }),
            });

            // Remove the first user and fetch a new one
            setMatchBuffer((prevBuffer) => prevBuffer.slice(1));
            fetchAdditionalUsers();
        } catch (error) {
            console.error("Error processing action:", error);
        }
    };

    let currentMatch: MatchingUser | null = matchBuffer.length > 0 ? matchBuffer[0] : null;


    return (
        <>
        <Suspense fallback={<Loading/>}>
            {isLoading ? (
                <>
                    <div className="flex flex-col justify-center items-center w-full h-full left-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-950"></div>
                        <p className="text-red-950 mt-4 text-lg">Loading...</p>
                    </div>
                </>
            ) : (
                currentMatch ? (
                    <>
                        <div className={"flex flex-row items-center w-full justify-between px-8"}>
                            <h2 className={"text-xl font-bold  text-red-950"}> Zoek hier je
                                nieuwe
                                match!</h2>
                            <button onClick={refreshMatches}>
                                <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2.3"
                                          d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-row lg:p-4 w-full h-full justify-center">
                            {currentMatch ? (
                                <div className="flex flex-row basis-1/2 min-h-[400px] min-w-[300px] m-2">
                                    <FlowbiteCarousel
                                        pictures={currentMatch.publicUrls || []}
                                        infoSection={<RenderProfileTags
                                            currentMatch={currentMatch}></RenderProfileTags>}
                                    />
                                </div>
                            ) : (
                                <p>No matches found</p>
                            )}
                            {/*Right Info Section for larger screens */}
                            <div
                                className="hidden lg:flex m-2 basis-1/2 flex-col h-full max-h-[500px] overflow-y-auto p-8 bg-gradient-to-b shadow-md from-gray-50 to-gray-200 text-red-950 rounded-lg">
                                <RenderProfileTags currentMatch={currentMatch}></RenderProfileTags>
                            </div>
                        </div>
                        <div className="flex justify-center align-middle items-center mt-6">
                            <div className="flex flex-col w-[100px] justify-center align-middle items-center">
                                <button
                                    onClick={() => buttonMatchingAction("dislike")}
                                    className="bg-gradient-to-br justify-center align-middle from-blue-400  max-w-[48px] to-blue-700 p-3 justify-center align-middle rounded-full hover:bg-gray-300 transition">
                                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                         viewBox="0 0 24 24">
                                        <path fillRule="evenodd"
                                              d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                                <p className="text-white justify-center align-middle pt-2">DISLIKE</p>
                            </div>

                            <div className="flex flex-col w-[100px] justify-center align-middle items-center">
                                <button
                                    onClick={() => buttonMatchingAction("heart")}
                                    className="bg-gradient-to-br from-red-400  max-w-[48px] to-red-700 p-3 justify-center align-middle rounded-full hover:bg-gray-300 transition">
                                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                         viewBox="0 0 24 24">
                                        <path
                                            d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/>
                                    </svg>
                                </button>
                                <p className="text-white justify-center align-middle pt-2">LOVE</p>
                            </div>

                            <div className="flex flex-col w-[100px] justify-center align-middle items-center">
                                <button
                                    onClick={() => buttonMatchingAction("like")}
                                    className="bg-gradient-to-br from-green-400  max-w-[48px] to-green-700 p-3 justify-center align-middle rounded-full hover:bg-gray-300 transition">
                                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                         viewBox="0 0 24 24">
                                        <path fillRule="evenodd"
                                              d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                                <p className="text-white justify-center align-middle pt-2">LIKE</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center w-full h-full ">
                        <div className="flex flex-col items-center p-8">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-16 h-16 text-red-800 mb-4"
                            >
                                <path
                                    strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75l.002 5.378a2.625 2.625 0 11-2.382 0V6.75m7.5 8.25a6.375 6.375 0 10-12.75 0"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-red-800 mb-2">
                            No Matches Found
                        </h2>
                        <p className="text-red-700 text-center">
                            Try adjusting your search settings or come back later. We’re always
                            working to find the best matches for you!
                        </p>
                    </div>
                </div>
                )
            )}
            </Suspense>

        </>
    );
}
