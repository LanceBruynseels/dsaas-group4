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
            <Link href="/sign-in" className="text-sm hover:text-primary">
                Sign in
            </Link>
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
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{session.user?.username}</span>
                    <Link href="/api/auth/signout" className="text-xs text-gray-500 hover:text-gray-700">
                        Sign out
                    </Link>
                </div>
                <Image
                    src={picture?.profile_picture_url[0] || "/mock-picture.webp"}
                    alt="Profile Picture"
                    width={44}
                    height={44}
                    className="rounded-full border border-gray-500"
                />
            </div>
        </div>
    );
};

export default UserDisplay;
