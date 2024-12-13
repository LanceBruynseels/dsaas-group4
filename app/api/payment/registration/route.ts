 import { NextRequest, NextResponse } from 'next/server';
 import Stripe from 'stripe';

 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
     apiVersion: '2024-11-20.acacia',
 });

 export async function POST(req: NextRequest) { //this will be called by a page (waiting for call)
     try {
         const { email, name } = await req.json();

         // Create a customer in Stripe
         const customer = await stripe.customers.create({ email, name });

         // Return the customer as JSON response
         return NextResponse.json(customer);
     } catch (error) {
         console.error(error);
         return NextResponse.json({ error: 'Error creating customer' }, { status: 500 });
     }
 }

