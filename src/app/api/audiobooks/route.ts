import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Audiobook } from "@/db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { eq, and, or } from "drizzle-orm";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uploaderId = searchParams.get('uploaderId');
    
    const books = await db.selectDistinct().from(Audiobook).where(
      uploaderId 
        ? or(
            eq(Audiobook.isPublic, true),
            eq(Audiobook.uploaderId, uploaderId)
          )
        : eq(Audiobook.isPublic, true)
    );
    
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching audiobooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch audiobooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const coverFile = formData.get('cover') as File;
    const bookFile = formData.get('book') as File;

    if (!title || !author || !coverFile || !bookFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const coverKey = `covers/${Date.now()}-${coverFile.name}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: coverKey,
        Body: Buffer.from(await coverFile.arrayBuffer()),
        ContentType: coverFile.type,
      })
    );

    const bookKey = `books/${Date.now()}-${bookFile.name}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: bookKey,
        Body: Buffer.from(await bookFile.arrayBuffer()),
        ContentType: bookFile.type,
      })
    );

    const book = await db.insert(Audiobook).values({
      id: Date.now().toString(),
      title,
      author,
      coverUrl: `${process.env.AWS_CLOUDFRONT_URL}/${coverKey}`,
      bookUrl: `${process.env.AWS_CLOUDFRONT_URL}/${bookKey}`,
      isPublic: formData.get('isPublic') === 'true',
      uploaderId: formData.get('uploaderId') as string,
    });

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}