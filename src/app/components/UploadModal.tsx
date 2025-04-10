'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => void;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('isPublic', (form.isPublic as HTMLInputElement).checked.toString());

    try {
      const response = await fetch('/api/audiobooks', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.book);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2f2e2e] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#fea900] mb-6">Завантажити книгу</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#dfdfdf] mb-2">Назва книги (англійською)</label>
            <input
              type="text"
              name="title"
              required
              className="w-full p-2 rounded bg-[#1a1a1a] text-[#dfdfdf] border border-[#444]"
              placeholder="Five on a Treasure Island"
            />
          </div>

          <div>
            <label className="block text-[#dfdfdf] mb-2">Автор (англійською)</label>
            <input
              type="text"
              name="author"
              required
              className="w-full p-2 rounded bg-[#1a1a1a] text-[#dfdfdf] border border-[#444]"
              placeholder="Enid Blyton"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              className="w-4 h-4 rounded bg-[#1a1a1a] text-[#fea900] border border-[#444]"
            />
            <label htmlFor="isPublic" className="text-[#dfdfdf]">Зробити книгу публічною</label>
          </div>

          <div>
            <label className="block text-[#dfdfdf] mb-2">Обкладинка книги</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <div className="relative cursor-pointer">
                  {bookCover ? (
                    <div className="w-full h-40 relative">
                      <Image
                        src={bookCover}
                        alt="Book cover preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-[#444] rounded flex items-center justify-center">
                      <span className="text-[#dfdfdf]">Оберіть зображення</span>
                    </div>
                  )}
                  <input
                    type="file"
                    name="cover"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#dfdfdf] mb-2">Файл книги</label>
            <input
              type="file"
              name="book"
              accept=".txt,.pdf,.epub"
              required
              className="w-full p-2 rounded bg-[#1a1a1a] text-[#dfdfdf] border border-[#444]"
            />
            <p className="text-sm text-[#dfdfdf]/60 mt-1">Підтримуються формати .txt, .pdf та .epub</p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#dfdfdf] hover:bg-[#444] rounded"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#fea900] text-black rounded hover:bg-[#ffb824] disabled:opacity-50"
            >
              {isLoading ? 'Завантаження...' : 'Завантажити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}