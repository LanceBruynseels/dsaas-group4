"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path

const Discover: React.FC = () => {
    const [chats, setChats] = useState<{ id: number; title: string; image_url: string }[] | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredChats, setFilteredChats] = useState<{ id: number; title: string; image_url: string }[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            const supabase = createClient();
            try {
                // Fetch titles and image URLs from your 'chats' table
                const { data, error } = await supabase
                    .from("discover_chats")
                    .select("id, title, image_url");

                if (error) throw error;

                setChats(data); // Store the chat data (titles + image URLs)
                setFilteredChats(data); // Initially, show all chats
            } catch (err) {
                setError("Er is een fout opgetreden.");
                console.error(err);
            }
        };

        fetchChats();
    }, []);

    const handleSearch = () => {
        if (searchQuery) {
            const filtered = chats?.filter((chat) =>
                chat.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredChats(filtered); // Update filtered chats
        } else {
            setFilteredChats(chats); // If no search query, show all chats
        }
    };

    return (
        <div className="flex flex-1 container mx-auto py-2 px-2 bg-white">

            <div className="bg-[#771D1D] text-white p-4 rounded-xl shadow-md w-full min-h-[400px]">
                <h2 className="text-xl font-bold mb-4">Discover</h2>
                <p className="text-sm mb-4">Group chats</p>

                {/* Search bar and button */}
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 rounded-l-lg w-1/3 border border-gray-300 text-black"
                        placeholder="Search chats"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-rose-400 text-white p-2 rounded-r-lg ml-2 hover:bg-blue-400"
                    >
                        Search
                    </button>
                </div>

                {/* Group chat image sections */}
                <div className="grid grid-cols-3 gap-4">
                    {filteredChats ? (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id} // Using chat.id for the key
                                className="bg-white p-4 rounded-lg text-center hover:bg-rose-400"
                            >
                                {chat.image_url ? (
                                    <img
                                        src={chat.image_url} // Use the specific image URL for each chat
                                        alt={chat.title}
                                        className="w-full h-[200px] object-cover rounded-md mb-2"
                                    />
                                ) : (
                                    <div className="w-full h-[200px] bg-gray-300 rounded-md mb-2"></div>
                                )}
                                <p className="text-sm text-black">{chat.title}</p> {/* Display the title */}
                            </div>
                        ))
                    ) : (
                        <div>Loading chats...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
