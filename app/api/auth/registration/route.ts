import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { username, password, facility, supervisor } = await request.json();
        const supabase = await createClient();



        if (!username || !password || !facility || !supervisor) {
            return NextResponse.json(
                { error: "Alle velden zijn verplicht" },
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
                    password: hashedPassword,
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