import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});

export async function POST(req: Request) {
    try {
        const { subscriptionId }: { subscriptionId: string } = await req.json();

        if (!subscriptionId) {
            return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
        }

        // Cancel the subscription
        const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId)

        return NextResponse.json({
            message: "Subscription canceled successfully",
            subscription: deletedSubscription,
        });
    } catch (error: any) {
        console.error("Error canceling subscription:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
