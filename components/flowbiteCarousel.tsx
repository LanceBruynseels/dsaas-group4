"use client";

import { Carousel } from "flowbite-react";
import { useState, useEffect } from "react";

export function FlowbiteCarousel({ pictures = [], infoSection }) { // Accept infoSection as a prop
    console.log("Inside the FlowbiteCarousel:", pictures);
    console.log("infosection", infoSection);

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1280); // Tailwind's `md` breakpoint
        };

        // Set initial value and attach listener
        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col w-full m-2 h-full bg-gradient-to-b from-gray-50 to-gray-200 rounded-lg shadow-md">
            <Carousel className={"w-full"}>
                {/* Render pictures */}
                {pictures.length > 0
                    ? pictures.map((picture, index) => (
                        <img key={index} src={picture} alt={`Slide ${index + 1}`} className="object-cover w-full h-full" />
                    ))
                    : (
                        <img src="/mock-picture.webp" alt="Default slide" className="object-cover w-full h-full" />
                    )}

                {/* Render info section as a carousel item */}
                {isSmallScreen ?
                    <div
                        className="flex flex-col h-full p-6 bg-gradient-to-b from-gray-50 to-gray-200text-red-950 rounded-lg">
                        {infoSection || (
                            <p>No additional info available</p> // Fallback for infoSection
                        )}
                    </div> : <p className={"!hidden"}/>}
            </Carousel>
        </div>
    );
}
