import FetchDataSteps from "@components/tutorial/fetch-data-steps";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
    const supabase = await createClient();

    let { data: filter_data, error } = await supabase.rpc('get_all_filter_data')

    if (error) {
        console.error("Error fetching data:", error.message);
        return <p>Error loading data</p>;
    }

    return (
        <div className="flex flex-row w-full">
            {/* Search Settings Section */}
            <div className="basis-1/4 p-4 bg-pink-100 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <h2 className="text-xl font-bold mb-4 text-red-950">Zoek Instellingen</h2>

                {/* Personality Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Persoonlijkheid</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.personalities && filter_data.personalities.length > 0 ? (
                            filter_data.personalities.map((personalities) => (
                                <button key={personalities.personality_id}
                                        className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {personalities.personality}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Relationship goals Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Relatiedoel</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.relationship_goals && filter_data.relationship_goals.length > 0 ? (
                            filter_data.relationship_goals.map((goals) => (
                                <button key={goals.relationship_goals_id}
                                        className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {goals.relationship_goals}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Gender Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Gender</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.genders && filter_data.genders.length > 0 ? (
                            filter_data.genders.map((gender) => (
                                <button key={gender.gender_id} className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {gender.gender}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Interests Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Interesses</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.interests && filter_data.interests.length > 0 ? (
                            filter_data.interests.map((item_interests) => (
                                <button key={item_interests.id} className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {item_interests.interest}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Disability Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Beperking</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.disabilities && filter_data.disabilities.length > 0 ? (
                            filter_data.disabilities.map((disabilities) => (
                                <button key={disabilities.disability_id}
                                        className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {disabilities.disability}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Home status Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Thuis status</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.home_statuses && filter_data.home_statuses.length > 0 ? (
                            filter_data.home_statuses.map((home_statuses) => (
                                <button key={home_statuses.home_status_id}
                                        className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {home_statuses.home_status}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Religion Options */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Religie</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filter_data.religions && filter_data.religions.length > 0 ? (
                            filter_data.religions.map((religions) => (
                                <button key={religions.religion_id}
                                        className="bg-gray-200 text-black px-2 py-1 rounded-lg">
                                    {religions.religion}
                                </button>
                            ))
                        ) : (
                            <p>No interests</p>
                        )}
                    </div>
                </div>

                {/* Distance Slider */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Afstand</h3>
                    <input type="range" min="5" max="30" defaultValue="5" className="w-full mt-2"/>
                    <div className="flex justify-between text-sm mt-1">
                        <span>5 km</span>
                        <span>30 km</span>
                    </div>
                </div>

                {/* Age Slider */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Leeftijd</h3>
                    <input type="range" min="24" max="30" defaultValue="24" className="w-full mt-2"/>
                    <div className="flex justify-between text-sm mt-1">
                        <span>18</span>
                        <span>30</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-row basis-1/2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg">
                {/* Profile Section */}
                <div className="flex flex-col min-h-full p-4">
                    {/* Updated layout for Profile Image and Profile Details */}
                    <div className="flex flex-row items-stretch">

                        {/* Profile Image Section */}
                        <div className="flex basis-1/2 items-center justify-center p-4 border-r">
                            <button className="left-2 text-black">❮</button>
                            <Image src="/profileImage.png" alt="Profile Picture" width={300} height={300}
                                   className="rounded-lg object-cover"/>
                            <button className="right-2 text-black">❯</button>
                        </div>

                        {/* Profile Details Section */}
                        <div
                            className="flex basis-1/2 flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-pink-950 text-white rounded-lg">
                            <h2 className="text-2xl font-bold text-white">Jara, 25 jaar</h2>
                            <p className="mt-2 text-center">Meer informatie over Jara. Hobbies, interesses, relatie
                                status, wat ze hoopt te vinden op de applicatie, hoe ze zichzelf voelt op dit
                                moment.</p>
                            <div className="mt-4 text-4xl">😍</div>
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex justify-around w-full mt-4">
                        <button className="text-3xl text-gray-500">👎</button>
                        <button className="text-3xl text-blue-500">👍</button>
                        <button className="text-3xl text-red-500">❤️</button>
                        <button className="text-3xl text-green-500">💬</button>
                    </div>
                </div>
            </div>

            {/* Notifications Side Panel */}
            <div
                className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="font-bold">Meldingen</h2>
                    <div>
                        <Image src="/bell.png" alt="Bell Icon" height={25} width={25}/>
                    </div>
                </div>
                <div className="flex flex-col my-2">
                    {/* Sample Notifications */}
                    {["You got a message from ...", "You got a message from ..."].map((text, idx) => (
                        <div key={idx} className="flex flex-row my-2 items-center">
                            <Image src="/mock-picture.webp" alt="Profile Picture" width={50} height={50}
                                   className="rounded-full border border-gray-500"/>
                            <div className="text-xs mx-2">{text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
