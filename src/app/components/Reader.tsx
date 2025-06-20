"use client";
import { useState, useRef, useEffect } from "react";
import { Audiobook } from "@/types";
import { SubtitleItem } from "@/types";
import { parseSrt, splitIntoSentences, normalizeText } from "../utils";
import { TranslatorIcon } from "./Icons";
import { useUser } from "../contexts/UserContext";
import { TranslationPopup, PopupPosition } from "./TranslationPopup";

interface ReaderProps {
  book: Audiobook;
}

interface PageContent {
  title?: string;
  subtitle?: string;
  paragraphs: string[];
}

const LINES_PER_PAGE = 30;

export default function Reader({ book }: ReaderProps) {
  const { user } = useUser();
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [text, setText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [autoFlip, setAutoFlip] = useState(true);
  const [selectedText, setSelectedText] = useState("");
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);
  const [lastProgress, setLastProgress] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pageTextCache = useRef<Map<number, string[]>>(new Map());
  const lastProgressSentRef = useRef<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (!book.srtFileUrl) {
      setError("SRT file URL is missing");
      setIsLoading(false);
      return;
    }

    if (!book.bookUrl) {
      setError("Book text file URL is missing");
      setIsLoading(false);
      return;
    }

    if (!book.audioUrl) {
      setError("Audio file URL is missing");
      setIsLoading(false);
      return;
    }

    fetch(book.srtFileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error loading SRT file: ${response.status}`);
        }
        return response.text();
      })
      .then((content) => {
        setSubtitles(parseSrt(content));
      })
      .catch((error) => {
        console.error("SRT error:", error);
        setError(error.message);
      });

    fetch(book.bookUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error loading text file: ${response.status}`);
        }
        return response.text();
      })
      .then((content) => {
        setText(content);
      })
      .catch((error) => {
        console.error("Text error:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [book]);

  useEffect(() => {
    if (pages.length > 0) {
      pages.forEach((page, index) => {
        const normalizedParagraphs = page.paragraphs.map((p) =>
          normalizeText(p)
        );
        pageTextCache.current.set(index, normalizedParagraphs);
      });
    }
  }, [pages]);

  useEffect(() => {
    if (!autoFlip || !isPlaying || !currentTime) return;

    const currentSubtitle = getCurrentSubtitle();
    if (currentSubtitle) {
      const normalizedSubtitle = normalizeText(currentSubtitle.text);

      let foundPage = -1;
      for (let i = 0; i < pages.length; i++) {
        const pageParagraphs = pageTextCache.current.get(i) || [];
        const foundInParagraph = pageParagraphs.some((paragraph) => {
          return (
            paragraph.includes(normalizedSubtitle) ||
            normalizedSubtitle.includes(paragraph)
          );
        });

        if (foundInParagraph) {
          foundPage = i;
          break;
        }
      }

      if (foundPage !== -1 && foundPage !== currentPage) {
        setCurrentPage(foundPage);
      }
    }
  }, [currentTime, isPlaying, autoFlip, pages.length, currentPage]);

  useEffect(() => {
    if (text) {
      const paragraphs = text.split("\n").filter((p) => p.trim());
      const pages: PageContent[] = [];
      let currentPageParagraphs: string[] = [];
      let currentPageLines = 0;

      paragraphs.forEach((paragraph, index) => {
        const lines = Math.ceil(paragraph.length / 80);

        if (currentPageLines + lines > LINES_PER_PAGE) {
          pages.push({
            paragraphs: [...currentPageParagraphs],
          });
          currentPageParagraphs = [paragraph];
          currentPageLines = lines;
        } else {
          currentPageParagraphs.push(paragraph);
          currentPageLines += lines;
        }

        if (
          index === paragraphs.length - 1 &&
          currentPageParagraphs.length > 0
        ) {
          pages.push({
            paragraphs: [...currentPageParagraphs],
          });
        }
      });

      setPages(pages);
    }
  }, [text]);

  useEffect(() => {
    if (!user || !book?.id) return;
    fetch("/api/userbooks/interact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        audiobookId: book.id,
      }),
    });
  }, [user, book?.id]);

  useEffect(() => {
    if (!user || !book?.id || !isPlaying) return;
    const progressInSeconds = Math.floor(currentTime / 1000);
    console.log(
      "[UserBook Sync] Interval fired. isPlaying:",
      isPlaying,
      "currentTime:",
      currentTime,
      "progressInSeconds:",
      progressInSeconds
    );
    if (progressInSeconds !== lastProgressSentRef.current) {
      lastProgressSentRef.current = progressInSeconds;
      fetch("/api/userbooks/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          audiobookId: book.id,
          progressInSeconds,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          console.log("[UserBook Sync] Updated progress:", data);
        })
        .catch((err) => {
          console.error("[UserBook Sync] Error updating progress:", err);
        });
    }
  }, [isPlaying, currentTime]);

  useEffect(() => {
    if (!user || !book?.id) return;
    fetch(`/api/userbooks/interact?userId=${user.id}&audiobookId=${book.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.progressInSeconds === 'number') {
          setLastProgress(data.progressInSeconds);
        } else {
          setLastProgress(0);
        }
        setProgressLoaded(true);
      })
      .catch(() => {
        setLastProgress(0);
        setProgressLoaded(true);
      });
  }, [user, book?.id]);

  useEffect(() => {
    if (!progressLoaded || !audioRef.current) return;
    audioRef.current.currentTime = lastProgress;
  }, [progressLoaded, lastProgress]);

  const handleTextSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      setSelectedText("");
      setPopupPosition(null);
      return;
    }

    const text = selection.toString().trim();
    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (text !== selectedText) {
        setSelectedText(text);
        setPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime * 1000;
      const diff = Math.abs(newTime - currentTime);
      if (diff >= 5000) {
        setCurrentTime(newTime);
        setIsPlaying(!audioRef.current.paused);
      }
    }
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      (subtitle) =>
        currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );
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
      norm1.substring(0, Math.min(20, norm1.length)) ===
        norm2.substring(0, Math.min(20, norm2.length)) ||
      norm1.substring(Math.max(0, norm1.length - 20)) ===
        norm2.substring(Math.max(0, norm2.length - 20))
    );
  };

  const renderParagraph = (paragraph: string, isDialogue: boolean) => {
    const sentences = splitIntoSentences(paragraph);
    const currentSubtitle = getCurrentSubtitle();

    return sentences.map((sentence: string, idx: number) => {
      const isHighlighted =
        currentSubtitle && isTextMatching(sentence, currentSubtitle.text);

      return (
        <span key={idx} className={isHighlighted ? "highlighted" : ""}>
          {sentence}{" "}
        </span>
      );
    });
  };

  const renderPage = () => {
    if (!pages.length) return null;

    const page = pages[currentPage];

    return page.paragraphs.map((paragraph, index) => {
      const isDialogue = paragraph.includes('"');

      return (
        <p
          key={index}
          className={`text-segment ${isDialogue ? "dialogue" : ""} mb-4`}
        >
          {renderParagraph(paragraph, isDialogue)}
        </p>
      );
    });
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#000]">
      <div className="container mx-auto px-4 py-10 max-w-4xl bg-[#2f2e2e] min-h-screen flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#fea900] mb-2">
            {book.title}
          </h1>
          <p className="text-[#dfdfdf] text-lg">{book.author}</p>
        </div>
        <div className="audio-container w-full mb-4 flex justify-center">
          <audio
            ref={audioRef}
            src={book.audioUrl || undefined}
            onTimeUpdate={handleTimeUpdate}
            onEnded={async () => {
              setIsPlaying(false);
              if (user && book?.id) {
                try {
                  await fetch("/api/userbooks/interact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: user.id,
                      audiobookId: book.id,
                      finished: true,
                    }),
                  });
                } catch (err) {
                  console.error("Failed to mark book as finished", err);
                }
              }
            }}
            controls
            controlsList="nodownload"
            className="w-full max-w-2xl accent-yellow-400"
          />
        </div>
        <div className="controls mb-8 flex justify-center items-center gap-4">
          <label className="flex items-center gap-2 text-[#dfdfdf]">
            <input
              type="checkbox"
              checked={autoFlip}
              onChange={(e) => setAutoFlip(e.target.checked)}
              className="form-checkbox h-4 w-4 text-[#fea900] rounded border-gray-300 focus:ring-[#fea900]"
            />
            Автоматичне гортання сторінок
          </label>
        </div>
        <div
          className="text-container prose prose-invert mx-auto flex-grow"
          onMouseUp={handleTextSelection}
        >
          {renderPage()}
          {popupPosition && selectedText && (
            <TranslationPopup text={selectedText} position={popupPosition} />
          )}
        </div>
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-[#fea900] text-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Попередня сторінка
          </button>
          <span className="text-[#dfdfdf]">
            Сторінка {currentPage + 1} з {pages.length}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            className="px-4 py-2 bg-[#fea900] text-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Наступна сторінка
          </button>
        </div>
      </div>
    </div>
  );
}
