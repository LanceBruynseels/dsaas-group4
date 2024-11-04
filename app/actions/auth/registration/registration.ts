"use server";

import { createClient } from "@/utils/supabase/server";

// add prevState param
export async function registerAction(prevState: any, formData: FormData) {
    const supabase = createClient();

    try {

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const facility = formData.get("facility") as string;
        const supervisor = formData.get("supervisor") as string;

        console.log("received form:", {
            username,
            facility,
            supervisor
        });


        if (!username || !password || !facility || !supervisor) {
            return {
                error: "Alle velden zijn verplicht"
            };
        }

        // insert data to table 'users'
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    password,
                    facility,
                    supervisor
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("database error:", error);
            return {
                error: "Registratie mislukt. Probeer het opnieuw."
            };
        }

        return {
            success: "Registratie succesvol!"
        };

    } catch (error) {
        console.error("error:", error);
        return {
            error: "Er is een fout opgetreden"
        };
    }
}