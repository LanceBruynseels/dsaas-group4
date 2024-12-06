// route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        const supabase = await createClient();

        // Validate required fields
        if (!username || !password) {
            return NextResponse.json(
                { error: "Gebruikersnaam en wachtwoord zijn verplicht" },
                { status: 400 }
            );
        }

        // Use Supabase Auth signInWithPassword
        // const { data, error } = await supabase.auth.signInWithPassword({
        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password
        });

        if (error) {
            return NextResponse.json(
                { error: "Gebruikersnaam niet gevonden of wachtwoord is onjuist" },
                { status: 401 }
            );
        }

        // success
        return NextResponse.json({
            success: true,
            message: "Inloggen succesvol!",
            session: data.session,
            redirect: {
                destination: '/home'
            }
        });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden tijdens het inloggen" },
            { status: 500 }
        );
    }
}