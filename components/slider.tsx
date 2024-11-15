"use client";

import React, { useState } from "react";

interface ClientSliderProps {
    label: string;
    unit: string;
    min: number;
    max: number;
    defaultValue: number;
}

function Slider({ label, unit, min, max, defaultValue }: ClientSliderProps) {
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
                className="w-full mt-2"
            />
        </div>
    );
}

export default Slider;
