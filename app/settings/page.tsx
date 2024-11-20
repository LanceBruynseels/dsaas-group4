// page.tsx (Server-side rendering)
import { fetchProfileData } from "@/app/actions/settings/action";
import { SubmitButton } from "@/components/submit-button";
import Slider from "@/components/settings/slider";
import ProfilePicture from "@/components/settings/profilePicture";
import InputFieldsSection from "@/components/InputFieldSection";
import Link from "next/link";
import ProfileFilters from "@/components/settings/profileFilters";
import ProfileDOB from "@/components/settings/profileDOB";

export const revalidate = 0; // Optional: to specify caching strategy for revalidation

const SettingsPage = async () => {
    let profileData;
    let filterData;
    let profilePicture;
    const userId = 'abb0c0af-904c-4c52-b19b-5be0fc3da588';

    try {
        // Fetch profile and filter data server-side
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
            {/* Sidebar */}
            <div className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Instellingen</h2>
                    <SubmitButton
                        className="px-6 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                    >
                        Log uit
                    </SubmitButton>
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
                {/* Top Section: Profile Picture, DOB, Name */}
                <div className="rounded-lg mb-6 p-4" style={{backgroundColor: "#FFDFDB"}}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-[#771D1D] font-serif">
                        Mijn persoonlijke gegevens</h2>
                    <div className="flex flex-col justify-center items-center mb-6">
                        <ProfilePicture imageUrl={profilePicture.profile_picture_url || "/mock-picture.webp"}
                                        userId={userId}/>
                    </div>

                    <ProfileDOB userId={userId} dob={profileData.dob}/>

                    <InputFieldsSection
                        fields={[
                            {label: "Mijn voornaam", type: "text", value: profileData.first_name || ""},
                            {label: "Mijn achternaam", type: "text", value: profileData.last_name || ""},
                        ]}
                    />
                </div>

                {/* Bottom Section: Filters and Sliders */}
                <div className="rounded-lg p-4" style={{backgroundColor: "#FFDFDB"}}>
                    <h2 className="text-3xl font-bold text-center mb-6 text-[#771D1D] font-serif">
                        Dit moet je ook weten over mij...</h2>
                    <ProfileFilters filterData={filterData} profileData={profileData}/>

                    {/* Sliders */}
                    <div className="flex flex-col w-full mt-4 mb-6">
                        <div className="flex flex-col w-full mt-6 justify-center items-center px-20 ">
                            <Slider label="Afstand tot anderen" unit="km" min={5} max={30}
                                    defaultValue={profileData.distance || 15} sliderColor="#771D1D"/>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-2 py-5 flex justify-center">
                        <SubmitButton
                            className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                            style={{backgroundColor: "#771D1D"}}
                            pendingText="Vernieuw profiel..."
                        >
                            Update profiel
                        </SubmitButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
