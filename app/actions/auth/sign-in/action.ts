// action.ts
interface LoginData {
    username: string;
    password: string;
}

export async function login(formData: FormData) {
    const data: LoginData = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
    };

    const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        redirect: 'follow',
    });

    const responseData = await response.json();

    if (response.redirected) {
        // Handle redirection in the response
        return {
            success: true,
            redirect: response.url
        };
    }

    if (!response.ok) {
        // Correct the error handling here
        return {
            success: false,
            error: responseData.error || 'Log in mislukt. Probeer het opnieuw.'
        };
    }

    // Return the server response data (assuming it contains a redirect URL)
    return {
        success: true,
        data: responseData.message,
        redirect: responseData.redirect.destination // use the destination from server response
    };
}
