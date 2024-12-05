import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { table, minAge, maxAge, user_id } = body;

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

export async function GET(req: Request) {
    try {
        const body = await req.json();
        const {table, user_id } = body;

        if (!user_id) {
            return new Response(JSON.stringify({ error: "Missing required query parameters" }), { status: 400 });
        }

        const supabase = await createClient();

        // Query the database for the specific user_id
        const { data, error } = await supabase
            .from(table)
            .select("min_age, max_age")
            .eq("user_id", user_id)
            .single();

        if (error) {
            console.error("Error fetching age range:", error.message);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        if (!data) {
            return new Response(JSON.stringify({ error: "Age range not found" }), { status: 404 });
        }

        console.log("Fetched age range successfully:", data);

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error("Request Error:", err);
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}