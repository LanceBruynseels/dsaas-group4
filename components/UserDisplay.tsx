import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

interface UserDisplayProps { // receive session
    session: Session | null;
}

const UserDisplay = ({ session }: UserDisplayProps) => {
    return (
        <div className="flex items-center gap-4">
            {session ? (
                // Logged in state
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        
                        <span className="text-sm font-medium">{session.user?.name}</span>
                        <Link
                            href="/api/auth/signout"
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Sign out
                        </Link>
                    </div>
                    <Image
                        src={session.user?.image || "/mock-picture.webp"}
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
                    Sign in
                </Link>
            )}
        </div>
    );
};

export default UserDisplay;