import Image from "next/image";
import { createClient } from '@/utils/supabase/server';
import FilterSection from '@components/filterselection';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { Notification_user } from "@components/notification";
import NotificationItem from '@components/notification';  // Import your NotificationItem component
import ProfilePopup from '@components/profilePopUp'; // Import the client component

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

    const { data: userProfile, error: userProfileError } = await supabase
        .from('users')
        .select('has_completed_initial_settings')
        .eq('id', user_id)
        .single();

    if (userProfileError) {
        console.error("Error fetching user profile:", userProfileError);
        return <p>Error loading profile</p>;
    }
    if (profileError && profileError.code !== 'PGRST116') { // Handle error only if it's not a "no data" error
        console.error("Error fetching profile:", profileError);
        return <p>Error loading profile</p>;
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
        <div className="flex flex-row w-full">
            {/* Search Settings Section */}
            <div className="basis-1/4 p-4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <h2 className="text-xl font-bold mb-4 text-red-950">Zoek Instellingen</h2>

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

                {/* Distance Slider */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Afstand</h3>
                    <input type="range" min="5" max="30" defaultValue="5" className="w-full mt-2" />
                    <div className="flex justify-between text-sm mt-1">
                        <span>5 km</span>
                        <span>30 km</span>
                    </div>
                </div>

                {/* Age Slider */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Leeftijd</h3>
                    <input type="range" min="24" max="30" defaultValue="24" className="w-full mt-2" />
                    <div className="flex justify-between text-sm mt-1">
                        <span>18</span>
                        <span>30</span>
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex flex-row basis-1/2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg">
                <div className="flex flex-col p-4 w-full h-full">
                    <div className="flex flex-row w-full max-h-[500px] h-full">
                        {/* Left Image Section */}
                        <div className="flex basis-1/2 justify-center border-r">
                            <button className="left-2 text-black">❮</button>
                            <div className="relative bg-[url('/profile-picture.jpeg')] bg-cover bg-center bg-no-repeat w-full h-full max-h-[500px] rounded-lg ">

                            </div>
                            <button className="right-2 text-black">❯</button>
                        </div>

                        {/* Right Info Section */}
                        <div className="flex basis-1/2 flex-col h-full max-h-[500px] p-8 bg-gradient-to-b from-red-700 to-pink-950 text-white rounded-lg">
                            <h2 className="text-2xl font-bold text-white">Jara, 25 jaar</h2>
                            <p className="mt-2">Meer informatie over Jara...
                            </p>
                            <div className="mt-4 text-4xl">😍</div>
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex justify-around w-full bg-red-50 mt-4 p-4 rounded-lg">
                        <button className="relative w-12 h-12 ">
                            <Image src={"/thumbs-down.png"} alt={"thumbs-down"} fill />
                        </button>

                        <button className="relative w-12 h-12 ">
                            <Image src={"/thumbs-up.png"} alt={"thumbs-up"} fill />
                        </button>

                        <button className="relative w-12 h-12 ">
                            <Image src={"/heart.png"} alt={"heart"} fill />️
                        </button>

                        <button className="relative w-12 h-12 ">
                            <Image src={"/message-circle.png"} alt={"message-circle"} fill />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications Side Panel */}
            <div className="flex flex-col basis-1/4 p-4 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="font-bold">Meldingen</h2>
                    <div>
                        <Image src="/bell.png" alt="Bell Icon" height={25} width={25} />
                    </div>
                </div>
                <div className="flex flex-col my-2">
                    {/* Render Notifications */}
                    {notification_data && notification_data.length > 0 ? (
                        notification_data.map((notification: Notification_user) => (
                            <NotificationItem key={notification.notification_id} notification={notification} />
                        ))
                    ) : (
                        <p>No new notifications.</p>
                    )}
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
