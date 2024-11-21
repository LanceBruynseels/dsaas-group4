'use client';
import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
            <h1 className="text-3xl font-bold text-blue-700">Welcome to YapperDappers!</h1>
            <p className="mt-4 text-gray-800">Choose your plan and start now!</p>
            <Link
                href="/checkout"
                className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
                View Plans
            </Link>
        </div>
    );
};

export default HomePage;
