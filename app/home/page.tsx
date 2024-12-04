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
    const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", userId)
        .single();



    if (profileError && profileError.code !== 'PGRST116') { // Handle error only if it's not a "no data" error
        console.error("Error fetching profile:", profileError);
        return <p>Error loading profile</p>;
    }

    const { data: initialMatchData, error: matchProfileError } = await supabase.rpc('find_potential_matches', { request_user_id: userId });

    if (matchProfileError) {
        console.error("Error fetching potential matches:", matchProfileError);
        return;
    }

    //console.log(initialMatchData);

    let allMatchData: MatchingUser[];

    if (initialMatchData && initialMatchData.length > 0) {
        // Use Promise.all to wait for all asynchronous operations
         allMatchData = await Promise.all(
            initialMatchData.map(async (match) => {
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

    const { data: filter_data, error: filter_data_error } = await supabase.rpc('get_all_filter_data');

    const { data: notification_data, error: notification_error } = await supabase
        .rpc('get_user_notifications', {
            notifications_user_id: userId
        });

    if (filter_data_error || notification_error) {
        console.error("Error fetching data:", filter_data_error || notification_error);
        return <p>Error loading data</p>;
    }

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
                <Suspense fallback={<p>Loading feed...</p>}>
                    <div className="flex flex-col my-2">
                        {/* Render Notifications */}
                        {notification_data && notification_data.length > 0 ? (
                            notification_data.map((notification: Notification_user) => (
                                <NotificationItem key={notification.notification_id} notification={notification}/>
                            ))
                        ) : (
                            <p>No new notifications.</p>
                        )}
                    </div>
                </Suspense>
            </div>

            {/* middle section with matching and liking*/}
            {allMatchData ? (
            <div className="flex flex-col basis-1/2 bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg ">
                <MatchingCard matchData={allMatchData} userId={userId}/>
            </div>
            ): (
                    <p>No matches found</p>
            )}


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
                            data={filter_data.personalities}
                            keyField="personality_id"
                            labelField="personality"
                            user_id={userId}
                        />

                        {/* Relationship goals Options */}
                        <FilterSection
                            title="Relatiedoel"
                            table="relationship_goals"
                            data={filter_data.relationship_goals}
                            keyField="relationship_goals_id"
                            labelField="relationship_goals"
                            user_id={userId}
                        />

                        {/* Gender Options */}
                        <FilterSection
                            title="Gender"
                            table="gender"
                            data={filter_data.genders}
                            keyField="gender_id"
                            labelField="gender"
                            user_id={userId}
                        />

                        {/* Interests Options */}
                        <FilterSection
                            title="Interesses"
                            table="interests"
                            data={filter_data.interests}
                            keyField="id"
                            labelField="interest"
                            user_id={userId}
                        />

                        {/* Disability Options */}
                        <FilterSection
                            title="Beperking"
                            table="disability"
                            data={filter_data.disabilities}
                            keyField="disability_id"
                            labelField="disability"
                            user_id={userId}
                        />

                        {/* Home status Options */}
                        <FilterSection
                            title="Thuis status"
                            table="home_status"
                            data={filter_data.home_statuses}
                            keyField="home_status_id"
                            labelField="home_status"
                            user_id={userId}
                        />

                        {/* Religion Options */}
                        <FilterSection
                            title="Religie"
                            table="religion"
                            data={filter_data.religions}
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
                                            defaultValue={filter_data.distance || 15}
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
