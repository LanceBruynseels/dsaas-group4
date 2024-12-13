'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Child Component for Logic
const SubscriptionOverviewContent = () => {
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<any | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [price, setPrice] = useState<number>(0);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const subId = searchParams.get("subscriptionID");
        if (subId) {
            setSubscriptionId(subId);
            fetchSubscription(subId);
        } else {
            setStatus("No subscription found. Redirecting to login...");
            setTimeout(() => router.push("/login"), 3000);
        }
    }, [searchParams, router]);

    const fetchSubscription = async (subscriptionID: string) => {
        try {
            const response = await fetch("/api/payment/GetSubscriptionForOverview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionID }),
            });
            const data = await response.json();

            if (data.items[0].price === "price_1QSzgWFAdne61edZzyAVKxmL") setPrice(1250);
            if (data.items[0].price === "price_1QSzh3FAdne61edZ2PH2A12E") setPrice(2000);
            if (data.items[0].price === "price_1QSzZhFAdne61edZ3dAkq4b") setPrice(3000);

            if (!response.ok) throw new Error(data.error || "Failed to fetch subscription details");

            setSubscriptionData(data);
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
            const res = await fetch("/api/payment/CancelSubscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus("Subscription canceled successfully!");
                setSubscriptionData(null);
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error: any) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col pt-8 items-center bg-red-50">
            <h1 className="text-[400%] text-red-950 py-[1%] px-[5%] text-center">Subscription Overview</h1>

            <div className="flex flex-row w-[90%] justify-center">
                <div className="flex border-2 border-gray-400 flex-col px-8 rounded-xl shadow-md p-6 m-4">
                    <h1 className="text-xl text-center font-bold w-full mb-4">Subscription Details</h1>
                    {subscriptionData ? (
                        <div>
                            <p><strong>ID:</strong> {subscriptionData.subscriptionId}</p>
                            <p><strong>Status:</strong> {subscriptionData.status}</p>
                            <p><strong>Start Date:</strong> {new Date(subscriptionData.start_date * 1000).toLocaleDateString()}</p>
                            <p><strong>Next Billing Date:</strong> {new Date(subscriptionData.current_period_end * 1000).toLocaleDateString()}</p>
                            <p><strong>Price:</strong> {price}</p>
                        </div>
                    ) : (
                        <p>No subscription details available.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col rounded-xl text-white shadow-md p-4 m-4 bg-red-600">
                <form onSubmit={handleCancel}>
                    <input
                        className="hidden"
                        type="text"
                        placeholder="Enter Subscription ID"
                        value={subscriptionId || ""}
                        onChange={(e) => setSubscriptionId(e.target.value)}
                        required
                    />
                    <button type="submit" className="font-bold">Cancel Subscription</button>
                </form>
                {status && <p>{status}</p>}
            </div>
        </div>
    );
};

// Main Component
const SubscriptionOverview = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionOverviewContent />
    </Suspense>
);

export default SubscriptionOverview;
