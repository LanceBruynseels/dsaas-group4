"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@components/paymentRegistrationForm";
import { Spinner } from "flowbite-react";

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
        return (
            <div className="flex flex-col justify-center items-center w-screen h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-950"></div>
                <p className="text-red-950 mt-4 text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center w-screen  h-screen p-4">
            <Elements stripe={stripePromise}>
                <PaymentForm productData={productData}/>
            </Elements>
        </div>
    );
};

export default PaymentPage;