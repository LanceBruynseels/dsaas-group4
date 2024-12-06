"use client";

import React, {useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";


const PaymentForm = ({productData}) => {
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
                setup_future_usage: "off_session", // Save card for future subscriptions
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            console.log("Payment successful:");

            // Redirect to the subscription completed page
            router.push("/subscriptionComplete")
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row justify-center items-center w-full h-fit overflow-y-hidden">
            <div className="flex flex-col justify-between items-center w-1/3 h-screen p-12">
                <div className="h-1/2 aspect-square">
                    <img src="/vlinder.png" alt="Vlinder Logo"/>
                </div>
                <div className="flex flex-col w-full h-1/2 text-center">
                    <h1 className="text-[5vw]">
                        € {productData?.price/100}
                </h1>
                    <p className="text-[2vw]">
                        {productData?.description}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center p-8 gap-8 w-2/3 h-screen border-l-4 border-red-950 my-16">
                <input className="flex w-1/2 aspect-[10/1] text-[2vw] rounded-xl "
                       type="email"
                       placeholder="Email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                />
                <input className="flex w-1/2 aspect-[10/1] text-[2vw] rounded-xl "
                       type="text"
                       placeholder="Name"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       required
                />
                <input className="flex w-1/2 aspect-[10/1] text-[2vw] rounded-xl"
                       type="tel"
                       placeholder="Phone Number"
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       required
                />
                <input className="flex w-1/2 aspect-[10/1] text-[2vw]  rounded-xl"
                       type="text"
                       placeholder="Institution Name"
                       value={institution}
                       onChange={(e) => setInstitution(e.target.value)}
                       required
                />
                <input className="flex w-1/2 aspect-[10/1] text-[2vw] rounded-xl"
                       type="password"
                       placeholder="Password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                />

                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: "6vw",
                                color: "#32325d",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                        },
                    }}
                    className="w-1/2 aspect-[10/1] bg-white  "
                />


                <button type="submit" disabled={loading}
                        className="bg-red-600 rounded-2xl hover:bg-red-300 text-white px-24 py-4">
                    {loading ? "Processing..." : "Subscribe"}
                </button>

                {error && <p style={{color: "red"}}>{error}</p>}
            </form>

        </div>


    );
};

export default PaymentForm;
