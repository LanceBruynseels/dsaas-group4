// route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        const supabase = createClient();

        // Validate required fields
        if (!username || !password) {
            return NextResponse.json(
                { error: "Gebruikersnaam en wachtwoord zijn verplicht" },
                { status: 400 }
            );
        }

        // Fetch the user from the database
        const { data: user, error } = await supabase
            .from('users')
            .select('id, password') // Select only necessary fields
            .eq('username', username)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: "Gebruikersnaam niet gevonden of wachtwoord is onjuist" },
                { status: 401 }
            );
        }

        // Verify the password
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return NextResponse.json(
                { error: "Gebruikersnaam niet gevonden of wachtwoord is onjuist" },
                { status: 401 }
            );
        }

        // If successful, you might create a session token or JWT (not shown here)
        return NextResponse.json({
            success: true,
            message: "Inloggen succesvol!",
            userId: user.id,
        });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden tijdens het inloggen" },
            { status: 500 }
        );
    }
}
