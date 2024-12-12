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
import NotificationsPanel from "@components/notificationsPanel";
import SearchSettings from "@components/searchSettings";
import {UserPopup} from "@components/userPopup";

interface sliderAgeInterface{
    min_age: number,
    max_age: number,
}

export default async function HomePage() {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }

    const userId = session.user.id;

    // Fetch user profile to check if it's created
    const [profileData, filterData, notifications_data, sliderAgeRangeData] = await Promise.all([
        supabase.from("profile").select("*").eq("user_id", userId).single(),
        supabase.rpc('get_all_filter_data'),
        supabase.rpc('get_user_notifications', { notifications_user_id: userId }),
        supabase.from("search_age_range").select("min_age, max_age").eq("user_id", userId).single()
    ]);

    const sliderAgeRange: sliderAgeInterface = sliderAgeRangeData.data || { min_age: 18, max_age: 99 };

    if(!sliderAgeRangeData.data){
        //console.log("i get here")
         await supabase.from("search_age_range").insert([
            {
                user_id: userId,
                min_age: 18,
                max_age: 99,
            },
        ])
        .select()
        .single();
    }

    const showProfilePopup = !profileData.data; // Show popup if no profile found

    return (
        <div className="flex flex-row w-full justify-center text-gray-900">
            {/* Notifications Side Panel */}
            <NotificationsPanel notifications_data={notifications_data}></NotificationsPanel>

            {/* middle section with matching and liking*/}
            <div
                className="flex flex-col w-full bg-gradient-to-b shadow-md from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg justify-center align-middle items-center">
                <MatchingCard userId={userId}/>

            </div>

            {/* Search Settings Section */}
            <SearchSettings filterData={filterData} userId={userId} sliderAgeRange={sliderAgeRange}></SearchSettings>

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
