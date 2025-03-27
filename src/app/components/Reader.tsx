'use client'
import { useState, useRef, useEffect } from 'react'

interface SubtitleItem {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

function parseSrtTimestamp(timestamp: string): number {
  const [hours, minutes, seconds] = timestamp.split(':');
  const [secs, ms] = seconds.split(',');
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(secs) * 1000 +
    parseInt(ms)
  );
}

function parseSrt(srtContent: string): SubtitleItem[] {
  const blocks = srtContent.trim().split('\n\n');
  return blocks.map(block => {
    const lines = block.split('\n');
    const id = parseInt(lines[0]);
    const [startTime, endTime] = lines[1].split(' --> ').map(parseSrtTimestamp);
    const text = lines.slice(2).join(' ')
      .replace(/"/g, '') 
      .replace(/\s+/g, ' ') 
      .replace(/—/g, '-') 
      .trim();
    return { id, startTime, endTime, text };
  });
}

function normalizeText(text: string): string {
  return text
    .replace(/[.,!?'"]/g, '') 
    .replace(/—/g, '-') 
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/);
}

export default function Reader() {
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [text, setText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch('https://listen-english-s3.s3.us-east-2.amazonaws.com/srt-files/FiveOnATreasureIsland1-3.srt')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Помилка завантаження SRT файлу: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        setSubtitles(parseSrt(content));
      })
      .catch(error => {
        console.error('SRT error:', error);
        setError(error.message);
      });

    // Load text file for display
    fetch('https://listen-english-s3.s3.us-east-2.amazonaws.com/books/FiveOnATreasureIsland1-3.txt')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Помилка завантаження текстового файлу: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        setText(content);
      })
      .catch(error => {
        console.error('Text error:', error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#fea900]">Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime * 1000);
    }
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      subtitle =>
        currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const isTextMatching = (text1: string, text2: string): boolean => {
    const norm1 = normalizeText(text1);
    const norm2 = normalizeText(text2);
    
    if (norm1.length < 10 || norm2.length < 10) {
      return norm1 === norm2;
    }
    
    return (
      norm1.includes(norm2) ||
      norm2.includes(norm1) ||
      norm1.substring(0, Math.min(20, norm1.length)) === norm2.substring(0, Math.min(20, norm2.length)) ||
      norm1.substring(Math.max(0, norm1.length - 20)) === norm2.substring(Math.max(0, norm2.length - 20))
    );
  };

  const renderParagraph = (paragraph: string, isDialogue: boolean) => {
    const sentences = splitIntoSentences(paragraph);
    const currentSubtitle = getCurrentSubtitle();

    return sentences.map((sentence, idx) => {
      const isHighlighted = currentSubtitle && isTextMatching(sentence, currentSubtitle.text);
      
      return (
        <span key={idx} className={isHighlighted ? 'highlighted' : ''}>
          {sentence}{' '}
        </span>
      );
    });
  };

  const renderText = () => {
    if (!text) return null;

    const paragraphs = text.split('\n').filter(p => p.trim());

    return paragraphs.map((paragraph, index) => {
      if (index === 0) {
        return (
          <h1 key={index} className="chapter-title">
            {paragraph}
          </h1>
        );
      }
      if (index === 1) {
        return (
          <h2 key={index} className="chapter-subtitle">
            {paragraph}
          </h2>
        );
      }

      const isDialogue = paragraph.includes('"');
      
      return (
        <p
          key={index}
          className={`text-segment ${isDialogue ? 'dialogue' : ''}`}
        >
          {renderParagraph(paragraph, isDialogue)}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#000]">
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-[#2f2e2e]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#fea900] mb-2">Five on a Treasure Island</h1>
          <p className="text-[#dfdfdf] text-lg">Enid Blyton</p>
        </div>
        <div className="audio-container w-full mb-8 flex justify-center">
          <audio
            ref={audioRef}
            src="https://listen-english-s3.s3.us-east-2.amazonaws.com/audios/FiveOnATreasureIsland.mp3"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            controls
            className="w-full max-w-2xl"
          />
        </div>
        <div className="text-container prose prose-invert mx-auto">
          {renderText()}
        </div>
      </div>
    </div>
  );
}
