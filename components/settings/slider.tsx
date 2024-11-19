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
            <h3 className="text-lg font-semibold">{label}: {value} {unit}</h3>
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
                    background: ${sliderColor}; /* Custom color for thumb */
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-webkit-slider-thumb:hover {
                    background: #9E2A2A; /* Hover color for thumb */
                }

                .slider::-moz-range-thumb {
                    width: 24px; /* Larger thumb */
                    height: 24px;
                    border-radius: 50%;
                    background: ${sliderColor}; /* Custom color for thumb */
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .slider::-moz-range-thumb:hover {
                    background: #9E2A2A; /* Hover color for thumb */
                }

                .slider::-ms-thumb {
                    width: 24px; /* Larger thumb */
                    height: 24px;
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
