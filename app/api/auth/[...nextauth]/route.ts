import {NextAuthOptions, DefaultSession, DefaultUser} from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createClient } from "@/utils/supabase/server";


declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        username: string;
    }

    interface Session {
        user: {
            id: string;
            username: string;
        } & DefaultSession["user"];
    }

    interface JWT {
        id: string;
        username: string;
    }
}

// Modular function to authenticate user with Supabase
async function authenticateUser(username: string, password: string) {
    try {
        const supabase = await createClient();

        // Query user from Supabase
        const { data: user, error } = await supabase
            .from("users")
            .select("id, username, password")
            .eq("username", username)
            .single();

        if (error || !user) {
            return null;
        }

        // Compare the provided password with the stored password hash
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return null;
        }

        // Return user object if authentication is successful
        return {
            id: user.id,
            username: user.username
        };
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
}

// NextAuth options configuration
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Check for missing credentials
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // Authenticate the user
                const user = await authenticateUser(credentials.username, credentials.password);

                // Return user object or null if authentication fails
                return user || null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Attach user info to the JWT token if a user exists
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach user info to the session if a token exists
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/sign-in",  // Custom sign-in page
        error: "/error"      // Error page
    },
    session: {
        strategy: "jwt",      // Use JWT for session management
        maxAge: 30 * 24 * 60 * 60 // Session expires in 30 days
    }
};

// Handler for Next.js API routes
const handler = NextAuth(authOptions);

// Export handler for GET and POST requests
export { handler as GET, handler as POST };