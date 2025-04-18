'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Audiobook } from '@/types';
import { useUser } from '../contexts/UserContext';

function BookList() {
  const [books, setBooks] = useState<Audiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const url = user 
          ? `/api/audiobooks?uploaderId=${user.id}`
          : '/api/audiobooks';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  if (error) {
    return <div className="w-[100%] mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  const publicBooks = books.filter(book => book.isPublic);
  const privateBooks = user ? books.filter(book => !book.isPublic && book.uploaderId === user.id) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {user && privateBooks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#fea900] mb-6">Ваші приватні книги</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {privateBooks.map((book) => (
              <BookCard
                key={book.id}
                audiobook={book}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-[#fea900] mb-6">Публічні книги</h2>
        {isLoading ? (
          <div className="w-[100%] mx-auto px-4 py-8 text-center animate-pulse">Завантаження...</div>
        ) : publicBooks.length === 0 ? (
          <div className="w-[100%] mx-auto px-4 py-8 text-center">Немає доступних книг</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {publicBooks.map((book) => (
              <BookCard
                key={book.id}
                audiobook={book}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;