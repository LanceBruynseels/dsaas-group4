"use client";

import React, { useState } from "react";
import { SubmitButton } from "@/components/submit-button";

const LanguageSettingsAction = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("nl");
    const [translatedText, setTranslatedText] = useState("");

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(e.target.value);
    };

    const translateText = async () => {
        try {
            const response = await fetch("/api/settings/language", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetLanguage: selectedLanguage,
                    text: "Taal Instellingen", // Example text to translate
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setTranslatedText(data.translatedText);
            } else {
                console.error("Translation failed:", data.error);
            }
        } catch (error) {
            console.error("Error during translation:", error);
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-pink-100 rounded-lg bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
            <h2 className="text-2xl font-bold mb-6 text-center">{translatedText || "Taal Instellingen"}</h2>

            <div className="space-y-6">
                {/* Language selection form */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">Selecteer Taal</label>
                    <select
                        className="mt-2 px-4 py-2 w-full border border-gray-300 rounded-md"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                    >
                        <option value="nl">Nederlands</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        {/* Add other language options as needed */}
                    </select>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-center">
                    <SubmitButton
                        className="px-4 py-2 text-white font-bold rounded-md hover:bg-red-600"
                        style={{ backgroundColor: "#771D1D" }}
                        onClick={translateText}
                    >
                        Opslaan
                    </SubmitButton>
                </div>
            </div>
        </div>
    );
};

export default LanguageSettingsAction;
