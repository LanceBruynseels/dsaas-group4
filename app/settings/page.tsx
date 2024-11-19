// page.tsx (Server-side rendering)
import { fetchProfileData } from "app/actions/settings/action";
import { SubmitButton } from "@/components/submit-button";
import Slider from "@components/settings/slider";
import ProfilePicture from "@components/settings/profilePicture";  // This will now be used with the URL data
import InputFieldsSection from "@/components/InputFieldSection";
import Link from "next/link";
import ProfileFilters from "@components/settings/profileFilters";
import {SubmitProfileButton} from "@components/settings/submitProfileButton";

export const revalidate = 0;  // Optional: to specify caching strategy for revalidation

const SettingsPage = async () => {
    let profileData, filterData, profilePicture;
    const userId = "abb0c0af-904c-4c52-b19b-5be0fc3da588";

    try {
        const data = await fetchProfileData();
        profileData = data.profile;
        filterData = data.filters;
        profilePicture = data.picture;
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return (
            <div className="text-red-500">
                Er is een probleem opgetreden bij het laden van de instellingen.
            </div>
        );
    }

    return (
        <div className="flex">
            {/* Main Content */}
            <div className="flex flex-col basis-3/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] flex-grow">
                {/* Profile Picture Section */}
                <div className="flex flex-col justify-center items-center mb-6">
                    <ProfilePicture imageUrl={profilePicture.profile_picture_url || "/profileImage.png"} userId={userId} />
                </div>

                {/* Input Fields Section */}
                <InputFieldsSection
                    fields={[
                        { label: "Mijn voornaam", type: "text", value: profileData.firstName || "" },
                        { label: "Mijn achternaam", type: "text", value: profileData.lastName || "" },
                    ]}
                />

                {/* Filter Sections */}
                <ProfileFilters filterData={filterData} profileData={profileData} />

                {/* Sliders */}
                <div className="flex justify-between gap-4 mt-4 mb-6">
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Afstand" unit="km" min={5} max={30} defaultValue={profileData.distance || 15} sliderColor="#771D1D" />
                    </div>
                    <div className="flex-1 px-20 w-1/2">
                        <Slider label="Leeftijd" unit="jaar" min={18} max={60} defaultValue={profileData.age || 24} sliderColor="#771D1D" />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-2 py-5 flex justify-center">
                    <SubmitProfileButton
                        profileData={{
                            firstName: profileData.firstName || "",
                            lastName: profileData.lastName || "",
                            distance: profileData.distance || 15,
                            age: profileData.age || 24,
                        }}
                        filterData={filterData}
                        userId={userId}
                        onProfileUpdate={() => console.log("Profile updated successfully!")}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

