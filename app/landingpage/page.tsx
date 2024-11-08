import React from 'react';

export default function Index() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center relative">
            <div className="mb-5">
                {/* Replace with the actual path to your butterfly logo */}
                <img src="vlinder.png" alt="Vlinder Logo" className="  min-w-24 max-w-72 h-auto mx-auto"/>
                <h1 className="text-4xl font-bold text-gray-800 mt-3">V(L)INDER</h1>
            </div>

            <div className="flex space-x-4 w-full max-w-md mx-auto mt-5">
                <a href="http://localhost:3000/sign-in" className="flex-1">
                    <button
                        className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 rounded-xl transition duration-300">
                        LOGIN
                    </button>
                </a>
                <a href="http://localhost:3000/sign-up" className="flex-1">
                    <button
                        className="w-fullGI bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 rounded-xl transition duration-300">
                        REGISTRATIE
                    </button>
                </a>
            </div>


        </div>
    );
}

