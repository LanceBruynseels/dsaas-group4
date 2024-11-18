'use client'
import React, { useState } from 'react';
import ToggleLabel from "@components/toggleLabel";

type FilterSectionProps = {
    title: string;
    data: any[];
    keyField: string;
    labelField: string;
};

const FilterSection: React.FC<FilterSectionProps> = ({ title, data, keyField, labelField }) => {
    // Initialize an object to track selected items by their key
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

    // Handle toggle logic for each label
    const handleToggle = (key: string) => {
        if (["Mijn religie", "Mijn gender", "Mijn thuisstatus"].includes(title)) {
            // For single-select filters, clear previous selections and select the new one
            setSelectedItems({
                [key]: true, // Set the clicked item as selected
            });
        } else {
            // For multi-select filters, toggle the current selection state
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
                        const isSelected = !!selectedItems[item[keyField]];
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

export default FilterSection;
