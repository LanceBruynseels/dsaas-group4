import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { table, key, user_id } = body; // Get data from client-side request
        const searchTable = `profile_${table}`;
        const search_id = `${table}_id`;

        const supabase = await createClient();

        // Clear existing selections for this user in the table (important for single-select)
        const { error: deleteError } = await supabase
            .from(searchTable)
            .delete()
            .eq("user_id", user_id); // Delete old selection for this user

        if (deleteError) {
            return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
        }

        // Insert the new single selection for this user
        const { data, error: insertError } = await supabase
            .from(searchTable)
            .insert([
                {
                    user_id: user_id, // The user ID
                    [search_id]: key, // The selected key value for the label
                },
            ])
            .select()
            .single(); // Ensure we return only one inserted row

        if (insertError) {
            return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
        }

        return new Response(JSON.stringify(data), { status: 200 }); // Success, return inserted data
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

        // Remove the selection for this user in the table
        const { error } = await supabase
            .from(searchTable)
            .delete()
            .eq("user_id", user_id) // Specific user ID
            .eq(search_id, key); // Match the ID to delete

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Selection removed successfully" }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
}
