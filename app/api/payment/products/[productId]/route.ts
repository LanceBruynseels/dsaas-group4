import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
});

export async function GET(req, { params }) {
    const { productId } = params; // Extract the dynamic productId from the request

    try {
        // Fetch the product details from Stripe
        const product = await stripe.products.retrieve(productId);

        // Fetch the associated prices
        const prices = await stripe.prices.list({ product: productId });

        // Respond with the product and price details
        return NextResponse.json({
            id: product.id,
            name: product.name,
            description: product.description,
            price: prices.data[0]?.unit_amount || null,
            currency: prices.data[0]?.currency || 'USD',
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        return NextResponse.json({ error: 'Error fetching product details' }, { status: 500 });
    }
}
