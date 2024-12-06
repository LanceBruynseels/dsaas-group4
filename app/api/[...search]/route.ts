import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const table = searchParams.get('table');

    if (!user_id || !table) {
        return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(`search_${table}`)
        .select(`${table}_id`)
        .eq('user_id', user_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}

export async function POST(req: Request) {
    const body = await req.json();
    const { user_id, table, selectedItems } = body;

    if (!user_id || !table || !Array.isArray(selectedItems)) {
        return NextResponse.json({ error: 'Invalid or missing request body' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(`search_${table}`)
        .upsert(
            selectedItems.map((id) => ({
                user_id,
                [`${table}_id`]: id,
            })),
            { onConflict: `${table}_id` }
        );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data successfully updated', data }, { status: 200 });
}
