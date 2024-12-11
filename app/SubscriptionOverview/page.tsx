"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SubscriptionOverview = () => {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<any | null>(null); // Correctly declaring this state
    const [status, setStatus] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Retrieve subscriptionID from the query parameters
        const subId = searchParams.get("subscriptionID");
        if (subId) {
            setSubscriptionId(subId);
            fetchSubscription(subId); // Fetch subscription details on load
        } else {
            setStatus("No subscription found. Redirecting to login...");
            // Redirect to login if no subscriptionID is found
            setTimeout(() => router.push("/login"), 3000);
        }
    }, [searchParams, router]);

    const fetchSubscription = async (subscriptionID: string) => {
        try {
            const response = await fetch("/api/payment/GetSubscriptionForOverview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriptionID }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch subscription details");
            }

            setSubscriptionData(data); // Save subscription data for the UI
        } catch (error: any) {
            setStatus(`Error fetching subscription: ${error.message}`);
        }
    };

    const handleCancel = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subscriptionId) {
            setStatus("Please provide a subscription ID.");
            return;
        }

        try {
            const res = await fetch("/api/payment/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("Subscription canceled successfully!");
                setSubscriptionData(null); // Clear subscription data after cancellation
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
                    <h2>Subscription Details</h2>
                    {subscriptionData ? (
                        <div>
                            <p><strong>ID:</strong> {subscriptionData.id}</p>
                            <p><strong>Status:</strong> {subscriptionData.status}</p>
                            <p><strong>Start Date:</strong> {new Date(subscriptionData.start_date * 1000).toLocaleDateString()}</p>
                            <p><strong>Next Billing Date:</strong> {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}</p>
                            <p><strong>Price:</strong> {subscriptionData.items.price}</p>


                        </div>
                    ) : (
                        <p>No subscription details available.</p>
                    )}
                </div>
                <div className="flex flex-col w-[50%] h-full bg-orange-600">
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
            </div>
        </div>
    );
};

export default SubscriptionOverview;
