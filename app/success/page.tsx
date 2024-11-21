'use client';
import React, { useEffect, useState } from 'react';

const SuccessPage: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSessionId(params.get('session_id'));
    }, []);

    const handleManageSubscription = async () => {
        const customerId = 'cus_example'; // Replace with logic to fetch customer ID
        const response = await fetch('/api/create-portal-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: customerId }),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Failed to load customer portal.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-100">
            <h1 className="text-2xl font-bold text-green-700">Success!</h1>
            <p className="mt-4 text-gray-800">Thank you for your purchase!</p>
            {sessionId && (
                <p className="mt-2 text-sm text-gray-600">Session ID: {sessionId}</p>
            )}
            <button
                onClick={handleManageSubscription}
                className="mt-6 px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
            >
                Manage Your Subscription
            </button>
            <a
                href="/"
                className="mt-4 px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
            >
                Return to Home
            </a>
        </div>
    );
};

export default SuccessPage;
