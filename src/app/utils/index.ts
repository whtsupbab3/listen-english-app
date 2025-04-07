import { SubtitleItem } from "@/types";

export function parseSrtTimestamp(timestamp: string): number {
  const [hours, minutes, seconds] = timestamp.split(":");
  const [secs, ms] = seconds.split(",");
  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseInt(secs) * 1000 +
    parseInt(ms)
  );
}

export function parseSrt(srtContent: string): SubtitleItem[] {
  const blocks = srtContent.trim().split("\n\n");
  return blocks.map((block) => {
    const lines = block.split("\n");
    const id = parseInt(lines[0]);
    const [startTime, endTime] = lines[1].split(" --> ").map(parseSrtTimestamp);
    const text = lines
      .slice(2)
      .join(" ")
      .replace(/"/g, "")
      .replace(/\s+/g, " ")
      .replace(/—/g, "-")
      .trim();
    return { id, startTime, endTime, text };
  });
}

export function splitIntoSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/);
}

export function normalizeText(text: string): string {
  return text
    .replace(/[.,!?'"]/g, "")
    .replace(/—/g, "-")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}
