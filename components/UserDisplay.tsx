// UserDisplay.tsx
'use client';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

const UserDisplay = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center gap-4">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {status === "authenticated" ? (
                // Logged in state
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{session?.user.name}</span>
                        <Link
                            href="/api/auth/signout"
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Log uit
                        </Link>
                    </div>
                    <Image
                        src={session?.user.image || "/mock-picture.webp"}
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                </div>
            ) : (
                // logged out state
                <Link
                    href="/sign-in"
                    className="text-sm hover:text-primary"
                >
                    
                </Link>
            )}
        </div>
    );
};

export default UserDisplay;
