import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia", // Adjust based on the latest Stripe API version
});

export async function POST(req) {
    try {
        const { customerId } = await req.json();

        if (!customerId) {
            return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }

        // Fetch all subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
        });

        return NextResponse.json({ subscriptions });
    } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
