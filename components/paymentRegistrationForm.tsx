"use client"; // Make sure the component is treated as a client component in Next.js

import React, { useState } from 'react';

const CreateCustomer = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => { //handels the sumbit of the form
        e.preventDefault();
        setError(null); // Reset any previous errors
        setResponse(null); // Reset the previous response

        try {
            const res = await fetch('/api/payment/registration', { //calls the api to get the data out of the page
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name}),
            });

            if (!res.ok) {
                throw new Error('Failed to create customer');
            }

            const data = await res.json();
            console.log('Customer created:', data);
            setResponse(data); // Save the response data to state
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message); // Save the error message to state
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        console.log("email updated:", e.target.value)
                    }}
                    required
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        console.log("name updated:", e.target.value)
                    }}
                    required
                />
                <button type="submit">Create Customer</button>
            </form>

            {/* Display the response after customer is created */}
            {response && (
                <div>
                    <h3>Customer Created</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {/* Display any errors if the API call fails */}
            {error && (
                <div style={{ color: 'red' }}>
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default CreateCustomer;
