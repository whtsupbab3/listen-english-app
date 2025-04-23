import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { UserBook } from "@/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId, audiobookId, progressInSeconds, finished } = await request.json();
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
          ...(typeof finished === 'boolean' ? { finished } : {}),
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
        finished: typeof finished === 'boolean' ? finished : false,
      });
      return NextResponse.json({ created: true });
    }
  } catch (error) {
    console.error("UserBook interaction error:", error);
    return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const audiobookId = searchParams.get("audiobookId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!audiobookId) {
      const interactions = await db
        .select()
        .from(UserBook)
        .where(eq(UserBook.userId, userId))
        .orderBy(desc(UserBook.lastViewed));
      const audiobookIds = interactions.map((i: any) => i.audiobookId);
      let audiobooks: any[] = [];
      if (audiobookIds.length > 0) {
        const { Audiobook } = await import('@/db/schema');
        audiobooks = await db
          .select()
          .from(Audiobook)
          .where(inArray(Audiobook.id, audiobookIds));
      }
      const booksWithLastViewed = audiobooks.map((book: any) => {
        const interaction = interactions.find((i: any) => i.audiobookId === book.id);
        return {
          ...book,
          lastViewed: interaction?.lastViewed,
          progressInSeconds: interaction?.progressInSeconds,
        };
      });
      booksWithLastViewed.sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime());
      return NextResponse.json(booksWithLastViewed);
    }
    const existing = await db
      .select()
      .from(UserBook)
      .where(and(eq(UserBook.userId, userId), eq(UserBook.audiobookId, audiobookId)));
    if (existing.length > 0) {
      return NextResponse.json({ progressInSeconds: existing[0].progressInSeconds });
    } else {
      return NextResponse.json({ progressInSeconds: 0 });
    }
  } catch (error) {
    console.error("UserBook GET error:", error);
    return NextResponse.json({ error: "Failed to fetch interaction(s)" }, { status: 500 });
  }
}
