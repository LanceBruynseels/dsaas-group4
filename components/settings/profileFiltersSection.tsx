import ToggleLabel from "@components/settings/toggleLabel";
import {createClient} from "@/utils/supabase/server";

type FilterSectionProps = {
    title: string;
    table: string;
    data: any[];  // Filter data passed to this component
    keyField: string;
    labelField: string;
    user_id: string;
};

const ProfileFilterSection: ({title, table, data, keyField, labelField, user_id}: {
    title: any;
    table: any;
    data: any;
    keyField: any;
    labelField: any;
    user_id: any
}) => Promise<JSX.Element> = async ({ title, table, data, keyField, labelField, user_id }) => {
    const supabase = await createClient();

    const { data: isSelectedData, error } = await supabase
        .from(`profile_${table}`)
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
                            isSelected={selectedIds.has(item[keyField])} // Check if item is selected
                        />
                    ))
                ) : (
                    <p>No {title.toLowerCase()}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileFilterSection;