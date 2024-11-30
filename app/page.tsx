"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const ResponsiveLayout: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleMediaChange);

        return () => null;
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative">
            <div className="mb-8">
                <Image
                    src="/vlinder.png"
                    alt="Vlinder Logo"
                    className={`h-auto mx-auto ${isMobile ? "w-48" : "w-72"}`}
                    width={isMobile ? 192 : 288}
                    height={isMobile ? 192 : 288}
                />
                <h1
                    className={`${
                        isMobile ? "text-3xl" : "text-5xl"
                    } font-bold text-gray-800 mt-3`}
                >
                    V(L)INDER
                </h1>
            </div>
            <div
                className={`flex ${
                    isMobile ? "flex-col space-y-4" : "flex-row space-x-4"
                } w-full max-w-md mx-auto mt-8`}
            >
                <a href="/sign-in" className="flex-1">
                    <button className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-3 rounded-xl text-sm transition duration-300">
                        LOGIN
                    </button>
                </a>
                <a href="/registration" className="flex-1">
                    <button className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-3 rounded-xl text-sm transition duration-300">
                        REGISTRATIE
                    </button>
                </a>
            </div>
        </div>
    );
};

export default ResponsiveLayout;
