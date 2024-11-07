import React from 'react';

export default function Index() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 text-center relative">
            <div className="mb-5">
                {/* Replace with the actual path to your butterfly logo */}
                <img src="vlinder.png" alt="Vlinder Logo" className="w-24 h-auto mx-auto" />
                <h1 className="text-4xl font-bold text-gray-800 mt-3">VLINDER</h1>
            </div>

            <div className="flex space-x-4 mt-5">
                <button className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-full transition duration-300">LOGIN</button>
                <button className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-full transition duration-300">REGISTRATIE</button>
            </div>


        </div>
    );
}

