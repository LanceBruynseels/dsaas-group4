'use client'
import ToggleLabel from "@components/toggleLabel";
import React, { useState, useEffect } from 'react';

type ProfileFilterSectionProps = {
    title: string;
    data: any[];
    keyField: string;
    labelField: string;
    selectedIds: number[];
};

const ProfileFilterSection: React.FC<ProfileFilterSectionProps> = ({ title, data, keyField, labelField, selectedIds }) => {
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});

    // Initialize selectedItems state based on selectedIds
    useEffect(() => {
        const initialSelected = (selectedIds || []).reduce((acc, id) => {
            acc[id] = true;
            return acc;
        }, {} as { [key: number]: boolean });
        setSelectedItems(initialSelected);
    }, [selectedIds]);

    // Handle toggle logic
    const handleToggle = (id: number) => {
        setSelectedItems((prevSelected) => ({
            ...prevSelected,
            [id]: !prevSelected[id], // Toggle the selected state of the clicked item
        }));
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data && data.length > 0 ? (
                    data.map((item) => {
                        const isSelected = !!selectedItems[item[keyField]]; // Check if this item is selected
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
