"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path
import { getUserId } from "@components/UserDisplay";
import { useIsMobile } from "@components/mediaQuery";
import { Spinner } from "flowbite-react"; // Import Flowbite Spinner

const Discover: React.FC = () => {
    const [chats, setChats] = useState<{ id: number; title: string; image_url: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredChats, setFilteredChats] = useState<{ id: number; title: string; image_url: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Loader state
    const [currentPage, setCurrentPage] = useState(1);
    const chatsPerPage = 6; // Number of chats per page
    const isMobile = useIsMobile();
    const supabase = createClient();
    const userId = getUserId();

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true); // Start loading
            try {
                const { data, error } = await supabase
                    .from("discover_chats")
                    .select("id, title, image_url");

                if (error) throw error;

                setChats(data); // Store all chats
                setFilteredChats(data); // Initialize filtered chats with all chats
            } catch (err) {
                setError("An error occurred while fetching chats.");
                console.error(err);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchChats();
    }, []);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            // Filter chats based on search query
            const filtered = chats.filter((chat) =>
                chat.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredChats(filtered); // Update filtered chats when search query exists
            setCurrentPage(1); // Reset to the first page after search
        } else {
            setFilteredChats(chats); // Reset to original chats if search is cleared
        }
    };

    const handleNextPage = () => {
        if (currentPage * chatsPerPage < filteredChats.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleChatClick = async (chatId: number) => {
        try {
            const { data, error } = await supabase
                .from("groupchat_users")
                .select("id")
                .eq("group_id", chatId)
                .eq("user_id", userId);

            if (error) throw error;

            if (data.length === 0) {
                const { error: insertError } = await supabase
                    .from("groupchat_users")
                    .insert({
                        group_id: chatId,
                        user_id: userId,
                    });

                if (insertError) throw insertError;
            }

            window.location.href = `/group-messaging?chatId=${chatId}`;
        } catch (err) {
            console.error("Error adding user to group:", err);
        }
    };

    // Calculate the chats to display for the current page
    const indexOfLastChat = currentPage * chatsPerPage;
    const indexOfFirstChat = indexOfLastChat - chatsPerPage;
    const currentChats = filteredChats.slice(indexOfFirstChat, indexOfLastChat);

    return (
        <div className="flex flex-1 container mx-auto py-4 px-4 bg-white">
            <div
                className="bg-gradient-to-b from-[#FFAB9F] to-[#FFDFDB] text-xl text-white p-4 rounded-xl shadow-md w-full min-h-[400px]">
                <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-center">
                    Add a new group? 🔍
                </h1>

                {/* Search bar */}
                <div className="flex flex-col items-center mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch} // Trigger search immediately as the user types
                        className="p-3 rounded-lg w-full sm:w-2/3 border border-gray-300 text-black"
                        placeholder="Search chats"
                    />
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center my-6">
                        <Spinner size="xl" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400"
                            >
                                ⬅️
                            </button>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                                {currentChats && currentChats.length > 0 ? (
                                    currentChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            className="bg-white p-4 rounded-lg text-center hover:bg-rose-400 hover:scale-105 focus:outline-none"
                                            onClick={() => handleChatClick(chat.id)}
                                        >
                                            {chat.image_url ? (
                                                <img
                                                    src={chat.image_url}
                                                    alt={chat.title}
                                                    className="w-full h-[150px] sm:h-[200px] object-cover rounded-md mb-2"
                                                />
                                            ) : (
                                                <div className="w-full h-[150px] sm:h-[200px] bg-gray-300 rounded-md mb-2"></div>
                                            )}
                                            <p className="text-sm text-black">{chat.title}</p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-2 sm:col-span-3 text-center">
                                        No chats found.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={filteredChats && indexOfLastChat >= filteredChats.length}
                                className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400"
                            >
                                ➡️
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Discover;
