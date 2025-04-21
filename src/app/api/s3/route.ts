import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { db } from "@/db/drizzle";
import { Audiobook } from "@/db/schema";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const coverFile = formData.get('cover') as File;
    const bookFile = formData.get('book') as File;

    console.log(formData)
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