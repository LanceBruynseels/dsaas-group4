import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProtectedPage() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex flex-row w-full">
            {/* Notifications Side Panel */}
            <div
                className="flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <div className="flex flex-row justify-between items-center">
                    <div className="text-2xl font-bold">Meldingen</div>
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
            <div className="flex flex-row basis-1/2 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F] p-4 m-4 rounded-lg">
                {/* Profile Section */}
                <div className="flex flex-col min-h-full p-4">
                    {/* Updated layout for Profile Image and Profile Details */}
                    <div
                        className="flex flex-row items-stretch">

                        {/* Profile Image Section, takes 50% width */}
                        <div className="flex basis-1/2 items-center justify-center p-4 border-r">
                            <button className="left-2 text-black">❮</button>
                            <Image src="/profileImage.png" alt="Profile Picture" width={300} height={300}
                                   className="rounded-lg object-cover"/>
                            <button className="right-2 text-black">❯</button>
                        </div>

                        {/* Profile Details Section, takes 50% width */}
                        <div
                            className="flex basis-1/2 flex-col items-center justify-center p-8 bg-gradient-to-b from-red-700 to-pink-950 text-white rounded-lg">
                            <h2 className="text-2xl font-bold">Jara, 25 jaar</h2>
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

            {/* Settings Section */}
            <div className="basis-1/4 p-4 bg-pink-100 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                <h3 className="text-lg font-bold">Zoek instellingen</h3>
                {/* Settings fields */}
                <div className="flex flex-col mt-4">
                    <label className="text-sm">Persoonlijkheid:</label>
                    <div className="flex flex-wrap gap-2">
                        {["Leider", "Zorgzaam", "Avonturier", "Denker"].map((trait, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-md shadow">{trait}</span>
                        ))}
                    </div>
                    <label className="text-sm mt-4">Religie:</label>
                    <div className="flex flex-wrap gap-2">
                        {["Niet gelovig", "Christen", "Moslim"].map((religion, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-md shadow">{religion}</span>
                        ))}
                    </div>
                    <label className="text-sm mt-4">Afstand:</label>
                    <input type="range" className="mt-1"/>
                    <label className="text-sm mt-4">Leeftijd:</label>
                    <input type="range" className="mt-1"/>
                </div>
            </div>
        </div>
    );
}
