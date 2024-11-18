'use client'
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ProfilePictureProps = {
    imageUrl: string | null; // The URL of the profile picture, can be null if not available
    userId: string; // The user ID to save the profile picture URL
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, userId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Handle file change and upload logic
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage(null); // Reset error message

        try {
            const { error: uploadError } = await createClient()
                .from('profile')
                .update({profile_pictureURL: imageUrl})
                .eq('user_id', userId);

            if (uploadError) throw uploadError;

            // Successfully uploaded and saved the new URL
            setIsUploading(false);
        } catch (error: any) {
            console.error("Error uploading image:", error.message);
            setErrorMessage("Failed to upload image. Please try again.");
            setIsUploading(false);
        }
    };

    return (
        <div className="relative">
            {/* Display the profile picture */}
            <img
                src={imageUrl || "/profileImage.png"} // Fallback to a default image if no URL
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover" // You can adjust the size as needed
            />

            {/* Upload icon */}
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-7.036a1.5 1.5 0 00-2.121 0L3 14.707V21h6.293l10.121-10.121a1.5 1.5 0 000-2.121L15.232 1.196z"
                    />
                </svg>
                {/* File input (hidden) */}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>

            {/* Show loading or error messages */}
            {isUploading && <p className="absolute text-xs text-gray-500 mt-2">Uploading...</p>}
            {errorMessage && <p className="absolute text-xs text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
};

export default ProfilePicture;
