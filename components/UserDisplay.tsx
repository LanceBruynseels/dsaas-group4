
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    username: string;
}

interface UserData {
    user: User;
    picture: { profile_picture_url: string[] };  // Updated to reflect the correct structure
}

const UserDisplay = () => {
    const [user, setUser] = useState<User | null>(null);
    const [picture, setPicture] = useState<string | null>(null); // Explicitly typed as string | null
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data: UserData = await res.json();  // Ensure the response is typed as UserData
                setUser(data.user);

                if (data.picture && data.picture.profile_picture_url && data.picture.profile_picture_url.length > 0) {
                    setPicture(data.picture.profile_picture_url[0]);
                } else {
                    setPicture("/mock-picture.webp");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <Link href="/sign-in" className="flex items-center h-fit">
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="font-medium">{user.name}</span>
                <Link
                    href="/api/auth/signout"
                    className="text-xs text-gray-500 hover:text-gray-700"
                >
                    Log uit
                </Link>
            </div>
            <Image
                src={picture || "/mock-picture.webp"}  // Ensure picture is a string or fallback URL
                alt="Profile Picture"
                width={32}
                height={32}
                className="rounded-full border border-gray-500"
            />

        </div>
    );
};


export default UserDisplay;
