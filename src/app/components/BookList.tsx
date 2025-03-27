'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Audiobook } from '@/types';

function BookList() {
  const [books, setBooks] = useState<Audiobook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/audiobooks');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        console.log(data);
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#fea900] mb-6">Доступні книги</h2>
      {isLoading ? (
        <div className="container w-[100%] mx-auto px-4 py-8 text-center animate-pulse">Loading...</div>
      ) : books.length === 0 ? (
        <div className="container w-[100%] mx-auto px-4 py-8 text-center">No books available</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard
            key={book.id}
            audiobook={book}
          />
        ))}
      </div>
      )}
    </div>
  );
}

export default BookList;