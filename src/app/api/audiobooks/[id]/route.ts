import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { Audiobook } from "@/db/schema";

export async function GET(
  request: Request, { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; 
    const book = await db.select().from(Audiobook).where(eq(Audiobook.id, id));
    return book.length > 0 ? NextResponse.json(book[0]) : NextResponse.json({ error: "Book not found" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching audiobook:", error);
    return NextResponse.json(
      { error: "Failed to fetch audiobook" },
      { status: 500 }
    );
  }
}
