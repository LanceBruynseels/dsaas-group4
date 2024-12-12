"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";

const ThankYouPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl space-y-8 lg:space-y-0 lg:space-x-10">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} priority />
                    <h1 className="text-5xl font-bold text-gray-800">Thank You!</h1>
                </div>

                {/* Right Side: Thank You Message */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
                    <h2 className=" text-2xl text-white mb-6">
                        Thank you for reaching out to us! We will get back to you as soon as possible.
                    </h2>

                    <div className="mt-6">
                        <Link href="/">
                            <button
                                className="w-full hover:bg-pink-500 text-white font-semibold py-2 rounded-lg"
                                style={{ backgroundColor: '#FCA5A5' }}
                            >
                                Go to Homepage
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;
