import { text, pgTable, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const Audiobook = pgTable("audiobooks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("cover_url"),
  srtFileUrl: text("srt_file_url"),
  audioUrl: text("audio_url"),
  bookUrl: text("book_url").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  uploaderId: text("uploader_id").references(() => User.id),
});

export const User = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
});

export const UserBook = pgTable("user_books", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => User.id),
  audiobookId: text("audiobook_id").notNull().references(() => Audiobook.id),
  progressInSeconds: integer("progress_in_seconds").default(0).notNull(),
  lastViewed: timestamp("last_viewed").notNull(),
});
