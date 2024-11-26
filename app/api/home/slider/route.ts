// api/settings/slider/route.ts
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { table, key, user_id } = body; // Expect table, key (value), and user_id from the request

        const supabase = await createClient();

        const { data, error } = await supabase
            .from(table)
            .update({ distance: key })
            .eq('user_id', user_id)
            .select()

        if (error) {
            console.error('Error updating distance:', error.message);
        } else {
            console.log('Distance updated successfully:', data);
        }


        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        console.error("Request Error:", err);
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}
