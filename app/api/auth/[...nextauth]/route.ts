import { NextAuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createClient } from "@/utils/supabase/server";


declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        username: string;
    }
}

// export const authOptions: NextAuthOptions = {
// changed to const to resolving pipeline failure
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    const supabase = await createClient();

                    const { data: user, error } = await supabase
                        .from('users')
                        .select('id, username, password')
                        .eq('username', credentials.username)
                        .single();

                    if (error || !user) {
                        return null;
                    }

                    const isValidPassword = await compare(credentials.password, user.password);

                    if (!isValidPassword) {
                        return null;
                    }

                    return {
                        id: user.id,
                        username: user.username
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
        error: '/error'
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };