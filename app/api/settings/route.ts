import {NextRequest, NextResponse} from "next/server";
import {createClient} from "@/utils/supabase/server";
import {getServerSession} from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import {redirect} from "next/navigation";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session.user.id;

        const supabase = await createClient();
        const { data: profileData, error: profileError } = await supabase.rpc("get_all_profile_data", { userid: userId });
        const { data: filterData, error: filterError } = await supabase.rpc("get_all_filter_data");
        const { data: profilePicture, error: pictureError} = await supabase.rpc("get_profile_picture", {userid: userId})

        if (profileError || filterError) {
            console.error("Error fetching profile or filter data:", profileError || filterError);
            return NextResponse.json({ error: "Failed to fetch settings data" }, { status: 500 });
        }

        return NextResponse.json({
            profile: profileData,
            filters: filterData,
            picture: profilePicture,
        });
    } catch (error) {
        console.error("Unexpected server error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { picture_url, userId } = body;

        if (!picture_url || !userId) {
            console.error("Invalid request payload:", body);
            return NextResponse.json(
                { error: "Missing required fields: userId or picture_url" },
                { status: 400 }
            );
        }

        console.log("Updating profile picture for:", { userId, picture_url });

        const supabase = await createClient();
        const { error } = await supabase.rpc("set_profile_picture", {
            userid: userId,
            picture_url: picture_url,
        });

        if (error) {
            console.error("Error updating profile picture:", error);
            return NextResponse.json(
                { error: "Failed to update profile picture" },
                { status: 500 }
            );
        }

        console.log("Profile picture updated successfully:", picture_url);
        return NextResponse.json({ message: "Profile picture updated successfully" });
    } catch (error: any) {
        console.error("Unexpected error:", error.message || error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Update Date of Birth
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userid, dob } = body;
        console.log(body)
        console.log("Received DOB:", dob);       // Log received DOB
        console.log("Received User ID:", userid); // Log received user ID

        if (!userid || !dob) {
            return NextResponse.json(
                { error: "Missing required fields: userId or dob" },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { error } = await supabase.rpc("set_new_dob", {
            userid: userid,
            dob: dob,
        });

        if (error) {
            console.error("Supabase RPC Error:", error); // Log Supabase error
            return NextResponse.json({ error: "Failed to update DOB" }, { status: 500 });
        }

        console.log("DOB updated successfully for User ID:", userid);
        return NextResponse.json({ message: "DOB updated successfully" });
    } catch (error: any) {
        console.error("Unexpected error in PUT handler:", error.message || error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
