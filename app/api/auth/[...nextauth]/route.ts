import NextAuth from "next-auth";
import {authOptions} from "@/lib/auth";
// import { handler as authHandler } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };