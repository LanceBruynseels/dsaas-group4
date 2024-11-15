import { createClient } from '@/utils/supabase/client';

export default async function Notes() {
    const supabase = createClient();

    // Fetch notes data
    const { data: notes } = await supabase.from("notes").select();

    // Get the public URL for the profile image
    const { data: imageData } = supabase.storage.from('Profiles').getPublicUrl('TestProfile/ProfileIcon.jpg');
    const imageUrl = imageData?.publicUrl;

    // Fetch and parse the profile info JSON file
    const { data: profileInfoData } = await supabase.storage.from('Profiles').download('TestProfile/profileinfo.json');
    let profileInfo = null;

    if (profileInfoData) {
        const text = await profileInfoData.text();
        profileInfo = JSON.parse(text);
    }



    return (
        <div>
            <pre>{JSON.stringify(notes, null, 2)}</pre>
            {imageUrl && <img src={imageUrl} alt="Profile icon" />}

            {profileInfo && (
                <div>
                    <h3>Profile Information</h3>
                    <pre>{JSON.stringify(profileInfo, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
