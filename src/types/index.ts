export interface SubtitleItem {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface Audiobook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  srtFileUrl?: string;
  audioUrl?: string;
  bookUrl: string;
  isPublic: boolean;
  uploaderId: string;
}

export type S3Folder = 'audios' | 'books' | 'covers' | 'srt-files';