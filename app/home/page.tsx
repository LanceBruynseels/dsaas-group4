import Image from "next/image";
import { createClient } from '@/utils/supabase/server';
import FilterSection from '@components/filterselection';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { Notification_user } from "@components/notification";
import NotificationItem from '@components/notification';
import ProfilePopup from '@components/profilePopUp';
import React, {Suspense} from "react";
import SliderSettings from "@components/settings/sliderSettings";
import CustomSlider from "@components/customSlider";
import Loading from "@components/loading";
import { Carousel } from "flowbite-react";
import {FlowbiteCarousel} from "@components/flowbiteCarousel";
import ToggleLabel from "@components/toggleLabel";
import MatchingCard from "@components/matchingCard";
import {MatchingUser} from "@components/matchingCard";


export default async function HomePage() {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }

    const userId = session.user.id;
    // Fetch user profile to check if it's created

    const [profileData, initialMatchData, filterData, notifications_data] = await Promise.all([
        supabase.from("profile").select("*").eq("user_id", userId).single(),
        supabase.rpc('find_potential_matches', { request_user_id: userId }),
        supabase.rpc('get_all_filter_data'),
        supabase.rpc('get_user_notifications', { notifications_user_id: userId }),
    ]);

    // Handle errors more gracefully
    if (profileData.error || initialMatchData.error || filterData.error || notifications_data.error) {
        console.error("Error fetching data:", profileData.error || initialMatchData.error || filterData.error || notifications_data.error);
        return <p>Error loading data</p>;
    }

    //console.log(initialMatchData);

    let allMatchData: MatchingUser[];

    if (initialMatchData.data && initialMatchData.data.length > 0) {
        // Use Promise.all to wait for all asynchronous operations
         allMatchData = await Promise.all(
            initialMatchData.data.map(async (match) => {
                const { data: fileList, error: listError } = await supabase
                    .storage
                    .from('picturesExtra') // The storage bucket name
                    .list(match.user_id);

                if (listError) {
                    console.error(`Error listing files for user_id ${match.user_id}:`, listError);
                    return { ...match, publicUrls: [] }; // Default to empty array on error
                }

                // Generate public URLs for each file
                const publicUrls = fileList.map((file) =>
                    supabase.storage.from('picturesExtra').getPublicUrl(`${match.user_id}/${file.name}`).data.publicUrl
                );

                // Return the enriched match object
                return { ...match, publicUrls };
            })
        );

        //console.log(allMatchData);
        // Now `allMatchData` contains the original match data with publicUrls added.
    }

    const showProfilePopup = !profileData; // Show popup if no profile found

    return (
        <div className="flex flex-row w-full justify-center text-red-950">
            {/* Notifications Side Panel */}
            <div
                className="sm:hidden md:hidden lg:flex shadow-md lg:flex-col lg:basis-1/4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex flex-row p-4 justify-between items-center">
                    <h2 className="text-xl font-bold ">Meldingen</h2>
                    <div>
                        <Image src="/bell.png" alt="Bell Icon" height={25} width={25}/>
                    </div>
                </div>
                    <div className="flex flex-col my-2 h-full">
                        {/* Render Notifications */}
                        {notifications_data.data && notifications_data.data.length > 0 ? (
                            notifications_data.data.map((notification: Notification_user) => (
                                <NotificationItem key={notification.notification_id} notification={notification}/>
                            ))
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
                                            d="M15 17h5l-1.405 2.81A2.25 2.25 0 0116.5 21h-9a2.25 2.25 0 01-2.095-1.19L4 17h5m6 0V8.25a3 3 0 10-6 0V17m6 0H9"
                                        />
                                    </svg>
                                    <h2 className="text-2xl font-semibold text-red-800 mb-2">
                                        No Notifications
                                    </h2>
                                    <p className="text-red-700 text-center">
                                        You're all caught up! Check back later for new updates.
                                    </p>
                                </div>
                            </div>

                        )}
                    </div>
            </div>

            {/* middle section with matching and liking*/}
            <div
                className="flex flex-col basis-1/2 bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg ">
                {allMatchData ? (
                    <MatchingCard matchData={allMatchData} userId={userId}/>
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

                )}
            </div>

            {/* Search Settings Section */}
            <div
                className="sm:hidden md:hidden shadow-md lg:flex lg:flex-col lg:basis-1/4 p-4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] ">
                <h2 className="text-xl px-4 font-bold mb-4 text-red-950">Zoek Instellingen</h2>
                <div className={"flex flex-col h-full px-4 overflow-y-auto max-h-[650px] " +
                    "scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-red-950 scrollbar-track-red-50 h-32 overflow-"}>

                    <Suspense fallback={<Loading></Loading>}>
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
                            defaultValue={[18, 99]}
                            user_id={userId}
                        />
                        {/* Distance Slider */}
                        <div className="mb-4">
                            <SliderSettings label="Afstand tot anderen"
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
                </div>
            </div>

            {/* Pop-up screen for first login */}
            {showProfilePopup && (
                <ProfilePopup
                    userId={userId}
                    initialImageUrl={"mock-picture.webp"}
                    initialShowPopup={showProfilePopup}
                />
            )}
        </div>
    );
}
