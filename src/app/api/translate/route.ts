import { NextResponse } from "next/server";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

interface TranslationRequest {
  text: string;
  targetLang?: string;
  sourceLang?: string;
}

export async function POST(request: Request) {
  if (!DEEPL_API_KEY) {
    return NextResponse.json(
      { error: "DeepL API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const body: TranslationRequest = await request.json();
    const { text, targetLang = "EN", sourceLang } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        ...(sourceLang && { source_lang: sourceLang }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepL API error: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}