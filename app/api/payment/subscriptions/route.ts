import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// safety check to make sure secret key is in .env
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
// connect with stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',  // Ensure to use the correct API version
});

export async function GET(req: NextRequest) {
    try {
        // Fetch the list of products from Stripe
        const products = await stripe.products.list({
            limit: 4,
        });

        // get only active products (active: true not working for some reason)
        const activeProducts = products.data.filter((product) => product.active);

        // You can also fetch prices for each product if needed
        const productsWithPrices = await Promise.all(
            activeProducts.map(async (product) => {
                const prices = await stripe.prices.list({
                    product: product.id,
                });

                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: prices.data[0] ? prices.data[0].unit_amount : null,
                    currency: prices.data[0] ? prices.data[0].currency : 'EU',
                };
            })
        );

        // Return the products with prices as a JSON response
        return NextResponse.json(productsWithPrices);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}
