"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentForm = () => {
    const { productId } = useParams(); // Get productId from the URL
    const router = useRouter(); // Router for redirection
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [institution, setInstitution] = useState("");
    const [password, setPassword] = useState(""); // Password field
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe.js is not loaded");
            setLoading(false);
            return;
        }

        try {
            // Call your backend to create a subscription and PaymentIntent
            const res = await fetch("/api/payment/CreatePaymentIntent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    email,
                    name,
                    phone,
                    institution,
                    password, // Include password in the payload
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create PaymentIntent");
            }

            const { clientSecret, customerId } = await res.json();

            // Confirm the payment with Stripe
            const cardElement = elements.getElement(CardElement);
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name,
                        email,
                        phone,
                    },
                },
                setup_future_usage: "off_session", // Save the card for future subscriptions
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            console.log("Payment successful:", paymentIntent);

            // Redirect to the subscription completed page
            router.push("/subscriptionComplete")
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Institution Name"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <CardElement options={{ hidePostalCode: true }} />

            <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Subscribe"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default PaymentForm;
