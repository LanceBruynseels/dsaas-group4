// UserDisplay.tsx (Server-side fetching)
import { createClient } from "@/utils/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const UserDisplay = async () => {
    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch session server-side
    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <div className="flex items-center gap-4">
                <div className="animate-pulse flex items-center gap-2">
                    <div className="h-fit w-fit bg-gray-200 rounded-full"></div>
                    <div className="h-fit w-fit bg-gray-200 rounded"></div>
                </div>
            </div
        );
    }

    const user_id = session.user.id;

    // Fetch profile picture and user data from Supabase
    const { data: picture, error: pictureError } = await supabase.rpc("get_profile_picture", { userid: user_id });

    if (pictureError) {
        console.error("Error fetching profile picture:", pictureError);
    }

    // Render the component with the profile data
    return (
        <div className="flex items-center gap-4">
            {status === "authenticated" ? (
                // Logged in state
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <span className="font-medium">{session?.user.name}</span>
                        <Link
                            href="/api/auth/signout"
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Sign out
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
                    className="flex items-center h-fit"
                >
                    Sign in
                </Link>
            )}

        </div>
    );
};

export default UserDisplay;
