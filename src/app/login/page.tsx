'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';
import Header from '../components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setUser(data);
      router.push('/');
    } catch (error) {
      setError('Помилка при вході. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2f2e2e] text-[#dfdfdf]">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#3a3939] rounded-xl shadow-xl">
          <div>
            <h2 className="mt-2 text-center text-4xl font-bold text-[#fea900] mb-4">
              Увійти в акаунт
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#4a4949] bg-[#2f2e2e] text-[#dfdfdf] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea900] focus:border-transparent"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#4a4949] bg-[#2f2e2e] text-[#dfdfdf] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea900] focus:border-transparent"
                  placeholder="Пароль"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-black bg-[#fea900] hover:bg-[#fea900]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fea900] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Вхід...' : 'Увійти'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-[#dfdfdf]">Не маєте акаунту? </span>
              <Link href="/register" className="text-[#fea900] hover:text-[#fea900]/90 transition-colors duration-200">
                Зареєструватися
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
