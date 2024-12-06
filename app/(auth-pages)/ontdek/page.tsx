"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path
import {useIsMobile} from "@/components/mediaQuery";
const ontdek: React.FC = () => {
    const [chats, setChats] = useState<{ id: number; title: string; image_url: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredChats, setFilteredChats] = useState<{ id: number; title: string; image_url: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const chatsPerPage = 6; // Number of chats per page
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchChats = async () => {
            const supabase = createClient();
            try {
                const { data, error } = await supabase
                    .from("discover_chats")
                    .select("id, title, image_url");

                if (error) throw error;

                setChats(data);
                setFilteredChats(data);
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
            setFilteredChats(filtered); // Update the filtered chats
            setCurrentPage(1); // Reset to the first page after search
        } else {
            setFilteredChats(chats); // If no search query, show all chats
        }
        setSearchQuery(""); // Clear the search input after searching
    };

    const handleNextPage = () => {
        if (filteredChats && currentPage * chatsPerPage < filteredChats.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Calculate the chats to display for the current page
    const indexOfLastChat = currentPage * chatsPerPage;
    const indexOfFirstChat = indexOfLastChat - chatsPerPage;
    const currentChats = filteredChats?.slice(indexOfFirstChat, indexOfLastChat);

    return isMobile ?
        (// mobile version -------------------------------------------------
            <div className="flex flex-1 container mx-auto py-2 px-2 bg-white">
                <div className="bg-[#771D1D] text-xl text-white p-4 rounded-xl shadow-md w-full min-h-[400px]">
                    <h1 className=" font-bold text-3xl mb-4">Discover 🔍</h1>


                    {/* Search bar */}
                    <div className="flex justify-center items-center mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            className="p-2 rounded-l-lg w-1/2 border border-gray-300 text-black"
                            placeholder="Search chats"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-rose-400 text-white p-2 rounded-r-lg ml-2 hover:bg-blue-400 "
                        >
                            Search
                        </button>
                    </div>

                    {/* Navigation buttons and chat display */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400 mr-3"
                        >
                            ⬅️
                        </button>

                        <div className="grid grid-rows-6 gap-4 w-1/2">
                            {currentChats && currentChats.length > 0 ? (
                                currentChats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        className="bg-white p-4 rounded-lg text-center hover:bg-rose-400 hover:scale-105 focus:outline-none"
                                        onClick={() => (window.location.href = `/group-messaging-mobile?chatId=${chat.id}`)}                                >
                                        {chat.image_url ? (
                                            <img
                                                src={chat.image_url}
                                                alt={chat.title}
                                                className="w-full h-[200px] object-cover rounded-md mb-2"
                                            />
                                        ) : (
                                            <div className="w-full h-[200px] bg-gray-300 rounded-md mb-2"></div>
                                        )}
                                        <p className="text-sm text-black">{chat.title}</p>
                                    </button>
                                ))
                            ) : (
                                <div>Loading chats...</div>
                            )}
                        </div>


                        <button
                            onClick={handleNextPage}
                            disabled={filteredChats && indexOfLastChat >= filteredChats.length}
                            className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400 ml-3 "
                        >
                            ➡️
                        </button>
                    </div>
                </div>
            </div>
        ):
        ( // laptop version -------------------------------------------------
        <div className="flex flex-1 container mx-auto py-2 px-2 bg-white">
            <div className="bg-[#771D1D] text-xl text-white p-4 rounded-xl shadow-md w-full min-h-[400px]">
                <h1 className=" font-bold text-3xl mb-4">Discover 🔍</h1>
                <p className="text-sm mb-4 ">Group chats</p>

                {/* Search bar */}
                <div className="flex justify-center items-center mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        className="p-2 rounded-l-lg w-1/3 border border-gray-300 text-black"
                        placeholder="Search chats"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-rose-400 text-white p-2 rounded-r-lg ml-2 hover:bg-blue-400 "
                    >
                        Search
                    </button>
                </div>

                {/* Navigation buttons and chat display */}
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400 mr-3"
                    >
                        ⬅️
                    </button>

                    <div className="grid grid-cols-3 gap-4 w-full">
                        {currentChats && currentChats.length > 0 ? (
                            currentChats.map((chat) => (
                                <button
                                    key={chat.id}
                                    className="bg-white p-4 rounded-lg text-center hover:bg-rose-400 hover:scale-105 focus:outline-none"
                                    onClick={() => (window.location.href = `/group-messaging?chatId=${chat.id}`)}                                >
                                    {chat.image_url ? (
                                        <img
                                            src={chat.image_url}
                                            alt={chat.title}
                                            className="w-full h-[200px] object-cover rounded-md mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-[200px] bg-gray-300 rounded-md mb-2"></div>
                                    )}
                                    <p className="text-sm text-black">{chat.title}</p>
                                </button>
                            ))
                        ) : (
                            <div>Loading chats...</div>
                        )}
                    </div>


                    <button
                        onClick={handleNextPage}
                        disabled={filteredChats && indexOfLastChat >= filteredChats.length}
                        className="p-2 rounded-lg text-white bg-white disabled:bg-gray-400 hover:bg-rose-400 ml-3 "
                    >
                        ➡️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ontdek;
