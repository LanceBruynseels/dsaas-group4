"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SubscriptionCompleted = () => {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve email and password from the query parameters
        const queryEmail = searchParams.get("email");
        const queryPassword = searchParams.get("password");

        if (queryEmail) setEmail(queryEmail);
        if (queryPassword) setPassword(queryPassword);
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setStatus("Error: Profile data not available. Please try again later.");
            return;
        }

        try {
            const res = await fetch("/api/payment/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to the SubscriptionOverview page with subscriptionID as a query parameter
                window.location.href = `/SubscriptionOverview?subscriptionID=${data.subscriptionID}`;
            } else {
                setStatus(`Login failed: ${data.error}`);
            }
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <div className="lg:w-[45%] w-[80%] flex flex-col items-center justify-center h-full text-center gap-[2.5%]">
                <div className="flex flex-col justify-center items-center h-[40%]">
                    <img src="/vlinder.png" alt="Vlinder Logo" className="w-full h-full aspect-square" />
                </div>
                <h1 className="text-4xl font-bold">Subscription Successful!</h1>
                <p className="mt-4 text-lg">Thank you for subscribing. A confirmation email has been sent to your inbox.</p>
                <p className="mt-4 text-lg">You can manage your subscription in your profile.</p>
                {status && <p className="text-red-600">{status}</p>}
                <button
                    onClick={handleLogin}
                    className="bg-red-950 hover:bg-red-300 text-white rounded-2xl p-[3%] text-[150%] w-[80%]"
                >
                    Profile
                </button>
            </div>
        </div>
    );
};

export default SubscriptionCompleted;
