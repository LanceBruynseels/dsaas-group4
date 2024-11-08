'use server'

interface RegistrationResponse {
    success: boolean;
    error?: string;
    data?: any;
}

export async function register(formData: FormData): Promise<RegistrationResponse> {
    try {
        // get data
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const facility = formData.get("facility") as string;
        const supervisor = formData.get("supervisor") as string;

        // do we need this, seems like FE already handled this
        if (!username || !password || !facility || !supervisor) {
            return {
                success: false,
                error: 'Alle velden zijn verplicht11.'
            };
        }

        // call api
        const response = await fetch('http://localhost:3000/api/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                facility,
                supervisor
            }),
        });

        const responseData = await response.json();

        // return api response
        if (!response.ok) {
            return {
                success: false,
                error: responseData.error || 'Registratie mislukt. Probeer het opnieuw.'
            };
        }

        // return success response
        return {
            success: true,
            data: responseData.data
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: 'Er is een onverwachte fout opgetreden.'
        };
    }
}