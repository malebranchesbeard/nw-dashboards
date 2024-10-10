import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notes = await kv.lrange("notes", 0, -1);
    return NextResponse.json(notes.reverse());
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { content } = await request.json();
  const note = { content, timestamp: new Date().toISOString() };
  await kv.lpush("notes", note);
  return NextResponse.json({ success: true });
}
