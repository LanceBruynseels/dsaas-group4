import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const body = await req.json();
        const { targetLanguage, text } = body;

        if (!targetLanguage || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                target: targetLanguage,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error.message);
        }

        return NextResponse.json({ translatedText: data.data.translations[0].translatedText });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
