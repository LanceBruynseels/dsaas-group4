'use client';

import React, { useState } from 'react';

interface ProfileDOBProps {
    dob: string; // current DOB as the initial value
}

const ProfileDOB: React.FC<ProfileDOBProps> = ({ dob }) => {
    const [selectedDob, setSelectedDob] = useState(dob);

    // Handle DOB change when the user selects a new date
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDob(e.target.value);
    };

    return (
        <div className="flex flex-col mt-6 justify-center items-center px-20">
            <label className="block text-lg font-semibold">Mijn verjaardag</label>

            {/* Display selected DOB in a text field */}
            <input
                type="date"
                value={selectedDob}
                onChange={handleDateChange}
                className="mt-1 block w-fit bg-gray-100 border-gray-300 rounded-md shadow-sm px-4 py-2"
            />
        </div>
    );
};

export default ProfileDOB;
