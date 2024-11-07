import React from 'react';

export default function Index() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center relative">
            <div className="mb-5">
                {/* Replace with the actual path to your butterfly logo */}
                <img src="vlinder.png" alt="Vlinder Logo" className="w-24 h-auto mx-auto" />
                <h1 className="text-4xl font-bold text-gray-800 mt-3">VLINDER</h1>
            </div>

            <div className="flex space-x-4 mt-5">
                <a href = "http://localhost:3000/sign-up">
                <button  className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-full transition duration-300">LOGIN</button>
                </a>
                <a href = "http://localhost:3000/sign-in">
                    <button className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-full transition duration-300">REGISTRATIE</button>
                </a>
                </div>


        </div>
    );
}

