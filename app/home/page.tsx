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

interface MatchingUser {
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
}

type MatchingUsersResponse = MatchingUser[];

export default async function HomePage() {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }

    const user_id = session.user.id;
    // Fetch user profile to check if it's created
    const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user_id)
        .single();



    if (profileError && profileError.code !== 'PGRST116') { // Handle error only if it's not a "no data" error
        console.error("Error fetching profile:", profileError);
        return <p>Error loading profile</p>;
    }

    const {data: matchData, error: matchProfileError} = await supabase.rpc('find_potential_matches', {request_user_id: user_id})

    // Ensure data is typed correctly as an array of MatchingUser objects
    const typedMatchData: MatchingUsersResponse = matchData;
    console.log(matchData)

    let publicUrls : string[];
    if(typedMatchData.length > 0){
        const { data: fileList, error: listError } = await supabase
            .storage
            .from('picturesExtra') // The storage bucket name
            .list(typedMatchData[0].user_id);

        // Generate public URLs for each file in the list
        publicUrls = fileList.map((file) =>
            supabase.storage.from('picturesExtra').getPublicUrl(`${typedMatchData[0].user_id}/${file.name}`).data.publicUrl
        );
        //console.log(publicUrls)
    }

    // Check if there are matches
    if (typedMatchData.length > 0) {
        // console.log("Matching user data:", typedMatchData);
        // console.log("Profile data of the first match:", typedMatchData[0].profile_data);
    } else {
        console.log("No matches found");
    }
    const showProfilePopup = !profileData; // Show popup if no profile found

    const { data: filter_data, error: filter_data_error } = await supabase.rpc('get_all_filter_data');

    const { data: notification_data, error: notification_error } = await supabase
        .rpc('get_user_notifications', {
            notifications_user_id: user_id
        });

    if (filter_data_error || notification_error) {
        console.error("Error fetching data:", filter_data_error || notification_error);
        return <p>Error loading data</p>;
    }

    return (
        <div className="flex flex-row w-full text-red-950">
            {/* Notifications Side Panel */}
            <div className="flex flex-col basis-1/4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
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


            <div className="flex flex-col basis-1/2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg ">
                <h2 className={"text-xl font-bold mb-4 text-red-950 text-center"}> Zoek hier je nieuwe match!</h2>
                <div className="flex flex-col p-4 w-full h-full">
                    <div className="flex flex-row basis-1/2 h-[500px]">
                        <Suspense fallback={<p>Loading feed...</p>}>
                            <div className="flex flex-row lg:basis-1/2  md:w-full sm:w-full min-w-[300px] h-[500px]">
                                <FlowbiteCarousel
                                    pictures={publicUrls}
                                    infoSection={
                                        <div className="flex flex-col items-start">
                                            <h2 className="text-2xl font-bold">
                                                {typedMatchData[0].first_name}, {new Date().getFullYear() - new Date(typedMatchData[0].dob).getFullYear()} jaar
                                            </h2>
                                            {typedMatchData[0]?.profile_data?.genders?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Gender</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.genders.map((gender, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {gender}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.interests?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Interests</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.interests.map((interest, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {interest}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.religions?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Religion</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.religions.map((religion, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {religion}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.home_status?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Home Status</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.home_status.map((status, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {status}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.disabilities?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Disabilities</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.disabilities.map((disability, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {disability}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.personalities?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Personality</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.personalities.map((personality, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {personality}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {typedMatchData[0]?.profile_data?.relationship_goals?.length > 0 && (
                                                <div className="mt-4 text-red-950">
                                                    <strong>Relationship Goals</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {typedMatchData[0].profile_data.relationship_goals.map((goal, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                                {goal}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        </Suspense>
                        {/* Right Info Section for larger screens */}
                        <div className="hidden lg:flex m-2 basis-1/2 flex-col h-[500px] p-8 bg-gradient-to-b shadow-md from-gray-50 to-gray-200 text-red-950 rounded-lg">
                            <h2 className="text-2xl font-bold">
                                {typedMatchData[0].first_name}, {typedMatchData[0].dob && new Date().getFullYear() - new Date(typedMatchData[0].dob).getFullYear()} jaar
                            </h2>
                            {typedMatchData[0]?.profile_data?.genders?.length > 0 && (
                                <div className="mt-4">
                                    <strong>Gender</strong>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {typedMatchData[0].profile_data.genders.map((gender, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-sm">
                                                {gender}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Additional details here as per the original layout */}
                        </div>
                    </div>
                </div>
                    <div className="flex justify-around mt-6">
                        {['thumbs-down', 'thumbs-up', 'heart', 'message-circle'].map((icon) => (
                            <button key={icon} className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
                                <Image src={`/${icon}.png`} alt={icon} width={24} height={24}/>
                            </button>
                        ))}
                    </div>

            </div>



            {/* Search Settings Section */}
            <div className="basis-1/4 p-4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] ">
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
                            user_id={user_id}
                        />

                        {/* Relationship goals Options */}
                        <FilterSection
                            title="Relatiedoel"
                            table="relationship_goals"
                            data={filter_data.relationship_goals}
                            keyField="relationship_goals_id"
                            labelField="relationship_goals"
                            user_id={user_id}
                        />

                        {/* Gender Options */}
                        <FilterSection
                            title="Gender"
                            table="gender"
                            data={filter_data.genders}
                            keyField="gender_id"
                            labelField="gender"
                            user_id={user_id}
                        />

                        {/* Interests Options */}
                        <FilterSection
                            title="Interesses"
                            table="interests"
                            data={filter_data.interests}
                            keyField="id"
                            labelField="interest"
                            user_id={user_id}
                        />

                        {/* Disability Options */}
                        <FilterSection
                            title="Beperking"
                            table="disability"
                            data={filter_data.disabilities}
                            keyField="disability_id"
                            labelField="disability"
                            user_id={user_id}
                        />

                        {/* Home status Options */}
                        <FilterSection
                            title="Thuis status"
                            table="home_status"
                            data={filter_data.home_statuses}
                            keyField="home_status_id"
                            labelField="home_status"
                            user_id={user_id}
                        />

                        {/* Religion Options */}
                        <FilterSection
                            title="Religie"
                            table="religion"
                            data={filter_data.religions}
                            keyField="religion_id"
                            labelField="religion"
                            user_id={user_id}
                        />

                        {/* Age Slider */}
                        <CustomSlider
                            label="Zoek leeftijd"
                            minValue={18}
                            maxValue={99}
                            defaultValue={[18, 20]}
                            user_id={user_id}
                        />
                        {/* Distance Slider */}
                        <div className="mb-4">
                            <SliderSettings label="Afstand tot anderen"
                                            unit="km"
                                            min={5}
                                            max={30}
                                            defaultValue={filter_data.distance || 15}
                                            userId={user_id}
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
                    userId={user_id}
                    initialImageUrl={"mock-picture.webp"}
                    initialShowPopup={showProfilePopup}
                />
            )}
        </div>
    );
}
