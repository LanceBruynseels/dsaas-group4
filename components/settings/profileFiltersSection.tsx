'use client';

import React, { useEffect, useState } from 'react';
import ToggleLabel from '@components/toggleLabel';

type FilterSectionProps = {
    title: string;
    table: string;
    data: any[];
    keyField: string;
    labelField: string;
    user_id: string;
};

const ProfileFilterSection: React.FC<FilterSectionProps> = ({ title, table, data, keyField, labelField, user_id }) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch selected items from the API
    useEffect(() => {
        const fetchSelectedItems = async () => {
            try {
                const response = await fetch('/api/settings/selected-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id, table }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch selected items');
                }

                const result = await response.json();
                const reponseIds = result.data;
                const ids: Set<number> = new Set(reponseIds.map((item: any) => item[`${table}_id`]));
                setSelectedIds(ids);
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSelectedItems();
    }, [table, user_id]);

    if (loading) {
        return (
            <div role="status" className="max-w-sm animate-pulse mb-4">
                <div className="h-2.5 bg-red-400 rounded-full dark:bg-red-700 w-48 mb-4"></div>
                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px] mb-2.5"></div>
                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 mb-2.5"></div>
                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[330px] mb-2.5"></div>
                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[300px] mb-2.5"></div>
                <div className="h-2 bg-red-400 rounded-full dark:bg-red-700 max-w-[360px]"></div>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                {data && data.length > 0 ? (
                    data.map((item) => (
                        <ToggleLabel
                            key={item[keyField]}
                            tag={item[labelField]}
                            labelKey={item[keyField]}
                            table={table}
                            user_id={user_id}
                            isSelected={selectedIds.has(item[keyField])}
                        />
                    ))
                ) : (
                    <p>No items available</p>
                )}
            </div>
        </div>
    );
};

export default ProfileFilterSection;
