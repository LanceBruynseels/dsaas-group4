import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export async function uploadAndInsertMessage(messageContent: string) {
    // Generate a unique file name
    const fileName = `messages/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.txt`;

    const contentBlob = new Blob([messageContent], { type: 'text/plain' });

    // Step 1: Upload message content to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('Messages')
        .upload(fileName, contentBlob);

    if (uploadError) {
        console.error('Failed to upload message content:', uploadError.message);
        return null;
    }

    // Step 2: Get the public URL for the uploaded content
    const { data: urlData } = supabase.storage.from('Messages').getPublicUrl(fileName);
    const mediaURL = urlData?.publicUrl;

    if (!mediaURL) {
        console.error('Failed to get public URL for message content');
        return null;
    }

    // Step 3: Insert message record into the database
    const { data: insertData, error: insertError } = await supabase
        .from('message')
        .insert([
            {
                sender: '42a20f25-a201-4706-b8a3-2c4fafa58f4b',
                receiver: '9ba9d983-1b17-49e2-9cc0-9dcd5bd0c9ba',
                mediaURL: mediaURL,
                time_stamp: new Date().toISOString(),
                is_read: false,
            }
        ]);

    if (insertError) {
        console.error('Failed to insert message record:', insertError.message);
        return null;
    }

    return insertData;
}
