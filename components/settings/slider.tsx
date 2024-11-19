'use client';

import React, { useState } from "react";

interface ClientSliderProps {
    label: string;
    unit: string;
    min: number;
    max: number;
    defaultValue: number;
    sliderColor: string; // New prop for the slider color
}

function Slider({ label, unit, min, max, defaultValue, sliderColor }: ClientSliderProps) {
    const [value, setValue] = useState(defaultValue);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label} : {value} {unit}</label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full mt-2 slider"
                style={{
                    background: `linear-gradient(to right, ${sliderColor} ${((value - min) / (max - min)) * 100}%, #ddd 0%)`, // dynamic track color
                }}
            />
            <style jsx>{`
                .slider {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 5px;
                    outline: none;
                    transition: background 0.3s ease-in-out;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${sliderColor}; /* Custom color for thumb */
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-webkit-slider-thumb:hover {
                    background: #9E2A2A; /* Hover color for thumb */
                }

                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${sliderColor}; /* Custom color for thumb */
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-moz-range-thumb:hover {
                    background: #9E2A2A; /* Hover color for thumb */
                }

                .slider::-ms-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${sliderColor}; /* Custom color for thumb */
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-ms-thumb:hover {
                    background: #9E2A2A; /* Hover color for thumb */
                }
            `}</style>
        </div>
    );
}

export default Slider;
