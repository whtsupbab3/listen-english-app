'use client';

import BookCard from './BookCard';

const books = [
  {
    id: 1,
    title: "Five on a Treasure Island",
    author: "Френсіс Скотт Фіцджеральд",
    coverUrl: "https://listen-english-s3.s3.us-east-2.amazonaws.com/covers/FiveOnATreasureIsland.jpg",
    duration: "4h 30m"
  },
];

function BookList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#fea900] mb-6">Доступні книги</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            duration={book.duration}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;