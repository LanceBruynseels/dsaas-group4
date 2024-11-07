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
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
}
