'use client'
import React, { useState } from "react";

interface ClientSliderProps {
    label: string;
    unit: string;
    min: number;
    max: number;
    defaultValue: number;
    sliderColor: string;
    userId: string;
}

const Slider: React.FC<ClientSliderProps> = ({ label, unit, min, max, defaultValue, sliderColor, userId }) => {
    const [value, setValue] = useState(defaultValue);

    // Function to send updated value to the backend
    const updateDistance = async (newValue: number) => {
        try {
            const response = await fetch("/api/settings/slider", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    table: "profile_distance",
                    key: newValue,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error updating distance:", error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        updateDistance(newValue); // Update backend with the new value
    };

    return (
        <div>
            <h3 className="text-lg font-semibold">
                {label}: {value} {unit}
            </h3>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                className="w-full mt-2 slider"
                style={{
                    background: `linear-gradient(to right, ${sliderColor} ${(value - min) / (max - min) * 100}%, #ddd 0%)`,
                }}
            />
            <style jsx>{`
                .slider {
                    -webkit-appearance: none;
                    width: 600px;
                    height: 8px;
                    border-radius: 5px;
                    outline: none;
                    background: linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} 50%, #ddd 50%, #ddd 100%);
                    transition: background 0.3s ease-in-out;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${sliderColor};
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-webkit-slider-thumb:hover {
                    background: #9e2a2a;
                }
            `}</style>
        </div>
    );
};

export default Slider;
