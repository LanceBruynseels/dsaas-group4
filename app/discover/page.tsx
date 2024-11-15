"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path

const Discover: React.FC = () => {
    const [imageUrls, setImageUrls] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            const supabase = createClient();
            try {
                // Fetch the image URLs for chatimage1.jpg to chatimage6.jpg
                const urls = await Promise.all(
                    Array.from({ length: 6 }).map((_, index) => {
                        const fileName = `chatimage${index + 1}.jpg`;
                        const { data: imageData } = supabase.storage
                            .from("chat-images") // Assuming 'chat-images' is your bucket
                            .getPublicUrl(fileName);

                        return imageData?.publicUrl || ""; // return the public URL if it exists
                    })
                );

                setImageUrls(urls); // Store all image URLs in the state
            } catch {
                setError("Er is een fout opgetreden.");
            }
        };

        fetchImages();
    }, []);

    return (
        <div className="flex flex-1 container mx-auto py-2 px-1 bg-white">
            <div className="bg-[#FCA5A5] text-white p-4 rounded-xl shadow-md col-span-3 w-1/4">
                <h2 className="text-xl font-bold mb-4">Notifications</h2>
                <p className="text-sm">Notifications</p>
            </div>

            <div className="bg-[#771D1D] text-white p-4 rounded-xl shadow-md col-span-9 w-3/4 ml-6 min-h-[400px]">
                <h2 className="text-xl font-bold mb-4">Discover</h2>
                <p className="text-sm mb-4">Group chats</p>

                {/* Group chat image sections */}
                <div className="grid grid-cols-3 gap-4 ">
                    {imageUrls ? (
                        imageUrls.map((imageUrl, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg text-center hover:bg-rose-400">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl} // Use the specific image URL for each index
                                        alt={`Chat ${index + 1}`}
                                        className="w-full h-[200px] object-cover rounded-md mb-2"
                                    />
                                ) : (
                                    <div className="w-full h-[200px] bg-gray-300 rounded-md mb-2"></div>
                                )}
                                <p className="text-sm text-black">Chat {index + 1}</p>
                            </div>
                        ))
                    ) : (
                        <div>Loading images...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
