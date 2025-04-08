'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen bg-[#2f2e2e] text-[#dfdfdf]">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-8 p-8 bg-[#3a3939] rounded-xl shadow-xl">
          <div>
            <h2 className="mt-2 text-center text-4xl font-bold text-[#fea900] mb-4">
              Створити акаунт
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
                <label htmlFor="name" className="sr-only">
                  Ім'я
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#4a4949] bg-[#2f2e2e] text-[#dfdfdf] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea900] focus:border-transparent"
                  placeholder="Ім'я"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#4a4949] bg-[#2f2e2e] text-[#dfdfdf] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea900] focus:border-transparent"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
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
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#4a4949] bg-[#2f2e2e] text-[#dfdfdf] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fea900] focus:border-transparent"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-black bg-[#fea900] hover:bg-[#fea900]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fea900] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Створення акаунту...' : 'Зареєструватися'}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-[#dfdfdf]">Вже маєте акаунт? </span>
              <Link href="/login" className="text-[#fea900] hover:text-[#fea900]/90 transition-colors duration-200">
                Увійти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
