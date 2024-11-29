import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createClient } from "@/utils/supabase/server";


declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            is_accepted: boolean; //
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        username: string;
        is_accepted: boolean;
    }
}
export const authOptions: NextAuthOptions = {
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
                    // create an async context
                    const getSupabaseClient = async () => {
                        return await createClient();
                    };

                    // console.log('Attempting to fetch user');

                    const supabase = await getSupabaseClient();

                    const { data: user, error } = await supabase
                        .from('users')
                        .select('id, username, password, is_accepted')
                        .eq('username', credentials.username)
                        .single();

                    // console.log('Database response:', { user, error });

                    if (error || !user) {
                        return null;
                    }

                    // check if the acct is accepted
                    if (!user.is_accepted) {
                        throw new Error("Uw account is nog niet goedgekeurd. Neem contact op met uw begeleider.");
                    }

                    const isValidPassword = await compare(credentials.password, user.password);

                    if (!isValidPassword) {
                        return null;
                    }

                    return {
                        id: user.id,
                        username: user.username,
                        is_accepted: user.is_accepted // remove??
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            // console.log('JWT Callback:', { token, user, trigger });

            if (user) {
                // Initial sign in
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    name: user.username //username as name
                };
            }
            // On subsequent calls, token already contains the user info, GOOD!
            return token;
        },
        async session({ session, token, user, trigger }) {
            // console.log('Session Callback:', { session, token, trigger });

            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.name = token.username as string; //username as name
            }

            // console.log('Returning session:', session);
            return session;
        },
        async signIn({ user, account, profile, credentials }) {
            // console.log('SignIn Callback:', { user, account, credentials });
            return true;
        },
        // async redirect({ url, baseUrl }) {
        //     // console.log('Redirect Callback:', { url, baseUrl });
        //     return url.startsWith(baseUrl) ? url : baseUrl;
        // }
    },
    pages: {
        signIn: '/sign-in',
        error: '/error'
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    }
};