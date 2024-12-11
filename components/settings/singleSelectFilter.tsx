"use client";

import React, { useState } from "react";

const SingleSelectFilter = ({
                                title,
                                table,
                                data,
                                keyField,
                                labelField,
                                user_id,
                            }: {
    title: string;
    table: string;
    data: any[];
    keyField: string;
    labelField: string;
    user_id: string;
}) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = async (id: number) => {
        if (selectedId === id) return; // Prevent unnecessary API calls for already selected option

        setSelectedId(id);

        // Send the selection to the server
        await fetch("/api/settings/singleSelect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                table,
                user_id,
                key: id,
            }),
        });
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg text-center font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data.map((item) => (
                    <button
                        key={item[keyField]}
                        onClick={() => handleSelect(item[keyField])}
                        className={`px-3 py-1 text-sm rounded-full shadow-sm border border-gray-300 ${
                            selectedId === item[keyField]
                                ? "bg-[#771D1D] text-white"
                                : "bg-white text-[#771D1D] hover:bg-gray-100"
                        }`}
                    >
                        {item[labelField]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SingleSelectFilter;
