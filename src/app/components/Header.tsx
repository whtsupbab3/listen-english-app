'use client';

import Link from 'next/link';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return (
    <header className="w-full py-4 px-6 bg-[#2f2e2e] border-b border-[#3f3f3f]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-[#fea900]">
          Listen English
        </Link>
        <div className="flex gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg border-2 border-[#fea900] text-[#fea900] hover:bg-[#fea900] hover:text-black transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg bg-[#fea900] text-black font-medium hover:bg-[#fea900]/90 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[#dfdfdf]">Welcome, {user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
