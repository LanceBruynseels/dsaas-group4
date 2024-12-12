'use client';

import { useState } from 'react';

export default function ProfilePopup({ userId, initialShowPopup, initialImageUrl }) {
    const [showPopup, setShowPopup] = useState(initialShowPopup);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl);

    const handleConfirmSettings = async () => {
        if (!firstName || !lastName) {
            alert('Vul je voornaam en achternaam in.');
            return;
        }

        try {
            const response = await fetch('/api/home/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirth || null,
                    profileImageUrl: profileImageUrl || null,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Error updating profile:', result.error);
                alert(`Error: ${result.error}`);
                return;
            }

            console.log('Profile updated:', result.data);
            setShowPopup(false);
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('Er is een onverwachte fout opgetreden.');
        }
    };

    if (!showPopup) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#771D1D] p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-white text-2xl font-semibold mb-4">Vul hier je persoonlijke gegevens in</h2>
                <form>
                    <label className="block mb-4 text-white">
                        Voornaam (Verplicht):
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                            placeholder="Voornaam"
                            required
                        />
                    </label>
                    <label className="block text-white mb-4">
                        Achternaam (Verplicht):
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                            placeholder="Achternaam"
                            required
                        />
                    </label>
                    <label className="block text-white mb-4">
                        Geboortedatum (Optioneel):
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full mt-1 text-black"
                        />
                    </label>
                </form>
                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={handleConfirmSettings}
                        className="bg-[#FCA5A5] text-white px-4 py-2 rounded"
                    >
                        Bevestig
                    </button>
                </div>
            </div>
        </div>
    );
}
