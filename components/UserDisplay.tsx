'use client'
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();


interface UserDisplayProps {
    session: Session | null;
}

const UserDisplay = ({ session }: UserDisplayProps) => {
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (session?.user?.id) {
                const { data, error } = await supabase
                    .rpc("get_profile_picture", { userid: session.user.id });

                if (error) {
                    console.error("Error fetching profile picture:", error);
                } else if (data && data.profile_picture_url && data.profile_picture_url[0]) {
                    setProfilePicture(data.profile_picture_url[0]); // Accessing the first item in the array
                }
            }
        };

        fetchProfilePicture();
    }, [session]);
    return (
        <div className="flex items-center gap-4">
            {session ? (
                // Logged in state
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{session.user?.username}</span>
                        <Link
                            href="/api/auth/signout"
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Sign out
                        </Link>
                    </div>
                    <Image
                        src={profilePicture || "/mock-picture.webp"}
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                </div>
            ) : (
                // Logged out state
                <Link
                    href="/sign-in"
                    className="text-sm hover:text-primary"
                >
                    Sign in
                </Link>
            )}
        </div>
    );
};

export default UserDisplay;
