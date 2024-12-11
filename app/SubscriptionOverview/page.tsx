"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SubscriptionOverview = () => {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Retrieve subscriptionID from the query parameters
        const subId = searchParams.get("subscriptionID");
        if (subId) {
            setSubscriptionId(subId);
        } else {
            setStatus("No subscription found. Redirecting to login...");
            // Redirect to login if no subscriptionID is found
            setTimeout(() => router.push("/login"), 3000);
        }
    }, [searchParams, router]);

    const handleCancel = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subscriptionId) {
            setStatus("Please provide a subscription ID.");
            return;
        }

        try {
            const res = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("Subscription canceled successfully!");
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error: any) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-purple-600">
            <h1 className="text-[400%] bg-red-950 text-white py-[1%] px-[5%]">Subscription Overview</h1>

            <div className="flex flex-row w-[90%] h-full">
                <div className="flex flex-col w-[50%] h-full bg-green-300">

                </div>
                <div className="flex flex-col w-[50%] h-full bg-orange-600">

                </div>

            </div>


            <h2>Cancel Your Subscription</h2>
            <form onSubmit={handleCancel}>
                <input
                    type="text"
                    placeholder="Enter Subscription ID"
                    value={subscriptionId || ""}
                    onChange={(e) => setSubscriptionId(e.target.value)}
                    required
                />
                <button type="submit">Cancel Subscription</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default SubscriptionOverview;
