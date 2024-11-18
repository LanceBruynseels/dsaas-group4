// route.tsx
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const userId = 'abb0c0af-904c-4c52-b19b-5be0fc3da588';
    try {
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
    const { userId, pictureUrl } = await request.json();  // Expecting userId and pictureUrl in the body

    try {
        const supabase = await createClient();

        // Call the new function to update the profile picture URL
        const { error } = await supabase.rpc("set_profile_picture", {
            userid: userId,       // Ensure both parameters are passed correctly
            picture_url: pictureUrl,
        });

        console.log("userid: ", userId);
        console.log("url: ", pictureUrl);

        if (error) {
            console.error("Error updating profile picture:", error);
            return NextResponse.json({ error: "Failed to update profile picture" }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile picture updated successfully" });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}