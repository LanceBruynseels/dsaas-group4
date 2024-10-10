import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("dsaas-group4").select();

    return <pre>{JSON.stringify(notes, null, 2)}</pre>
}