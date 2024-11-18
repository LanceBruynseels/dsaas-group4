'use client'
import React, { useState, useEffect } from 'react';
import ToggleLabel from "@components/toggleLabel"; // Assuming this is a custom toggle button component

type FilterSectionProps = {
    title: string;
    data: any[];   // All possible filter options (e.g., genders, interests, etc.)
    keyField: string; // The field used for unique keys in the data (e.g., gender_id, id, etc.)
    labelField: string; // The field used for the display label
    profileData: any;  // User's selected labels (the data specific to the user)
};

const ProfileFilterSection: React.FC<FilterSectionProps> = ({ title, data, keyField, labelField, profileData }) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Initialize selectedItems based on profileData
        const initialSelections: { [key: string]: boolean } = {};

        if (profileData) {
            const userSelectedValues = profileData[title.toLowerCase().replace(" ", "")]; // e.g., "Mijn religie" => "religie"

            if (userSelectedValues) {
                if (Array.isArray(userSelectedValues)) {
                    // Multi-select case
                    userSelectedValues.forEach((value: string) => {
                        initialSelections[value] = true;  // Mark those values as selected
                    });
                } else {
                    // Single-select case
                    initialSelections[userSelectedValues] = true;
                }
            }
        }

        setSelectedItems(initialSelections);  // Update state with the initial selections
    }, [profileData, title]);

    const handleToggle = (key: string) => {
        if (["Mijn religie", "Mijn gender", "Mijn thuisstatus"].includes(title)) {
            // Single-select logic: Clear previous selections and select the new one
            setSelectedItems({
                [key]: true, // Set the clicked item as selected
            });
        } else {
            // Multi-select logic: Toggle the current selection state
            setSelectedItems((prevSelected) => ({
                ...prevSelected,
                [key]: !prevSelected[key], // Toggle selection state
            }));
        }
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data && data.length > 0 ? (
                    data.map((item) => {
                        const isSelected = !!selectedItems[item[keyField]];  // Check if this item is selected
                        return (
                            <ToggleLabel
                                key={item[keyField]}
                                tag={item[labelField]}
                                isSelected={isSelected}
                                onClick={() => handleToggle(item[keyField])}
                            />
                        );
                    })
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default ProfileFilterSection;
