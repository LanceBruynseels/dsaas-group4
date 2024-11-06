import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { username, password, facility, supervisor } = await request.json();
        const supabase = createClient();

        // Validate all required fields
        if (!username || !password || !facility || !supervisor) {
            return NextResponse.json(
                { error: "Alle velden zijn verplicht" },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    password,  // Note: In production, ensure password is hashed
                    facility,
                    supervisor
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json(
                { error: "Registratie mislukt. Probeer het opnieuw." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden" },
            { status: 500 }
        );
    }
}