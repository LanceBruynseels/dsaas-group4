import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {MatchingUser} from "@components/matchingCard";

export async function POST(req : NextRequest) {
    const supabase = await createClient();

    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call the `find_potential_matches` function
        const { data: matchData, error: matchProfileError } = await supabase.rpc(
            'find_potential_matches',
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
        // console.log("typedMatchData: ", typedMatchData);

        let publicUrls = [];
        let allMatchData: MatchingUser[];

        // Get public URLs for the first match's pictures
        if (typedMatchData && typedMatchData.length > 0) {
            // Use Promise.all to wait for all asynchronous operations
            allMatchData = await Promise.all(
                typedMatchData.map(async (match) => {
                    const { data: fileList, error: listError } = await supabase
                        .storage
                        .from('picturesExtra') // The storage bucket name
                        .list(match.user_id);

                    if (listError) {
                        console.error(`Error listing files for user_id ${match.user_id}:`, listError);
                        return { ...match, publicUrls: [] }; // Default to empty array on error
                    }

                    // Generate public URLs for each file
                    const publicUrls = fileList.map((file) =>
                        supabase.storage.from('picturesExtra').getPublicUrl(`${match.user_id}/${file.name}`).data.publicUrl
                    );

                    // console.log("match:", match);
                    // console.log("publicUrls", publicUrls);

                    // Return the enriched match object
                    return { ...match, publicUrls };
                })
            );
        }

        //console.log("allMatchData: ", allMatchData);

        // Respond with match data and picture URLs
        return new Response(
            JSON.stringify({
                allMatchData
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
