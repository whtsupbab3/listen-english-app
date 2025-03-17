'use client';

import React from 'react';

const Hero: React.FC = () => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file upload logic
      console.log('File selected:', file.name);
    }
  };

  return (
    <div className="bg-[#000000] py-16 border border-[#333333] text-[#dfdfdf]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#fea900] leading-tight">
              Master a new language by listening
            </h1>
            <p className="text-l leading-relaxed">
              Instantly transform any book into an engaging audiobook by uploading your text file (.txt, .pdf) and let our AI handle the rest. Enjoy interactive reading—ask for real-time translations and insights as you listen. Alternatively, dive into our extensive library to start your language learning journey today.
            </p>
            <div className="flex items-center space-x-4">
              <label 
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[#000000] bg-[#fea900] focus:outline-none focus:ring-2 focus:ring-offset-2  cursor-pointer"
              >
                Upload Book
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".txt,.pdf"
                  className="sr-only"
                  onChange={handleFileUpload}
                />
              </label>
              <span className="text-sm">Supports .txt and .pdf files</span>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* You can add an illustration or image here */}
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl p-8 shadow-lg">
              <div className="h-64 flex items-center justify-center">
                <svg className="w-32 h-32 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;