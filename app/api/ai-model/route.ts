
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Optimized for complete website generation with deepseek-v3.2-exp
    // This model excels at code generation with better speed and long-context handling
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
        {
        model: "deepseek/deepseek-v3.2-exp",  // Better for code generation, faster inference
        messages,
        stream: true,
        temperature: 0.2,  // Even lower for more focused, structured code generation
        max_tokens: 8000,  // Increased to ensure complete website generation
        top_p: 0.8,  // More deterministic for maintaining HTML structure
        frequency_penalty: 0.3,  // Higher to prevent repetitive class dumping
        presence_penalty: 0.2,  // Encourage focused content generation
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "NexDrew AI Website Builder",
        },
        responseType: "stream",
        timeout: 90000,  // 90 seconds to allow for complete generation
      }
    );

    const upstream = response.data;
    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        let isClosed = false;
        
        const closeController = () => {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
        };

        upstream.on("data", (chunk: Buffer) => {
          const payloads = chunk.toString().split("\n\n");
          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              closeController();
              return;
            }
            if (payload.startsWith("data:")) {
              try {
                const data = JSON.parse(payload.replace("data:", ""));
                const text = data.choices?.[0]?.delta?.content;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (err) {
                console.error("Error parsing stream", err);
              }
            }
          }
        });
        upstream.on("end", () => {
          closeController();
        });
        upstream.on("error", (err: unknown) => {
          console.error("Stream error", err);
          controller.error(err);
        });
      },
      cancel() {
        if (typeof upstream.destroy === "function") {
          upstream.destroy();
        }
      },
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