'use client';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  duration: string;
}

const DEFAULT_COVER_URL = 'https://listen-english-s3.s3.us-east-2.amazonaws.com/covers/default-cover.png';

function BookCard({ title, author, coverUrl, duration }: BookCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 text-[#dfdfdf]">
      <div className="relative aspect-[3/4]">
        <img 
          height={300}
          width={300}
          src={DEFAULT_COVER_URL} 
          alt={`${title} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-sm font-medium">{duration}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
        <p className="text-sm text-[#dfdfdf]">{author}</p>
      </div>
    </div>
  )
}

export default BookCard;
