import { createClient } from "@/utils/supabase/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;

    const { data: picture, error } = await supabase.rpc("get_profile_picture", {
        userid: user.id,
    });

    if (error) {
        return NextResponse.json({ error: "Failed to fetch profile picture" }, { status: 500 });
    }

    return NextResponse.json({ user, picture });
}
