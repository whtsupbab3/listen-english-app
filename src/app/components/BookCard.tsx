'use client';

import { Audiobook } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

const DEFAULT_COVER_URL = 'https://listen-english-s3.s3.us-east-2.amazonaws.com/covers/default-cover.png';

interface BookCardProps {
  audiobook: Audiobook;
}

function BookCard({ audiobook }: BookCardProps) {
  const [duration, setDuration] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Ви впевнені, що хочете видалити цю книгу?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/audiobooks/${audiobook.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      toast.success('Книгу успішно видалено');
      router.refresh();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Не вдалося видалити книгу');
    } finally {
      setIsDeleting(false);
    }
  };

  const showDeleteButton = user && user.id === audiobook.uploaderId;

  return (
    <div 
      onClick={() => router.push(`/book/${audiobook.id}`)}
      className="group bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="relative aspect-[2/3]">
        <img 
          src={audiobook.coverUrl || DEFAULT_COVER_URL} 
          alt={`${audiobook.title} cover`} 
          className="w-full h-full object-cover"
        />
        {duration && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white text-sm font-medium">{duration}</span>
          </div>
        )}
        {showDeleteButton && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2 min-h-[3.5rem]">{audiobook.title}</h3>
        <p className="text-sm text-[#dfdfdf]">{audiobook.author}</p>
        {showDeleteButton && <p className="text-xs text-gray-500 mt-1">Ваша книга</p>}
      </div>
    </div>
  );
}

export default BookCard;
