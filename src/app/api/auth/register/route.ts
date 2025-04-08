import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { User } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Відсутні необхідні поля' },
        { status: 400 }
      );
    }

    const existingUser = await db.select({
      where: eq(User.email, email),
    }).from(User);

    console.log('existingUser', existingUser);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'Користувач з таким email вже існує.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(User).values({
      id: new Date().getTime(),
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'Користувач успішно створений.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
     { status: 500 }
    );
  }
}
