"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {useStripe, useElements, CardElement} from "@stripe/react-stripe-js";
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
    const [password2, setPassword2] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [institution, setInstitution] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [institutionError, setInstitutionError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [password2Error, setPassword2Error] = useState<string | null>(null);

    //Check email
    const handleEmailBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const email = event.target.value;

        if (!email) return;

        try {
            const response = await fetch('/api/payment/checkEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!result.available) {
                setEmailError("Dit e-mailadres is al in gebruik.");
            } else {
                setEmailError(null);
            }
        } catch (error) {
            setEmailError("Fout bij het controleren van e-mailadres beschikbaarheid.");
        }
    };

    //Check institution
    const handleInstitutionBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const institution = event.target.value;

        if (!institution) return;

        try {
            const response = await fetch('/api/payment/checkInstitution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ institution }),
            });

            const result = await response.json();

            if (!result.available) {
                setInstitutionError("Dit instituut bestaat al! Zet de locatie achter de naam!.");
            } else {
                setInstitutionError(null);
            }
        } catch (error) {
            setInstitutionError("Fout bij het controleren de instituut beschikbaarheid.");
        }
    };

    //Phone Number check
    const handlePhoneNumberBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        // const phone = event.target.value;
        //
        // if (!phone) return;
        //
        // try {
        //     const response = await fetch('/api/payment/CheckPhoneNumberRegistration', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ institution }),
        //     });
        //
        //     const result = await response.json();
        //
        //     setPhone(!result.available ? null : "Dit telefoonnummer is al in gebruik!");
        //
        // } catch (error) {
        //     setPhoneError("Fout bij het controleren van het telefoon nummer.");
        // }
    };

    //
    const handlePasswordBlur = () => {
        setPasswordError(password.length >= 8 ? null : "Wachtwoord moet langer zijn dan 8 tekens.");
    };

    const handlePassword2Blur = () => {
        setPassword2Error(password === password2 ? null : "Wachtwoorden komen niet overeen.");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            <div className="flex lg:flex-row flex-col-reverse justify-center items-center  w-[70%] lg:h-[90%] h-full">
                <div className="flex flex-row justify-center items-center lg:w-[50%] w-[90%] h-full p-[5%]  border-red-950
                border-l-4  border-b-4  border-r-4 rounded-b-3xl
                lg:border-t-4  lg:border-b-4  lg:border-r-0 lg:rounded-l-3xl lg:rounded-r-none">
                    <form onSubmit={handleSubmit}
                          className="flex w-full h-fit min-h-full flex-col justify-between items-center">
                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onBlur={handleEmailBlur}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

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
                            onBlur={handlePhoneNumberBlur}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="text"
                            placeholder="Institution Name + Location (e.g vlinder Leuven)"
                            value={institution}
                            onBlur={handleInstitutionBlur}
                            onChange={(e) => setInstitution(e.target.value)}
                            required
                        />
                        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handlePasswordBlur}
                            required
                        />
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                        <input
                            className="flex w-full h-full bg-white rounded-xl p-2"
                            type="password"
                            placeholder="Password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            onBlur={handlePassword2Blur}
                            required
                        />
                        {password2Error && <p className="text-red-500 text-sm">{password2Error}</p>}



                        {/* Stripe Card Elements */}
                        <div className="w-full h-full bg-white p-2 rounded-xl  ">
                            <CardElement
                                options={{
                                    hidePostalCode: true,
                                    style: {
                                        base: {
                                            fontSize: "5hw",
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
                        <div className="flex h-full w-full items-center gap-2">
                            <Checkbox id="agree" required/>
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

                <div className="flex flex-col lg:justify-center justify-center items-center lg:w-[50%] w-[90%] lg:h-full h-[30%] ">
                    <div className="flex flex-col justify-center items-center w-full h-full bg-white border-red-950
                        border-l-4  border-t-4  border-r-4 rounded-t-3xl
                        lg:border-t-4  lg:border-b-4  lg:border-l-0 lg:rounded-r-3xl lg:rounded-l-none ">
                        <div className="lg:flex hidden flex-row justify-center w-[60%] aspect-square">
                            <img src="/vlinder.png" alt="Vlinder Logo" className="  w-full h-full" />
                        </div>
                        <div className="flex flex-col justify-center items-center h-fit w-[90%] text-center text-black">
                            <h1 className="lg:text-[400%] text-[6vw] ">€ {productData?.price / 100}</h1>
                            <p className="lg:text-[120%] text-[2vh]">{productData?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default PaymentForm;
