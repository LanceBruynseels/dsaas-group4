import React from 'react';
import ToggleLabel from "@components/toggleLabel";
import { createClient } from "@/utils/supabase/server"; // Assuming this is your Supabase client setup

type FilterSectionProps = {
    title: string;
    table: string;
    data: any[];
    keyField: string;
    labelField: string;
    user_id: string;
};

const FilterSection: React.FC<FilterSectionProps> = async ({ title, table, data, keyField, labelField, user_id }) => {
    const supabase = await createClient();

    // Fetch selected items from the database
    const { data: isSelectedData, error } = await supabase
        .from(`search_${table}`)
        .select(`${table}_id`)
        .eq('user_id', user_id);

    if (error) {
        console.log("Error fetching data:", error.message);
        return <p>Error loading data</p>;
    }

    // Extract IDs into a Set for quick lookup
    const selectedIds = new Set(isSelectedData?.map((item: any) => item[`${table}_id`]));

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data && data.length > 0 ? (

                    data.map((item) => (
                        <ToggleLabel
                            key={item[keyField]} // React key
                            tag={item[labelField]}
                            labelKey={item[keyField]}
                            table={table}
                            user_id={user_id}
                            isSelected={selectedIds.has(item[keyField])} // Check if labelKey is in selectedIds
                        />
                    ))
                ) : (
                    <p>No interests</p>
                )}
            </div>
        </div>
    );
};

export default FilterSection;
