import { NextResponse } from "next/server";
import { z } from "zod";
import { chatWithTrinetra } from "@/features/agent/orchestrator/chat-service";

const chatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const data = await chatWithTrinetra(parsed.data.message);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
