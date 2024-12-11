import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
    try {
        const { subscriptionID } = await req.json();

        // Validate input
        if (!subscriptionID) {
            return NextResponse.json(
                { error: "Subscription ID is required" },
                { status: 400 }
            );
        }

        // Retrieve subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionID);

        // Return the subscription details
        return NextResponse.json(
            {
                subscriptionId: subscription.id,
                status: subscription.status,
                customer: subscription.customer,
                start_date: subscription.start_date,
                current_period_end: subscription.current_period_end,
                current_period_start: subscription.current_period_start,
                items: subscription.items.data.map((item) => ({
                    id: item.id,
                    price: item.price.id,
                    quantity: item.quantity,
                })),
                metadata: subscription.metadata,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching subscription details:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch subscription details" },
            { status: 500 }
        );
    }
}
