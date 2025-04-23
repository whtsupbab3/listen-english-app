import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { UserBook } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId, audiobookId, progressInSeconds } = await request.json();
    if (!userId || !audiobookId) {
      return NextResponse.json({ error: "Missing userId or audiobookId" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(UserBook)
      .where(and(eq(UserBook.userId, userId), eq(UserBook.audiobookId, audiobookId)));

    if (existing.length > 0) {
      await db
        .update(UserBook)
        .set({
          progressInSeconds: progressInSeconds ?? existing[0].progressInSeconds,
          lastViewed: new Date(),
        })
        .where(and(eq(UserBook.userId, userId), eq(UserBook.audiobookId, audiobookId)));
      return NextResponse.json({ updated: true });
    } else {
      await db.insert(UserBook).values({
        id: `${userId}_${audiobookId}`,
        userId,
        audiobookId,
        progressInSeconds: progressInSeconds ?? 0,
        lastViewed: new Date(),
      });
      return NextResponse.json({ created: true });
    }
  } catch (error) {
    console.error("UserBook interaction error:", error);
    return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 });
  }
}
