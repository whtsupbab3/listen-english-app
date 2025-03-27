'use client';

import React, { useState } from 'react';
import UploadModal from './UploadModal';

const Hero: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUpload = async (formData: FormData) => {
    // TODO: Implement upload logic
    console.log('Uploading book:', formData);
  };

  return (
    <div className="bg-[#2f2e2e] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#fea900] mb-4">
            Вивчай англійську cлухаючи
          </h1>
          <p className="text-[#dfdfdf] text-lg mb-8">
          Читай і слухай книги англійською одночасно, щоб покращити свої навички. Завантажуй улюблені книги та отримуй AI-згенероване аудіо для тренування сприймання на слух.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-[#fea900] text-black font-medium text-lg hover:bg-[#fea900]/90 transition-colors"
          >
            Завантажити книгу
          </button>
        </div>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Hero;