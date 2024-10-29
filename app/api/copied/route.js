import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const copiedCandidates = await kv.smembers("copied_candidates");
    return NextResponse.json(copiedCandidates);
  } catch (error) {
    console.error("Error fetching copied candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch copied candidates" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { publicIdentifier, isCopied } = await request.json();
  try {
    if (isCopied) {
      await kv.sadd("copied_candidates", publicIdentifier);
    } else {
      await kv.srem("copied_candidates", publicIdentifier);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating copied candidate:", error);
    return NextResponse.json(
      { error: "Failed to update copied candidate" },
      { status: 500 }
    );
  }
}
