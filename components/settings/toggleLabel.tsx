"use client";
import React, { useState, useEffect } from "react";

async function addLabelToUser(table: string, labelKey: number, user_id: string) {
    const response = await fetch("/api/settings/label", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ table, key: labelKey, user_id: user_id }), // Send data to API route
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        console.error("Error inserting data:", data.error);
        return null;
    }
}

async function removeLabelToUser(table: string, labelKey: number, user_id: string) {
    const response = await fetch("/api/settings/label", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ table, key: labelKey, user_id: user_id }), // Send data to API route
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        console.error("Error deleting data:", data.error);
        return null;
    }
}

function ToggleLabel({
                         tag,
                         labelKey,
                         table,
                         isSelected: initialSelected,
                         user_id
                     }: {
    tag: string,
    labelKey: number,
    table: string,
    isSelected: boolean,
    user_id: string
}) {
    const [selected, setSelected] = useState(initialSelected);

    // Toggle the label selection state
    const handleToggle = async () => {
        setSelected((prev) => {
            const newSelected = !prev;
            if (newSelected) {
                addLabelToUser(table, labelKey, user_id);
            } else {
                removeLabelToUser(table, labelKey, user_id);
            }
            return newSelected;
        });
    };

    useEffect(() => {
        setSelected(initialSelected);
    }, [initialSelected]);

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