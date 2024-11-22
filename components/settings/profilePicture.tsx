'use client'
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type ProfilePictureProps = {
    imageUrl: string; // URL passed from the server
    userId: string;   // User's ID to update their profile in the database
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUrl, userId }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setCurrentImageUrl(imageUrl);
    }, [imageUrl]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage(null);

        try {
            const supabase = createClient();
            const { data, error } = await supabase.storage
                .from("profilePictures")
                .upload(`profile-pics/${userId}/${file.name}`, file, { upsert: true });

            if (error) {
                console.error("Error uploading file to Supabase storage:", error.message);
                throw error;
            }

            const publicUrl = `https://legfcpyiwzvfhacgnpkw.supabase.co/storage/v1/object/public/profilePictures/profile-pics/${userId}/${file.name}`;

            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    picture_url: publicUrl,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                console.error("Error updating profile picture in the database:", result.error);
                throw new Error(result.error || "Failed to update profile picture.");
            }

            setCurrentImageUrl(publicUrl);
            console.log("Profile picture updated successfully.");
        } catch (error: any) {
            console.error("Error during upload:", error.message);
            setErrorMessage("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative">
            <img
                src={currentImageUrl || "/mock-picture.webp"}
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover"
            />
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
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
            </div>
            {isUploading && <p className="absolute text-xs text-gray-500 mt-2">Uploading...</p>}
        </div>
    );
};

export default ProfilePicture;
