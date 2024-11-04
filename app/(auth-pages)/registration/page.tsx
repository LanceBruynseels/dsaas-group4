import React from 'react';

const Registration: React.FC = () => {
    return (
        <div className="min-h-screen bg-pink-100 flex items-center justify-center">
            {/* Content Wrapper */}
            <div className="flex flex-col items-center w-full max-w-5xl p-4">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <img src="/logo.jpg" alt="VLinder Logo" className="h-32 mb-4" />
                    <h1 className="text-4xl font-bold">VLINDER</h1>
                </div>

                {/* Form Section */}
                <div className="bg-red-600 text-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-4">Registreer</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Gebruikersnaam
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Paswoord
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="facility" className="block text-sm font-medium">
                                Faciliteit
                            </label>
                            <select
                                id="facility"
                                name="facility"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                            >
                                <option value="Leuven">faciliteit Leuven</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supervisor" className="block text-sm font-medium">
                                begeleider
                            </label>
                            <select
                                id="supervisor"
                                name="supervisor"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 text-black"
                            >
                                <option value="Kris">Kris</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-md font-semibold"
                        >
                            Registreer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;