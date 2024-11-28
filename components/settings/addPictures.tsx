'use client';

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image"; // Assuming this initializes the Supabase client

interface AddPicturesProps {
    maxPictures?: number;
    onPicturesChange?: (pictures: string[]) => void;
    userId: string;
}

const AddPictures: React.FC<AddPicturesProps> = ({ maxPictures = 3, onPicturesChange, userId }) => {
    const [pictures, setPictures] = useState<string[]>([]); // Picture URLs
    const supabase = createClient();

    // Fetch existing pictures for the user when the component loads
    useEffect(() => {
        const fetchPictures = async () => {
            try {
                const { data: files, error } = await supabase.storage
                    .from("picturesExtra")
                    .list(userId, { limit: 5 }); // List files for the given userId folder

                if (error) {
                    console.error("Error fetching pictures:", error);
                    return;
                }

                // Generate public URLs for the fetched files
                const pictureURLs = files?.map(file => {
                    const { data } = supabase.storage.from("picturesExtra").getPublicUrl(`${userId}/${file.name}`);
                    return data?.publicUrl || "";
                }).filter(Boolean); // Filter out any undefined URLs

                setPictures(pictureURLs);

                if (onPicturesChange) {
                    onPicturesChange(pictureURLs);
                }
            } catch (err) {
                console.error("Unexpected error fetching pictures:", err);
            }
        };

        fetchPictures();
    }, [supabase, userId, onPicturesChange]);

    // Add Picture
    const handleAddPicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const newFiles = Array.from(files).slice(0, maxPictures - pictures.length); // Limit uploads
            const newPictureURLs: string[] = [];

            for (const file of newFiles) {
                const fileName = `${Date.now()}-${file.name}`; // Unique filename
                const filePath = `${userId}/${fileName}`;

                // Upload file to Supabase
                const { error } = await supabase.storage.from("picturesExtra").upload(filePath, file);

                if (error) {
                    console.error("Error uploading file:", error);
                    continue; // Skip this file if there's an error
                }

                // Generate a public URL for the file
                const { data } = supabase.storage.from("picturesExtra").getPublicUrl(filePath);

                if (data?.publicUrl) {
                    newPictureURLs.push(data.publicUrl);
                }
            }

            const updatedPictures = [...pictures, ...newPictureURLs];
            setPictures(updatedPictures);
            if (onPicturesChange) {
                onPicturesChange(updatedPictures); // Notify parent component
            }
        }
    };

    const handleRemovePicture = async (index: number) => {
        // Case 1: Only one picture left, clear the entire bucket for this user
        if (pictures.length === 1) {
            try {
                // Fetch all files in the user's folder
                const { data: files, error: listError } = await supabase.storage
                    .from("picturesExtra")
                    .list(`${userId}`); // List all files in the user-specific folder

                if (listError) {
                    console.error("Error fetching files for deletion:", listError);
                    return;
                }

                const filePaths = files?.map(file => `${userId}/${file.name}`);
                const { error: removeError } = await supabase.storage.from("picturesExtra").remove(filePaths);

                if (removeError) {
                    console.error("Error removing files from storage:", removeError);
                    return;
                }

                console.log("All pictures deleted successfully.");
                setPictures([]);
                if (onPicturesChange) {
                    onPicturesChange([]);
                }
            } catch (err) {
                console.error("Unexpected error during file deletion:", err);
            }

        } else {
            // Case 2: More than one picture, just delete the specific picture
            const pictureToRemove = pictures[index];
            const relativePath = pictureToRemove.split('/').slice(-2).join('/'); // Extract file path

            if (!relativePath) {
                console.error("Error: Could not extract file path for deletion.");
                return;
            }

            console.log("Deleting picture with path:", relativePath);

            const updatedPictures = pictures.filter((_, i) => i !== index);
            setPictures(updatedPictures);
            if (onPicturesChange) {
                onPicturesChange(updatedPictures); // Notify parent component
            }

            try {
                const { error } = await supabase.storage.from("picturesExtra").remove([relativePath]);

                if (error) {
                    console.error("Error removing file from storage:", error);
                    return;
                }

                console.log("Picture successfully deleted from storage.");
            } catch (err) {
                console.error("Unexpected error during file deletion:", err);
            }
        }
    };



    return (
        <div className="flex flex-wrap justify-center gap-8">
            {pictures.map((picture, index) => (
                <div key={index} className="relative w-44 h-44">
                    <Image
                        src={picture}
                        alt={`Uploaded ${index + 1}`}
                        fill
                        className="w-full h-full object-cover rounded-md"
                    />
                    <button
                        onClick={() => handleRemovePicture(index)}
                        className="absolute top-1 right-1 bg-[#771D1D] text-white text-sm p-1 rounded-full hover:bg-[#FFAB9F]"
                        aria-label="Remove picture"
                    >
                        ×
                    </button>
                </div>
            ))}

            {/* Show "Add Picture" square if we haven't reached the max */}
            {pictures.length < maxPictures && (
                <label className="w-36 h-36 border-dashed border-2 border-gray-400 rounded-md flex
                items-center justify-center cursor-pointer hover:border-gray-600">
                    <span className="text-gray-400 text-2xl">+</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAddPicture}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
};

export default AddPictures;
