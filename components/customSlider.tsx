"use client";

import React, { useState } from "react";
import { Slider } from "@nextui-org/slider";

interface CustomSliderProps {
    label: string;
    minValue: number;
    maxValue: number;
    defaultValue: number[];
    step?: number;
    onChange?: (value: number[]) => void;
    user_id: string;
    classNames?: {
        base?: string;
        filler?: string;
        track?: string;
        thumb?: string[];
        step?: string;
    };
}

const CustomSlider: React.FC<CustomSliderProps> = ({
                                                       label,
                                                       minValue,
                                                       maxValue,
                                                       defaultValue,
                                                       step = 1,
                                                       onChange,
                                                       classNames,
                                                       user_id
                                                   }) => {
    const [sliderValue, setSliderValue] = useState<number[]>(defaultValue);

    // Function to send updated age range to the backend
    const updateAge = async (minAge: number, maxAge: number) => {
        try {
            const response = await fetch("/api/home/ageSlider", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    table: "search_age_range", // Adjusted table name for clarity
                    minAge,
                    maxAge,
                    user_id: user_id, // Ensure userId is available in this scope
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error updating age range:", error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleSliderChange = (value: number[]) => {
        console.log("Slider value:", value);
        setSliderValue(value);
        if (onChange) {
            onChange(value);
        }
        // Send the updated range to the backend
        updateAge(value[0], value[1]);
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{label}</h3>
            <Slider
                label={" "}
                step={step}
                minValue={minValue}
                maxValue={maxValue}
                defaultValue={defaultValue}
                onChangeEnd={handleSliderChange}
                classNames={{
                    base: classNames?.base || "max-w-md",
                    filler: classNames?.filler || "bg-[#771D1D]",
                    track: classNames?.track || "bg-[#FFFFFF]",
                    thumb: classNames?.thumb || ["bg-[#771D1D] rounded-full shadow-md w-5 h-5"],
                    step: classNames?.step || "data-[in-range=true]:bg-black/30 dark:data-[in-range=true]:bg-white/50",
                }}
            />
            <div>
                Selected Age Range: {sliderValue[0]} to {sliderValue[1]} years
            </div>
        </div>
    );
};

export default CustomSlider;
