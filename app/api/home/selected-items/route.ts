import {NextResponse} from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { user_id, table} = body;

    if (!user_id || !table) {
        return NextResponse.json({ error: 'Invalid or missing request body' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(`search_${table}`)
        .select(`${table}_id`)
        .eq('user_id', user_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data successfully updated', data }, { status: 200 });
}
