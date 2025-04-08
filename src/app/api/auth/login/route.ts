import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { User } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Відсутні необхідні поля' },
        { status: 400 }
      );
    }

    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Невірний email або пароль' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Невірний email або пароль' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
