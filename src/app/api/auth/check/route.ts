import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/db/drizzle';
import { User } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const token = (await cookies()).get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(null);
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const users = await db
      .select({
        id: User.id,
        name: User.name,
        email: User.email,
      })
      .from(User)
      .where(eq(User.id, payload.userId as string));

    const user = users[0];

    if (!user) {
      return NextResponse.json(null);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(null);
  }
}
