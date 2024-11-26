import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { table, minAge, maxAge, user_id } = body; // Expect table, minAge, maxAge, and user_id from the request

        const supabase = await createClient();

        const { data, error } = await supabase
            .from(table)
            .upsert(
                {
                    user_id,
                    min_age: minAge,
                    max_age: maxAge,
                },
                { onConflict: "user_id" })
            .select();

        if (error) {
            console.error("Error updating/inserting age range:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        console.log("Age range updated/inserted successfully:", data);

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error("Request Error:", err);
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}
