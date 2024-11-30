"use client";

import { useState, useEffect } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Add listener
        mediaQuery.addEventListener("change", handleMediaChange);

        // Cleanup listener on unmount
        return () => {
            mediaQuery.removeEventListener("change", handleMediaChange);
        };
    }, []);

    return isMobile;
};
