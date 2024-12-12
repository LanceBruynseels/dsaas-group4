"use client";
import React, { useState } from 'react';
import Image from "next/image";

const SharePage: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        const websiteLink = "https://www.yourwebsite.com"; // Replace with your actual website URL
        navigator.clipboard.writeText(websiteLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 5000); // Reset after 2 seconds
        }).catch((err) => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} priority />
                    <h1 className="text-5xl font-bold text-gray-800">Deel V(l)inder</h1>
                    <p className="text-gray-800 text-xl">Breng nu je vrienden op de hoogte van V(l)inder!</p>
                </div>

                {/* Right Side: Copy Link Section */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
                    <div className="flex flex-col items-center space-y-6">
                        <p className="text-white text-center">Klik op de knop hieronder om de link te kopiëren</p>
                        <button
                            style={{backgroundColor: '#FCA5A5'}}
                            onClick={copyToClipboard}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            Kopieer link
                        </button>
                        {copied && (
                            <p className="text-[#FCA5A5] text-center mt-2">
                                Gekopieerd!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePage;
