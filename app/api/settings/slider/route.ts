import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);
        const { table, key, user_id } = body; // Expect table, key (value), and user_id from the request

        const supabase = await createClient();

        // Perform the upsert operation
        const { data, error } = await supabase
            .from(table)
            .upsert(
                { user_id, distance: key }, // Upsert data
                { onConflict: "user_id" }   // Specify the unique constraint
            )
            .select();

        if (error) {
            console.error("Error updating distance:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        console.log("Distance updated successfully:", data);

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error("Request Error:", err);
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}

