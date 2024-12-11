// page.tsx (Server-side rendering)
import ProfilePicture from "@components/settings/profilePicture";
import ProfileFiltersSection from "@components/settings/profileFiltersSection";
import ProfileDOB from "@components/settings/profileDOB";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import Link from "next/link";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import {redirect} from "next/navigation";
import AddPictures from "@components/settings/addPictures";
import SingleSelectFilter from "@components/settings/singleSelectFilter";

const SettingsPage = async () => {
    const supabase = await createClient();

    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }
    const user_id = session.user.id;

    const { data: filter_data, error: filterError } = await supabase.rpc('get_all_filter_data');
    const { data: profile_data, error: profileError } = await supabase.rpc('get_all_profile_data', { userid: user_id });
    const { data: picture, error: pictureError } = await supabase.rpc('get_profile_picture', { userid: user_id });

    if (filterError || profileError || pictureError) {
        console.error("Error fetching data:", filterError || profileError || pictureError);
        return <p>Error loading profile data</p>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Instellingen</h2>
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
            <div className="flex flex-col basis-3/4 p-4 m-2 flex-grow bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">

                {/* Profile Section */}
                <div className="rounded-lg mb-6 p-4" style={{ backgroundColor: "#FFDFDB" }}>
                    <div className="flex flex-col justify-center items-center mb-6">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#771D1D]">
                            {profile_data.first_name} {profile_data.last_name}
                        </h2>
                        <ProfilePicture imageUrl={picture.profile_picture_url || "/mock-picture.webp"} userId={user_id} />
                    </div>
                    <ProfileDOB userId={user_id} dob={profile_data.dob} />
                </div>

                {/* Add More Pictures Section */}
                <div className="rounded-lg mb-6 p-4" style={{ backgroundColor: "#FFDFDB" }}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-[#771D1D]">
                        Voeg meer foto's toe
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <AddPictures
                            maxPictures={3}
                            userId={user_id}
                        />
                    </div>
                    <p className="text-sm text-center text-gray-600 mt-4">
                        Voeg tot 3 extra foto's toe aan je profiel
                    </p>
                </div>

                {/* Personality and Filters Section */}
                <div className="rounded-lg p-4" style={{ backgroundColor: "#FFDFDB" }}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-[#771D1D] ">
                        Dit moet je ook weten over mij...
                    </h2>
                    <div className={`flex flex-col items-center justify-end transition-all w-full`}>
                    {/* Personality Options */}
                    <ProfileFiltersSection
                        title="Ik ben ..."
                        table="personality"
                        data={filter_data.personalities}
                        keyField="personality_id"
                        labelField="personality"
                        user_id={user_id}
                    />

                    {/* Relationship goals Options */}
                    <ProfileFiltersSection
                        title="Ik ben op zoek naar ..."
                        table="relationship_goals"
                        data={filter_data.relationship_goals}
                        keyField="relationship_goals_id"
                        labelField="relationship_goals"
                        user_id={user_id}
                    />

                    {/* Gender Options */}
                    <SingleSelectFilter
                        title="Mijn gender is ..."
                        table="gender"
                        data={filter_data.genders}
                        keyField="gender_id"
                        labelField="gender"
                        user_id={user_id}
                    />

                    {/* Interests Options */}
                    <ProfileFiltersSection
                        title="Mijn Interesses zijn ..."
                        table="interest"
                        data={filter_data.interests}
                        keyField="id"
                        labelField="interest"
                        user_id={user_id}
                    />

                    {/* Disability Options */}
                    <ProfileFiltersSection
                        title="Mijn bijzondere kenmerken zijn ..."
                        table="disability"
                        data={filter_data.disabilities}
                        keyField="disability_id"
                        labelField="disability"
                        user_id={user_id}
                    />

                    {/* Home status Options */}
                    <ProfileFiltersSection
                        title="Ik woon ..."
                        table="home_status"
                        data={filter_data.home_statuses}
                        keyField="home_status_id"
                        labelField="home_status"
                        user_id={user_id}
                    />

                    {/* Religion Options */}
                    <SingleSelectFilter
                        title="Mijn Religie is ..."
                        table="religion"
                        data={filter_data.religions}
                        keyField="religion_id"
                        labelField="religion"
                        user_id={user_id}
                    />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
