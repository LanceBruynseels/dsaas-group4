"use client"
import React, { useState, useEffect } from 'react';

const FacilitySelector: React.FC = () => {
    const [facilities, setFacilities] = useState<{ id: string; facility: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await fetch('/api/facility');
                if (!response.ok) {
                    throw new Error('Failed to fetch facilities');
                }

                const data = await response.json();
                setFacilities(data);
            } catch (err) {
                setError('Error fetching facilities.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <p>Loading facilities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <select
            id="facility"
            name="facility"
            className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
            required
        >
            <option value="">Select a facility</option>
            {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                    {facility.facility}
                </option>
            ))}
        </select>
    );
};

export default FacilitySelector;
