'use client';

import React, { useState } from 'react';

const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckoutSession = async () => {
        setLoading(true);
        setError(null); // Clear any previous errors

        try {
            const session = await fetch('/api/create-checkout-session', { method: 'POST' });

            // Check if the response is valid
            if (!session.ok) {
                throw new Error('Failed to create checkout session');
            }

            const sessionData = await session.json();

            // Redirect to Stripe's checkout page
            window.location.href = sessionData.checkoutUrl;
        } catch (err: any) {
            // Handle errors
            setError('Something went wrong, please try again.');
            console.error('Checkout error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Select Your Plan</h1>

            {/* Show error message if there is an error */}
            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={createCheckoutSession}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
        </div>
    );
};

export default CheckoutPage;
