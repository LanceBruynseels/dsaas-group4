"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    useStripe,
    useElements,
    CardElement
} from "@stripe/react-stripe-js";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe and pass the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm = ({ productData }) => {
    const { productId } = useParams(); // Get productId from the URL
    const router = useRouter(); // Router for redirection
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [institution, setInstitution] = useState("");
    const [password, setPassword] = useState("");
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
                setup_future_usage: "off_session", // Save card for future subscriptions
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            console.log("Payment successful:");

            // Redirect to the subscription completed page
            router.push(`/subscriptionComplete?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
            <div className="flex lg:flex-row flex-col-reverse  w-[70%] h-[90%]">
                <div className="flex flex-row justify-center w-[50%] h-full p-[5%] rounded-l-3xl border-red-950 lg:border-t-4 border-l-4 lg:border-b-4 border-r-4 lg:border-r-0 ">
                    <form onSubmit={handleSubmit} className="flex w-full flex-col justify-between items-center gap-[5%]">
                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="text"
                            placeholder="Institution Name"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            required
                        />

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Stripe Card Elements */}
                        <div className="w-full h-fit bg-white p-2 rounded-xl ">
                            <CardElement
                                options={{
                                    hidePostalCode: true,
                                    style: {
                                        base: {
                                            fontSize: "4vw",
                                            color: "#32325d",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                    },
                                }}
                                className="w-full h-full bg-white border-none"
                            />
                        </div>

                        {/* Checkbox for terms and conditions */}
                        <div className="flex items-center gap-2">
                            <Checkbox id="agree"/>
                            <Label htmlFor="agree" className="flex">
                                I agree with the&nbsp;
                                <Link href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                    terms and conditions
                                </Link>
                            </Label>
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            className="w-full h-fit text-[200%] bg-red-950 hover:bg-red-300"
                        >
                            {loading ? "Processing..." : "Register new account"}
                        </Button>

                        {/* Show error message if there's any */}
                        {error && (
                            <div className="text-red-600 mt-4">
                                <p>{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="flex flex-col justify-center items-end w-[50%] h-full ">
                    <div className="flex flex-col justify-center items-center w-full h-full bg-white border-red-950 border-t-4 border-r-4 border-b-4 gap-8 rounded-r-3xl shadow-black p-4">
                        <div className="flex flex-row justify-center w-[60%] aspect-square">
                            <img src="/vlinder.png" alt="Vlinder Logo" className="w-full h-full" />
                        </div>
                        <div className="flex flex-col justify-center h-fit w-[90%] text-center">
                            <h1 className="text-[400%]">€ {productData?.price / 100}</h1>
                            <p className="text-[120%]">{productData?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default PaymentForm;
