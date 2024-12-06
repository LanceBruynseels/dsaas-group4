'use client';

import React, { useState } from 'react';

interface ProfileDOBProps {
    userId: string;
    dob: string;
}

const ProfileDOB: React.FC<ProfileDOBProps> = ({ userId, dob }) => {
    const [selectedDob, setSelectedDob] = useState(dob);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle DOB change when the user selects a new date
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDob(e.target.value);
    };

    // Handle DOB update when the button is clicked
    const handleUpdateClick = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userId,
                    dob: selectedDob,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update DOB');
            }

            const responseData = await response.json();
        } catch (err: any) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col mt-8 justify-center items-center mb-8 px-20">
            <div className="flex items-center mt-4 gap-4 mt-1">
                {/* Date input */}
                <input
                    type="date"
                    value={selectedDob}
                    onChange={handleDateChange}
                    className="bg-gray-100 border-gray-300 rounded-md shadow-sm px-4 py-2"
                />
                {/* Update button */}
                <button
                    onClick={handleUpdateClick}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md font-semibold ${
                        loading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-[#771D1D] text-white hover:bg-[#FFAB9F]'
                    }`}
                    // Remove inline style to avoid conflict with Tailwind classes
                >
                    {loading ? 'Updating...' : 'Pas aan'}
                </button>
            </div>
            {/* Message display */}
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default ProfileDOB;
