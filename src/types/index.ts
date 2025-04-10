export interface Audiobook {
  id: number;
  title: string;
  author: string;
  coverUrl: string | null;
  audioUrl: string | null;
  bookUrl: string;
  srtFileUrl: string | null;
}

export interface SubtitleItem {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export type S3Folder = 'audios' | 'books' | 'covers' | 'srt-files';