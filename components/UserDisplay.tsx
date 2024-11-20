import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

// interface UserDisplayProps { // receive session
//     session: Session | null;
// }

const UserDisplay = () => {
    const { data: session } = useSession();

    return (
        <div className="flex items-center gap-4">
            {session ? (
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium">{session.user?.username}</span>
                        <button
                            onClick={() => signOut()}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Sign out
                        </button>
                    </div>
                    <Image
                        src={session.user?.image || "/mock-picture.webp"}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                </div>
            ) : (
                <Link href="/sign-in" className="text-sm hover:text-primary">
                    Sign in
                </Link>
            )}
        </div>
    );
};

export default UserDisplay;