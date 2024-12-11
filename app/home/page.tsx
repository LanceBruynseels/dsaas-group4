import Image from "next/image";
import { createClient } from '@/utils/supabase/server';
import FilterSection from '@components/filterselection';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { redirect } from "next/navigation";
import ProfilePopup from '@components/profilePopUp';
import React, {Suspense} from "react";
import SliderSettings from "@components/settings/sliderSettings";
import CustomSlider from "@components/customSlider";
import Loading from "@components/loading";
import MatchingCard from "@components/matchingCard";
import {MatchingUser} from "@components/matchingCard";
import Sidebar from "@components/sideBar";
import SearchSettings from "@components/searchSettings";
import {UserPopup} from "@components/userPopup";


export default async function HomePage() {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }

    const userId = session.user.id;
    // Fetch user profile to check if it's created

    const [profileData, filterData, notifications_data, sliderAgeRange] = await Promise.all([
        supabase.from("profile").select("*").eq("user_id", userId).single(),
        //supabase.rpc('find_potential_matches', { request_user_id: userId }),
        supabase.rpc('get_all_filter_data'),
        supabase.rpc('get_user_notifications', { notifications_user_id: userId }),
        supabase.from("search_age_range").select("min_age, max_age").eq("user_id", userId).single()
    ]);

    // // Handle errors more gracefully
    // if (profileData.error || initialMatchData.error || filterData.error || notifications_data.error) {
    //     console.error("Error fetching data:", profileData.error || initialMatchData.error || filterData.error || notifications_data.error);
    //     return <p>Error loading data</p>;
    // }
    //
    // //console.log(initialMatchData);
    //
    // let allMatchData: MatchingUser[];
    //
    // if (initialMatchData.data && initialMatchData.data.length > 0) {
    //     // Use Promise.all to wait for all asynchronous operations
    //      allMatchData = await Promise.all(
    //         initialMatchData.data.map(async (match) => {
    //             const { data: fileList, error: listError } = await supabase
    //                 .storage
    //                 .from('picturesExtra') // The storage bucket name
    //                 .list(match.user_id);
    //
    //             if (listError) {
    //                 console.error(`Error listing files for user_id ${match.user_id}:`, listError);
    //                 return { ...match, publicUrls: [] }; // Default to empty array on error
    //             }
    //
    //             // Generate public URLs for each file
    //             const publicUrls = fileList.map((file) =>
    //                 supabase.storage.from('picturesExtra').getPublicUrl(`${match.user_id}/${file.name}`).data.publicUrl
    //             );
    //
    //             // Return the enriched match object
    //             return { ...match, publicUrls };
    //         })
    //     );
    // }

    const showProfilePopup = !profileData; // Show popup if no profile found

    return (
        <div className="flex flex-row w-full justify-center text-red-950">
            {/* Notifications Side Panel */}
            <Sidebar notifications_data={notifications_data}></Sidebar>

            {/* middle section with matching and liking*/}
            <div
                className="flex flex-col w-full bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg justify-center align-middle items-center">
                <MatchingCard userId={userId}/>

            </div>

            {/* Search Settings Section */}
            <SearchSettings filterData={filterData} userId={userId} sliderAgeRange={sliderAgeRange.data}></SearchSettings>

            {/* Pop-up screen for first login */}
            {showProfilePopup && (
                <ProfilePopup
                    userId={userId}
                    initialImageUrl={"/mock-picture.webp"}
                    initialShowPopup={showProfilePopup}
                />
            )}
        </div>
    );
}
