"use client";

import { useState, useEffect } from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleMediaChange);

        return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    return isMobile;
};

export const variableMobile = useIsMobile();
