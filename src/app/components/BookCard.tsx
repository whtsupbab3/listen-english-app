'use client';

import { Audiobook } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  audiobook: Audiobook;
}

const DEFAULT_COVER_URL = 'https://listen-english-s3.s3.us-east-2.amazonaws.com/covers/default-cover.png';

function BookCard({ audiobook }: BookCardProps) {
  const [duration, setDuration] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchAudioDuration = async () => {
      if (!audiobook.audioUrl) return;
      
      const audio = new Audio(audiobook.audioUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        const durationString = hours > 0 
          ? `${hours}h ${remainingMinutes}m`
          : `${minutes}m`;
          
        setDuration(durationString);
      });

      audio.addEventListener('error', (e) => {
        console.error('Error loading audio:', e);
        setDuration('');
      });
    };

    fetchAudioDuration();
  }, [audiobook.audioUrl]);

  return (
    <div 
      onClick={() => router.push(`/book/${audiobook.id}`)}
      className="bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out text-[#dfdfdf] cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:bg-[#222222] transform-gpu"
    >
      <div className="relative aspect-[3/4]">
        <img 
          height={300}
          width={300}
          src={audiobook.coverUrl || DEFAULT_COVER_URL} 
          alt={`${audiobook.title} cover`} 
          className="w-full h-full object-cover"
        />
        {duration && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white text-sm font-medium">{duration}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2 min-h-[3.5rem]">{audiobook.title}</h3>
        <p className="text-sm text-[#dfdfdf]">{audiobook.author}</p>
      </div>
    </div>
  );
}

export default BookCard;
