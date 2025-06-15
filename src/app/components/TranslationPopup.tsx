"use client";
import { useState, useEffect } from "react";
import { TranslatorIcon } from "./Icons";

interface PopupPosition {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  position: PopupPosition;
}

export function TranslationPopup({
  text,
  position,
}: TranslationPopupProps) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTranslation(null);
    setError(null);
    setIsLoading(false);
  }, [text]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLang: "UK", // Ukrainian
          sourceLang: "EN", // English
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslation(data.translations[0].text);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed z-50 bg-white shadow-lg rounded-lg p-2 border border-gray-200 min-w-[200px]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
        marginTop: "-10px",
      }}
    >
      {!translation && !isLoading && (
        <button
          onClick={handleTranslate}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer w-full"
          disabled={isLoading}
        >
          <TranslatorIcon size={16} />
          <span>Translate</span>
        </button>
      )}

      {isLoading && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
          <span>Translating...</span>
        </div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {translation && !isLoading && (
        <div className="text-sm text-gray-900 p-1">
          <div className="font-medium mb-1 text-gray-500">{text}</div>
          <div>{translation}</div>
        </div>
      )}
    </div>
  );
}

export type { PopupPosition };
