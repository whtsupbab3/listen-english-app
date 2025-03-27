import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Audiobook } from "@/db/schema";

export async function GET() {
  try {
    const books = await db.select().from(Audiobook);
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching audiobooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch audiobooks" },
      { status: 500 }
    );
  }
}