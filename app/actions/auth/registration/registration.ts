interface RegisterData {
    username: string;
    password: string;
    facility: string;
    supervisor: string;
}

export async function register(formData: FormData) {
    const data = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        facility: formData.get("facility") as string,
        supervisor: formData.get("supervisor") as string,
    };

    // checking the url to ensure the route is correct
    const response = await fetch('/api/auth/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }

    return response.json();
}
