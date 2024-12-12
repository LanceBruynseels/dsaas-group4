"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const SubscriptionCompleted = () => {
    const searchParams = useSearchParams();
    const [sub, setSub] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        // SUBid
        const querySub = searchParams.get("subscription");

        if (querySub) setSub(querySub);
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!sub ) {
            setStatus("Error: Profile data not available. Please try again later.");
            return;
        }
        else{
            // Redirect to the SubscriptionOverview page with subscriptionID as a query parameter
            window.location.href = `/SubscriptionOverview?subscriptionID=${sub}`;}


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
