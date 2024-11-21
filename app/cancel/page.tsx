'use client';
import React from 'react';

const CancelPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100">
            <h1 className="text-2xl font-bold text-red-700">Order Cancelled</h1>
            <p className="mt-4 text-gray-800">
                Your order has been canceled. Feel free to continue shopping and checkout when you're ready!
            </p>
            <a
                href="/"
                className="mt-6 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
            >
                Return to Home
            </a>
        </div>
    );
};

export default CancelPage;
