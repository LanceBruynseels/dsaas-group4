import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Handle POST requests
export async function POST(req: NextRequest) {
    const supabase = await createClient();

    try {
        const body = await req.json();
        const { actionType, userId, currentMatch } = body;

        if (!actionType || !userId) {
            return NextResponse.json(
                { error: "Invalid request payload" },
                { status: 400 }
            );
        }

        // Insert the action into the database
        const { error } = await supabase
            .from("interaction")
            .insert({ user_id: userId, target_user_id: currentMatch, status: actionType });

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Failed to save action" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods if needed
export function GET() {
    return NextResponse.json(
        { message: "This endpoint only supports POST requests" },
        { status: 405 }
    );
}
