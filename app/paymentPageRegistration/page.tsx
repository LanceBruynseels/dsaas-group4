"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const PaymentPage = () => {
    const { productId } = useParams(); // Get product ID from route
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details based on productId
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/payment/product/${productId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product details');
                }

                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>
                <h3>Error:</h3>
                <p>{error}</p>
            </div>
        );
    }

    const handlePayment = async () => {
        try {
            const res = await fetch('/api/payment/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }), // Send productId to create payment session
            });

            if (!res.ok) {
                throw new Error('Failed to initiate payment');
            }

            const { url } = await res.json();
            window.location.href = url; // Redirect to Stripe Checkout
        } catch (err) {
            console.error('Payment initiation failed:', err);
        }
    };

    return (
        <div>
            <h1>Payment for {product.name}</h1>
            <p>{product.description}</p>
            <p>
                Price: {product.price / 100} {product.currency.toUpperCase()}
            </p>
            <button onClick={handlePayment}>Proceed to Pay</button>
        </div>
    );
};

export default PaymentPage;
