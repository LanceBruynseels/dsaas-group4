import {createClient} from '@/utils/supabase/server';

async function validateCode(code) {
    const supabase = await createClient;

    const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code)
        .eq('is_used', false)
        .single();

    if (error || !data) {
        console.error('Invalid or already used code:', error?.message || 'Code not found');
        return false;
    }

    // Mark the code as used
    const { error: updateError } = await supabase
        .from('access_codes')
        .update({ is_used: true })
        .eq('code', code);

    if (updateError) {
        console.error('Error marking code as used:', updateError.message);
        return false;
    }

    console.log('Code validated and marked as used:', code);
    return true;
}


