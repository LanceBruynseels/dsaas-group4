import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe requires the raw body for webhook signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    // Read the raw body for signature verification
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook error: ${err.message}`);
        return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`Checkout session completed: ${session.id}`);
            // Add logic to handle successful checkout (e.g., store user subscription in DB)
            break;

        case 'invoice.payment_succeeded':
            const invoice = event.data.object as Stripe.Invoice;
            console.log(`Invoice payment succeeded: ${invoice.id}`);
            // Add logic to handle successful payment
            break;

        case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`Subscription canceled: ${subscription.id}`);
            // Add logic to handle subscription cancellation
            break;

        default:
            console.warn(`Unhandled event type: ${event.type}`);
    }

    // Respond to Stripe to acknowledge receipt of the event
    return NextResponse.json({ received: true });
}
