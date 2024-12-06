import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req : NextRequest) {
    const supabase = await createClient();

    try {
        const body = await req.json();
        const { userId } = body;
        console.log("FETCHING NEW MATCHES:");
        console.log("user_id:", userId);

        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call the `find_potential_matches` function
        const { data: matchData, error: matchProfileError } = await supabase.rpc(
            'add_potential_match',
            { request_user_id: userId }
        );

        if (matchProfileError) {
            console.error('Error fetching matches:', matchProfileError);
            return new Response(JSON.stringify({ error: 'Error fetching matches' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!matchData || matchData.length === 0) {
            return new Response(JSON.stringify({ error: 'No matches found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const typedMatchData = matchData; // Ensure proper typing if needed
        let publicUrls = [];

        // Get public URLs for the first match's pictures
        const { data: fileList, error: listError } = await supabase.storage
            .from('picturesExtra') // Storage bucket name
            .list(typedMatchData[0].user_id);

        if (listError) {
            console.error('Error listing files:', listError);
            return new Response(JSON.stringify({ error: 'Error retrieving file list' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (fileList) {
            publicUrls = fileList.map((file) =>
                supabase.storage
                    .from('picturesExtra')
                    .getPublicUrl(`${typedMatchData[0].user_id}/${file.name}`).data.publicUrl
            );
        }

        //console.log(typedMatchData[0]);
        //console.log(publicUrls);

        // Respond with match data and picture URLs
        return new Response(
            JSON.stringify({
                ...typedMatchData[0], // Spread the data to return it as a flat object
                publicUrls: publicUrls, // Add publicUrls to the same level
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response(JSON.stringify({ error: 'Unexpected server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
