// (auth-pages)/sign-in/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <div className="flex flex-grow items-center justify-center p-10">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-1/2 space-y-6">
                    <Image src="/vlinder.png" alt="Vlinder Logo" width={200} height={200} />
                    <h1 className="text-5xl font-bold text-gray-800">VLINDER</h1>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-1/3 p-8 text-white rounded-lg shadow-lg" style={{ backgroundColor: "#771D1D" }}>
                    <h2 className="text-2xl font-semibold mb-4">Log in</h2>
                    <p className="text-sm mb-6">
                        Hebt u nog geen account?{" "}
                        <Link href="/register" className="underline text-white hover:text-gray-200">
                            Registreer
                        </Link>
                    </p>
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="username">
                                Gebruikersnaam
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                Passwoord
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border bg-white rounded-lg text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ backgroundColor: '#FCA5A5' }}
                            className="w-full hover:bg-pink-500 text-white font-semibold py-2 rounded-lg"
                        >
                            Log in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
