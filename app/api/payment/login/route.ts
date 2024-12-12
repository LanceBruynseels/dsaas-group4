import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: user, error } = await supabase
            .from("Buyers")
            .select("email, password, subscriptionID")
            .eq("email", email)
            .single();

        if (error) {
            console.error("User not found:", error.message);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Return the subscriptionId to the frontend
        return NextResponse.json({ subscriptionID: user.subscriptionID});

    } catch (error: any) {
        console.error("Error during login:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
