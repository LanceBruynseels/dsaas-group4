"use client";

import React, { useState, useEffect, useRef } from "react";

// Function to call the API route to insert label into the user's search table
async function addLabelToUser(table: string, labelKey: number, user_id: string) {
    const response = await fetch("/api/home/label", {
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

// Function to call the API route to delete a label out of the table
async function removeLabelToUser(table: string, labelKey: number, user_id: string) {
    const response = await fetch("/api/home/label", {
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
                         user_id,
                     }: {
    tag: string;
    labelKey: number;
    table: string;
    isSelected: boolean;
    user_id: string;
}) {
    const [selected, setSelected] = useState(initialSelected);
    const [loading, setLoading] = useState(false); // Track if API call is in progress
    const isMounted = useRef(true); // Track component mount state

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Toggle the label selection state
    const handleToggle = async () => {
        if (loading) return; // Prevent multiple clicks during an API call

        setLoading(true);
        const newSelected = !selected;

        // Call appropriate API
        if (newSelected) {
            await addLabelToUser(table, labelKey, user_id);
        } else {
            await removeLabelToUser(table, labelKey, user_id);
        }

        // Only update state if component is still mounted
        if (isMounted.current) {
            setSelected(newSelected);
            setLoading(false);
        }
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
                cursor: loading ? "wait" : "pointer", // Show disabled state
            }}
            disabled={loading} // Disable button during API call
        >
            {tag}
        </button>
    );
}

export default ToggleLabel;
