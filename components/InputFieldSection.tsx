'use client'
import React, { useState } from "react";

interface InputFieldsSectionProps {
    fields: {
        label: string;
        type: string; // e.g., "date", "text", etc.
        value: string;
    }[];
}

function InputFieldsSection({ fields }: InputFieldsSectionProps) {
    // Create a state for each field
    const [inputValues, setInputValues] = useState(
        fields.reduce((acc, field) => {
            acc[field.label] = field.value;
            return acc;
        }, {} as { [key: string]: string })
    );

    // Handle change for each input field
    const handleInputChange = (label: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [label]: e.target.value,
        }));
    };

    return (
        <div className="flex justify-between gap-4 mt-4 mb-6">
            {fields.map((field, index) => (
                <div key={index} className="flex-1 px-20 w-1/2">
                    <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        value={inputValues[field.label]}
                        onChange={handleInputChange(field.label)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            ))}
        </div>
    );
}

export default InputFieldsSection;
