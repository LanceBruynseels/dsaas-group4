export async function fetchProfileData() {
    let apiUrl: string;

    // Check if running on the client-side or server-side
    if (typeof window !== "undefined") {
        // Client-side: use window.location.origin to get the full URL
        apiUrl = `${window.location.origin}/api/settings/get-profile-data`;
    } else {
        // Server-side: assume the server is at the root
        apiUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/settings`;
    }

    const response = await fetch(apiUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error("Failed to fetch profile data");
    }
    return response.json();
}