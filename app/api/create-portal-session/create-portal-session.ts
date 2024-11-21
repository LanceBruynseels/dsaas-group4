import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export async function POST(request: Request) {
    const { customer_id } = await request.json();

    if (!customer_id) {
        return NextResponse.json({ error: 'Missing customer_id' }, { status: 400 });
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
    }
}
