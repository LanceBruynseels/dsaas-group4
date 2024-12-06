"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@components/paymentRegistrationForm";

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);


const PaymentPage = () => {
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use the useParams hook to get the productId from the URL
    const { productId } = useParams();

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await fetch(`/api/payment/products/${productId}`); // Fetch product details from your API
                if (!res.ok) {
                    throw new Error("Failed to fetch product data");
                }
                const data = await res.json(); // Parse the JSON data
                setProductData(data); // Store it in state
            } catch (error) {
                console.error("Error fetching product data:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProductData();
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>; // Display loading message while data is being fetched
    }

    return (
       <div className="flex flex-col w-screen h-screen">
            <Elements stripe={stripePromise}>
                <PaymentForm productData={productData} />
            </Elements>
        </div>
    );
};

export default PaymentPage;
