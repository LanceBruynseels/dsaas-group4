// api/settings/label/route.ts
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { table, key, user_id } = body; // Get data from client-side request
        const searchTable = `profile_${table}`;
        const search_id = `${table}_id`;

        const supabase = await createClient();
        const { data, error } = await supabase
            .from(searchTable)
            .insert([
                {
                    user_id: user_id, // user id from a user account that i made by inserting into the database
                    [search_id]: key,
                },
            ])
            .select()
            .single();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        const { table, key, user_id } = body; // Get data from client-side request
        const searchTable = `profile_${table}`;
        const search_id = `${table}_id`;

        const supabase = await createClient();
        const { error } = await supabase
            .from(searchTable)
            .delete()
            .eq("user_id", user_id) // Specific user ID
            .eq(search_id, key); // Match the ID to delete

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Row deleted successfully" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}