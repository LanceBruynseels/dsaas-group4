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
        async jwt({ token, user, account, profile, trigger }) {
            console.log('JWT Callback:', { token, user, trigger });

            if (user) {
                // Initial sign in
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    name: user.username //username as name
                };
            }
            // On subsequent calls, token already contains the user info, good!
            return token;
        },
        async session({ session, token, user, trigger }) {
            console.log('Session Callback:', { session, token, trigger });

            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.name = token.username as string; //username as name
            }

            console.log('Returning session:', session);
            return session;
        },
        async signIn({ user, account, profile, credentials }) {
            console.log('SignIn Callback:', { user, account, credentials });
            return true;
        },
        async redirect({ url, baseUrl }) {
            console.log('Redirect Callback:', { url, baseUrl });
            return url.startsWith(baseUrl) ? url : baseUrl;
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