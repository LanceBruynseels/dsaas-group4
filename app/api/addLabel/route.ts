import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { table, key } = body; // Get data from client-side request
        console.log("Request Body:", body);
        const searchTable = `search_${table}`;
        console.log(searchTable);
        const search_id = `${table}_id`;
        console.log(search_id)

        const supabase = await createClient();
        const { data, error } = await supabase
            .from(searchTable)
            .insert([
                {
                    user_id: "abb0c0af-904c-4c52-b19b-5be0fc3da588", // user id from a user account that i made by inserting into the database
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
