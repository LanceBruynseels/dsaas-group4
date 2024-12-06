
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('facilities').select('*');

    if (error) {
        return new Response('Error fetching data', { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
}
