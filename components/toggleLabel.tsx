"use client";

import React, { useState } from "react";

// Function to call the API route to insert label into the user's search table
async function addLabelToUser(table: string, labelKey: number) {
    const response = await fetch("/api/addLabel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ table, key: labelKey }), // Send data to API route
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        console.error("Error inserting data:", data.error);
        return null;
    }
}

function ToggleLabel({
                         tag,
                         labelKey,
                         table,
                     }: {
    tag: string;
    labelKey: number;
    table: string;
}) {
    const [selected, setSelected] = useState(false);

    // Toggle the label selection state
    const handleToggle = async () => {
        setSelected((prev) => {
            const newSelected = !prev;
            // Only add the label to the user if it's selected (i.e., newSelected is true)
            if (newSelected) {
                addLabelToUser(table, labelKey);
            }
            return newSelected;
        });
    };

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
