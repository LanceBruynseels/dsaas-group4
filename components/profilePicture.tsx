// ProfilePicture.tsx
'use client';

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ProfilePictureProps = {
    imageUrl: string;  // URL passed from the server
    userId: 'abb0c0af-904c-4c52-b19b-5be0fc3da588';    // User's ID to update their profile in the database
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, userId }) => {
    const [isUploading, setIsUploading] = useState(false);  // To track upload progress
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for failed uploads

    // Handle file upload
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage(null); // Reset any previous error messages

        try {
            // Upload file to Supabase storage bucket 'profilePictures'
            const { data, error } = await createClient()
                .storage.from('profilePictures')
                .upload(`profile-pics/${userId}/${file.name}`, file);

            if (error) {
                console.error('Error uploading file:', error.message);
                throw error; // Handle upload error
            }

            // Construct the public URL for the uploaded image
            const publicUrl = `https://legfcpyiwzvfhacgnpkw.supabase.co/storage/v1/object/public/profilePictures/profile-pics/${userId}/${file.name}`;

            console.log("Uploaded file public URL:", publicUrl);

            // Save the profile picture URL in the database by calling the POST endpoint
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    pictureUrl: publicUrl,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error("Error updating profile picture in the database:", result.error);
                throw new Error(result.error || 'Failed to update profile picture in database.');
            }

            // Clear error message and indicate success
            setErrorMessage(null);  // Clear any error messages on success
            console.log("Profile picture updated successfully.");
        } catch (error: any) {
            console.error("Error:", error.message);
            setErrorMessage("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false); // Hide the uploading state
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
