import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const {
            username,
            first_name,
            last_name,
            password,
            institution_id,
            caretaker_id
        } = await request.json();

        const supabase = await createClient();

        if (!username || !password || !institution_id || !caretaker_id) {
            return NextResponse.json(
                { error: "Alle velden zijn verplicht" },
                { status: 400 }
            );
        }

        // Verify that the username is not already taken
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Deze gebruikersnaam is al in gebruik" },
                { status: 400 }
            );
        }

        // Verify that the institution exists
        const { data: institutionCheck, error: institutionError } = await supabase
            .from('institutions')
            .select('id')
            .eq('id', institution_id)
            .single();

        if (institutionError || !institutionCheck) {
            return NextResponse.json(
                { error: "Ongeldige organisatie geselecteerd" },
                { status: 400 }
            );
        }

        // Verify that the caretaker exists and has role "caretaker"
        const { data: caretakerCheck, error: caretakerError } = await supabase
            .from('caretakers')
            .select('id')
            .eq('id', caretaker_id)
            .eq('role', 'caretaker')
            .single();

        if (caretakerError || !caretakerCheck) {
            return NextResponse.json(
                { error: "Ongeldige begeleider geselecteerd" },
                { status: 400 }
            );
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    first_name,
                    last_name,
                    password: hashedPassword,
                    institution_id,
                    caretaker_id,
                    is_accepted: false,
                    is_banned: false
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

        // return success with redirect information
        return NextResponse.json({
            success: true,
            data: data,
            redirect: {
                destination: '/sign-in',
                // message: 'Registratie succesvol! Je wordt doorgestuurd naar de inlogpagina.'
            }

        });

    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Er is een fout opgetreden" },
            { status: 500 }
        );
    }
}