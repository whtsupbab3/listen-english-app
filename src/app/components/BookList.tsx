'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Audiobook } from '@/types';
import { useUser } from '../contexts/UserContext';

function BookList() {
  const [books, setBooks] = useState<Audiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
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

  const filteredBooks = filter === 'all' 
    ? [...privateBooks, ...publicBooks]
    : filter === 'private' 
      ? privateBooks 
      : publicBooks;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-end">
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'public' | 'private')}
          className="bg-[#3f3f3f] text-[#dfdfdf] px-4 py-2 rounded-lg border border-[#fea900] focus:outline-none focus:ring-2 focus:ring-[#fea900]"
        >
          <option value="all">Всі книги</option>
          <option value="public">Публічні книги</option>
          {user && <option value="private">Приватні книги</option>}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} audiobook={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;