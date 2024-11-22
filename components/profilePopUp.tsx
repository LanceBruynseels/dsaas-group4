"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ProfilePicture from "@components/settings/profilePicture"; // Import the ProfilePicture component

export default function ProfilePopup({ userId, initialShowPopup, initialImageUrl }) {
    const [showPopup, setShowPopup] = useState(initialShowPopup);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const supabase = createClientComponentClient();
    const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl);

    useEffect(() => {
        const createEmptyProfile = async () => {
            const { data, error } = await supabase
                .from("profile")
                .upsert([{ user_id: userId, first_name: null, last_name: null, dob: null, profile_picture_url: "mock-picture.webp" }]);

            if (error) {
                console.error("Error creating empty profile row:", error);
            } else {
                console.log("Empty profile row created/updated:", data);
            }
        };
        createEmptyProfile();
    }, [userId, supabase]);

    const handleConfirmSettings = async () => {
        if (!firstName || !lastName) {
            alert("Vul je voornaam en achternaam in.");
            return;
        }

        const { data, error: insertError } = await supabase
            .from("profile")
            .upsert([{
                user_id: userId,
                first_name: firstName,
                last_name: lastName,
                dob: dateOfBirth || null,
                profile_picture_url: profileImageUrl || null
            }], { onConflict: 'user_id' });

        if (insertError) {
            console.error("Error inserting/updating profile data:", insertError);
        } else {
            console.log("Profile data inserted/updated:", data);
            setShowPopup(false);
        }
    };

    // const handleDoLater = () => {
    //     setShowPopup(false);
    // };

    if (!showPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#771D1D] p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-white text-2xl font-semibold mb-4">Vul hier je persoonlijke gegevens in</h2>
                <form>
                    {/* Profile Picture upload component */}
                    <label className="block text-white text-center">Upload hier een foto van jezelf:</label>
                    <div className="flex justify-center items-center mb-4">
                        <ProfilePicture
                            imageUrl={profileImageUrl}
                            userId={userId}
                        />
                    </div>
                    {/* First Name Input */}
                    <label className="block mb-4 text-white">
                        Voornaam (Verplicht):
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                            placeholder="Voornaam"
                            required
                        />
                    </label>

                    {/* Last Name Input */}
                    <label className="block text-white mb-4">
                        Achternaam (Verplicht):
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                            placeholder="Achternaam"
                            required
                        />
                    </label>

                    {/* Date of Birth Input */}
                    <label className="block text-white mb-4">
                        Geboortedatum (Optioneel):
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                        />
                    </label>
                </form>

                {/* Buttons */}
                <div className="flex justify-center items-center mt-6">
                {/*<button*/}
                {/*        onClick={handleDoLater}*/}
                {/*        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"*/}
                {/*    >*/}
                {/*        Later Doen*/}
                {/*</button>*/}
                    <button
                        onClick={handleConfirmSettings}
                        className="bg-[#FCA5A5] text-white px-4 py-2 rounded"
                    >
                        Bevestig
                    </button>
                </div>
            </div>
        </div>
    );
}
