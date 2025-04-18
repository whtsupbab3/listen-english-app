import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { Audiobook } from "@/db/schema";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const book = await db.select().from(Audiobook).where(eq(Audiobook.id, id));

    if (book.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const coverKey = book[0].coverUrl?.split('/').pop();
    const bookKey = book[0].bookUrl?.split('/').pop();
    const audioKey = book[0].audioUrl?.split('/').pop();
    const srtKey = book[0].srtFileUrl?.split('/').pop();

    const deletePromises = [];

    if (coverKey) {
      deletePromises.push(s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: `covers/${coverKey}`,
      })));
    }

    if (bookKey) {
      deletePromises.push(s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: `books/${bookKey}`,
      })));
    }

    if (audioKey) {
      deletePromises.push(s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: `audios/${audioKey}`,
      })));
    }

    if (srtKey) {
      deletePromises.push(s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: `srt-files/${srtKey}`,
      })));
    }

    await Promise.all(deletePromises);

    await db.delete(Audiobook).where(eq(Audiobook.id, id));

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting audiobook:", error);
    return NextResponse.json(
      { error: "Failed to delete audiobook" },
      { status: 500 }
    );
  }
}
