import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import {createClient} from "@/utils/supabase/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { userId, firstName, lastName, dateOfBirth, profileImageUrl } = body;

    if (!userId || !firstName || !lastName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('profile')
            .upsert([
                {
                    user_id: userId,
                    first_name: firstName,
                    last_name: lastName,
                    dob: dateOfBirth || null,
                    profile_picture_url: profileImageUrl || null,
                },
            ]);

        if (error) {
            console.error('Error upserting profile:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Profile updated successfully', data });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
