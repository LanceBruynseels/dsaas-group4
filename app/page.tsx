import React from 'react';
import Image from "next/image";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import {redirect} from "next/navigation";
import Link from "next/link";
import {variableMobile} from "@components/mediaQuery";

export default async function Index() {

    const session = await getServerSession(authOptions);

    if(session){
        return redirect("/home");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative">
            <div className="mb-8">
                <Image
                    src="/vlinder.png"
                    alt="Vlinder Logo"
                    className={`h-auto mx-auto ${variableMobile ? "w-48" : "w-72"}`}
                    width={variableMobile ? 192 : 288}
                    height={variableMobile ? 192 : 288}
                />
                <h1
                    className={`${
                        variableMobile ? "text-3xl" : "text-5xl"
                    } font-bold text-gray-800 mt-3`}
                >
                    V(L)INDER
                </h1>
            </div>
            <div
                className={`flex ${
                    variableMobile ? "flex-col space-y-4" : "flex-row space-x-4"
                } w-full max-w-md mx-auto mt-8`}
            >
                <a href="http://localhost:3000/sign-in" className="flex-1">
                    <button
                        className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-3 rounded-xl text-sm transition duration-300">
                        LOGIN
                    </button>
                </a>
                <a href="http://localhost:3000/registration" className="flex-1">
                    <button
                        className="w-full bg-[#FCA5A5] hover:bg-[#771d1d] text-white py-3 rounded-xl text-sm transition duration-300">
                        REGISTRATIE
                    </button>
                </a>
            </div>
        </div>

    );
}