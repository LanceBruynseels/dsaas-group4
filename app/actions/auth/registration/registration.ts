'use server'

interface RegistrationResponse {
    success: boolean;
    error?: string;
    data?: any;
    redirect?: {
        destination: string;
        message: string;
    };
}

export async function register(formData: FormData): Promise<RegistrationResponse> {
    try {
        // get data
        const username = formData.get("username") as string;
        const first_name = formData.get("first_name") as string;
        const last_name = formData.get("last_name") as string;
        const password = formData.get("password") as string;
        const facility = formData.get("facility") as string;
        const supervisor = formData.get("supervisor") as string;
        const is_accepted = false;  // false by default

        if (!username || !password || !facility || !supervisor) {
            return {
                success: false,
                error: 'Alle velden zijn verplicht.'
            };
        }

        // invoke api
        const response = await fetch('/api/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                first_name,
                last_name,
                password,
                facility,
                supervisor,
                is_accepted
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: responseData.error || 'Registratie mislukt. Probeer het opnieuw.'
            };
        }

        return {
            success: true,
            data: responseData.data,
            redirect: responseData.redirect
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: 'Er is een onverwachte fout opgetreden.'
        };
    }
}