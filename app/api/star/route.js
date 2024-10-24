import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const starredCandidates = await kv.smembers("starred_candidates");
    return NextResponse.json(starredCandidates);
  } catch (error) {
    console.error("Error fetching starred candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch starred candidates" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { publicIdentifier, isStarred } = await request.json();
  try {
    if (isStarred) {
      await kv.sadd("starred_candidates", publicIdentifier);
    } else {
      await kv.srem("starred_candidates", publicIdentifier);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating starred candidate:", error);
    return NextResponse.json(
      { error: "Failed to update starred candidate" },
      { status: 500 }
    );
  }
}
