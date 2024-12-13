import React from 'react';
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Index() {
    const session = await getServerSession(authOptions);

    // if (session) {
    //     return redirect("/home");
    // }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <div className="mb-5">
                {/* Logo with responsive size */}
                <Image
                    src="/vlinder.png"
                    alt="Vlinder Logo"
                    className="w-32 sm:w-48 lg:w-56 h-auto mx-auto"
                    width={500}
                    height={500}
                    priority
                />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-3">
                    V(L)INDER
                </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full max-w-sm sm:max-w-md mx-auto mt-5">
                <Link href="/sign-in" className="flex-1">
                    <button
                        className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base transition duration-300"
                    >
                        LOGIN
                    </button>
                </Link>
                <Link href="/registration" className="flex-1 mt-4 sm:mt-0">
                    <button
                        className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base transition duration-300"
                    >
                        REGISTRATIE
                    </button>
                </Link>
            </div>
        </div>
    );
}
