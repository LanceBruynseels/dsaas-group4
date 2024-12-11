import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { signBuyerUpAction } from "@/app/actions";



// Initialize Stripe for payments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
});


let globalCodes: string[] = [];

export async function POST(req: NextRequest) {
    try {
        const { productId, email, name, phone, institution, password } = await req.json();

        // Validate inputs
        if (!productId || !email || !name || !phone || !institution || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }


        // Create a customer in Stripe
        const customer = await stripe.customers.create({
            email,
            name,
            phone,
            metadata: { institution },
        });

        console.log("Customer created:");



        //pogint got registreren
        console.log("poging tot reg")
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("displayName", name);
        await signBuyerUpAction(formData);





        // Create a user in Supabase
        const hashedPassword = await bcrypt.hash(password, 14);
        const supabase = await createClient(); // Await the promise here
        const { data: supabaseData, error: supabaseError } = await supabase.from('Buyers').insert([
            {
                name,
                email,
                phone,
                institution,
                password: hashedPassword,
                subscriptionID: null,
            },
        ]);

        if (supabaseError) {
            console.error("Error inserting user into Supabase:", supabaseError.message);
            throw new Error("Supabase user creation failed");

        }

        //creates institude in supabase
        const supabase2 = await createClient(); // Await the promise here
        const { data: supabaseData2, error: supabaseError2 } = await supabase2.from('institutions').insert([
            {
                institution: institution
            },
        ]);

        if (supabaseError2) {
            console.error("Error inserting user into Supabase:", supabaseError2.message);
            throw new Error("Supabase user creation failed");

        }





        console.log("User created in Supabase:");

        // Fetch product price
        const prices = await stripe.prices.list({ product: productId });
        const price = prices.data[0];
        if (!price) {
            return NextResponse.json({ error: "Price not found" }, { status: 400 });
        }

        // Create a subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: price.id }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.payment_intent"],
            metadata: { productId, institution, email },
        });

        console.log("Subscription created:");

        // Access the client secret from the subscription's payment intent
        let clientSecret: string | null = null;
        if (
            subscription.latest_invoice &&
            typeof subscription.latest_invoice !== "string" &&
            subscription.latest_invoice.payment_intent &&
            typeof subscription.latest_invoice.payment_intent !== "string"
        ) {
            const paymentIntent = subscription.latest_invoice.payment_intent as Stripe.PaymentIntent;
            clientSecret = paymentIntent.client_secret ?? null;
        }

        if (!clientSecret) {
            throw new Error("Client secret could not be retrieved from the payment intent.");
        }
        console.log("Payment Intend created")

        const { data: updatedUser, error: updateError } = await supabase
            .from('Buyers')
            .update({ subscriptionID: subscription.id })
            .eq('email', email);  // Match the email to update the correct record

        if (updateError) {
            console.error("Error updating subscription_id in Supabase:", updateError.message);
            throw new Error("Failed to update subscription ID");
        }

        console.log("User's subscription ID updated in Supabase:", updatedUser);

        // Generate unique codes for different subscription tiers
        const BasicSubscription = 20;
        const AdvancedSubscription = 50;
        const UltraSubscription = 100;

        switch (productId) {
            case "prod_RGFgganaaEOG3u": // Basic
                globalCodes = generateUniqueCodes(BasicSubscription, 16);
                await storeCodes(institution, globalCodes);
                break;

            case "prod_RGQIgY6QtXCIUR": // Advanced
                globalCodes = generateUniqueCodes(AdvancedSubscription, 16);
                await storeCodes(institution, globalCodes);
                break;

            case "prod_RGQJrvBvsy3s2k": // Ultra
                globalCodes = generateUniqueCodes(UltraSubscription, 16);
                await storeCodes(institution, globalCodes);
                break;
        }

        // Send email with Nodemailer
        const transporter: Transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: "SaasgroupVlinder@gmail.com",
                pass: "zdcrbohyakqtiwli",
            },
        });

        console.log("email Transporter created")

        const mailOptions: SendMailOptions = {
            from: "SaasGroupVlinder@gmail.com",
            to: email,
            subject: "Subscription Confirmation",
            text: `Dear ${name},\n\nThank you for subscribing to our service. Your subscription is now active. Your codes:\n\n${getCodes()}`,
        };


        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
        console.log("prijs",price);

        // Return client secret, customer ID and price
        return NextResponse.json({
            clientSecret,
            customerId: customer.id,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Generate unique codes
function generateUniqueCodes(numberOfCodes: number, codeLength: number): string[] {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codes = new Set<string>();

    while (codes.size < numberOfCodes) {
        let code = '';
        for (let i = 0; i < codeLength; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        codes.add(code); // Ensure uniqueness
    }

    return Array.from(codes);
}

// Store codes in Supabase
interface AccessCode {
    code: string;
    institution: string;
}

async function storeCodes(institution: string, codes: string[]): Promise<AccessCode[] | null> {
    const supabase = await createClient(); // Await the promise here

    const rows = codes.map((code) => ({
        code,
        institution,
    }));

    const { data, error } = await supabase.from('access_codes').insert(rows);

    if (error) {
        console.error('Error inserting codes:', error.message);
        return null;
    }

    console.log('Inserted codes:');
    return data as AccessCode[];
}


// Get global codes as a newline-separated string
function getCodes(): string {
    if (globalCodes.length === 0) {
        return "No codes are currently available."; // Returns a default message if no codes are available
    }
    return globalCodes.join('\n'); // Returns the codes as a string joined by newline
}