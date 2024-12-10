import React from "react";
import Slider from "@components/settings/slider";
import ProfilePicture from "@components/settings/profilePicture";
import ProfileFiltersSection from "@components/settings/profileFiltersSection";
import ProfileDOB from "@components/settings/profileDOB";
import AddPictures from "@components/settings/addPictures";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
    const supabase = await createClient();

    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/sign-in");
    }
    const user_id = session.user.id;

    const { data: filter_data, error: filterError } = await supabase.rpc("get_all_filter_data");
    const { data: profile_data, error: profileError } = await supabase.rpc("get_all_profile_data", { userid: user_id });
    const { data: picture, error: pictureError } = await supabase.rpc("get_profile_picture", { userid: user_id });

    if (filterError || profileError || pictureError) {
        console.error("Error fetching data:", filterError || profileError || pictureError);
        return <p>Error loading profile data</p>;
    }

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                {/* Sidebar (visible on desktop, hidden on mobile) */}
                <div className="hidden md:block col-span-1 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Instellingen</h2>
                    <ul className="space-y-4">
                        <li className="text-base font-semibold text-[#771D1D]">
                            <Link href="/settings">Profiel</Link>
                        </li>
                        <li className="text-base text-gray-500">
                            <Link href="/settings/language">Taal Instellingen</Link>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="col-span-1 md:col-span-3 p-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] rounded-lg">
                    {/* Mobile Floating Menu */}
                    <div className="block md:hidden fixed top-4 left-4 z-50">
                        <div className="group relative">
                            <button
                                className="text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                style={{ backgroundColor: "hsl(10, 100%, 90%)" }}
                            >
                                ☰
                            </button>
                            <div className="absolute hidden group-hover:block mt-2 w-48 bg-white shadow-lg rounded-md">
                                <div className="py-2">
                                    <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Profiel
                                    </Link>
                                    <Link href="/settings/language" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Taal Instellingen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="mb-6 p-4 bg-[#FFDFDB] rounded-lg">
                        <div className="text-center mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#771D1D]">
                                {profile_data.first_name} {profile_data.last_name}
                            </h2>
                            <ProfilePicture
                                imageUrl={picture.profile_picture_url || "/mock-picture.webp"}
                                userId={user_id}
                            />
                        </div>
                        <ProfileDOB userId={user_id} dob={profile_data.dob} />
                    </div>

                    {/* Add More Pictures Section */}
                    <div className="mb-6 p-4 bg-[#FFDFDB] rounded-lg">
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#771D1D] mb-4">
                            Voeg meer foto's toe
                        </h2>
                        <AddPictures maxPictures={3} userId={user_id} />
                        <p className="text-sm text-center text-gray-600 mt-4">
                            Voeg tot 3 extra foto's toe aan je profiel
                        </p>
                    </div>

                    {/* Filters and Personality Section */}
                    <div className="p-4 bg-[#FFDFDB] rounded-lg">
                        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#771D1D] mb-4">
                            Dit moet je ook weten over mij...
                        </h2>
                        <div className="space-y-4">
                            <ProfileFiltersSection
                                title="Persoonlijkheid"
                                table="personality"
                                data={filter_data.personalities}
                                keyField="personality_id"
                                labelField="personality"
                                user_id={user_id}
                            />
                            <ProfileFiltersSection
                                title="Relatiedoel"
                                table="relationship_goal"
                                data={filter_data.relationship_goals}
                                keyField="relationship_goals_id"
                                labelField="relationship_goals"
                                user_id={user_id}
                            />
                            <ProfileFiltersSection
                                title="Gender"
                                table="gender"
                                data={filter_data.genders}
                                keyField="gender_id"
                                labelField="gender"
                                user_id={user_id}
                            />
                            {/* Add other sections as needed */}
                        </div>
                        <Slider
                            label="Afstand tot anderen"
                            unit="km"
                            min={5}
                            max={30}
                            defaultValue={profile_data.distance || 15}
                            userId={user_id}
                            sliderColor="#771D1D"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
