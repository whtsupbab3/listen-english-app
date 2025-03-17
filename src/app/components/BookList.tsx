'use client';

import BookCard from './BookCard';

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverUrl: "https://example.com/gatsby-cover.jpg",
    duration: "4h 30m"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverUrl: "https://example.com/mockingbird-cover.jpg",
    duration: "5h 15m"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://example.com/1984-cover.jpg",
    duration: "3h 45m"
  },
  {
    id: 4,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://example.com/1984-cover.jpg",
    duration: "3h 45m"
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://example.com/1984-cover.jpg",
    duration: "3h 45m"
  },
  {
    id: 6,
    title: "1984",
    author: "George Orwell",
    coverUrl: "https://example.com/1984-cover.jpg",
    duration: "3h 45m"
  },
];

function BookList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#fea900] mb-6">Available Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            coverUrl='https://listen-english-s3.s3.us-east-2.amazonaws.com/default-cover.png'
            duration={book.duration}
          />
        ))}
      </div>
    </div>
  );
}

export default BookList;