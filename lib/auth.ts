import { NextAuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createClient } from "@/utils/supabase/server";
import {JWT} from "next-auth/jwt";




interface CustomUser {
    username: string;
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
}

declare module "next-auth" {
    interface User extends CustomUser {}

    interface Session {
        user: CustomUser & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<CustomUser | null> {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const supabase = createClient();

                const { data: user, error } = await supabase
                    .from('users')
                    .select('id, username, password, email, name, image')
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
                    username: user.username,
                    name: user.name || user.username,
                    email: user.email,
                    image: user.image
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
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
        maxAge: 30 * 24 * 60 * 60
    }
};
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
// // Export the GET and POST handlers
// export const GET = handler;
// export const POST = handler;