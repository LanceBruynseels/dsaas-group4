"use client"
import React from 'react';
import ToggleLabel from "@components/toggleLabel"; // Assuming you have this component

type FilterSectionProps = {
    title: string;
    table: string;
    data: any[];
    keyField: string;
    labelField: string;
};

const FilterSection: React.FC<FilterSectionProps> = ({ title, table, data, keyField, labelField }) => {
    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data && data.length > 0 ? (
                    data.map((item) => (
                        <ToggleLabel tag={item[labelField]} labelKey={item[keyField]} table={table}/>
                    ))
                ) : (
                    <p>No interests</p>
                )}
            </div>
        </div>
    );
};

export default FilterSection;
