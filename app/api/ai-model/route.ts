import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config: any = {
      thinkingConfig: {
        thinkingLevel: "HIGH",
      },
    };

    const model = 'gemini-3-flash-preview';

    // Map OpenAI/OpenRouter style messages to Gemini style contents
    const contents = messages.map((msg: any) => {
      let role = msg.role;
      if (role === 'assistant') {
        role = 'model';
      } else if (role === 'system') {
        // Gemini API normally expects system instructions in config,
        // but converting to 'user' handles system prompts in the message array seamlessly.
        role = 'user';
      }
      return {
        role: role,
        parts: [{ text: msg.content || "" }]
      };
    });

    const responseStream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        } catch (err: unknown) {
          console.error("Stream error", err);
          controller.error(err);
        }
      }
    });

    return new NextResponse(readable as any, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
