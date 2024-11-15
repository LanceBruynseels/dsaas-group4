"use client";

import React, { useState } from "react";

function ToggleLabel({ tag }: { tag: string }) {
    const [selected, setSelected] = useState(false);

    const handleToggle = () => setSelected((prev) => !prev);

    return (
        <button
            onClick={handleToggle}
            className="px-3 py-1 text-sm text-white rounded-full shadow-sm border border-gray-300 hover:bg-gray-100"
            style={{
                backgroundColor: selected ? "#771D1D" : "white",
                color: selected ? "white" : "#771D1D",
            }}
        >
            {tag}
        </button>
    );
}

export default ToggleLabel;
