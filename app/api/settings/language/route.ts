import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { targetLanguage, text } = req.body;

    if (!targetLanguage || !text) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
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

        res.status(200).json({ translatedText: data.data.translations[0].translatedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { handler as GET, handler as POST };
