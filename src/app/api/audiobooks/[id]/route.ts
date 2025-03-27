import { db } from "@/db/drizzle";
import { NextResponse } from "next/server";
import { Audiobook } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
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
