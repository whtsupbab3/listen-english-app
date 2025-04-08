import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const Audiobook = pgTable("audiobooks", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("coverUrl"),
  srtFileUrl: text("srtFileUrl"),
  audioUrl: text("audioUrl"),
  bookUrl: text("bookUrl").notNull(),
});

export const User = pgTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
});

export const UserBook = pgTable("user_books", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  audiobookId: integer("audiobook_id").notNull(),
  progressInSeconds: integer("progress_in_seconds").default(0).notNull(),
});
