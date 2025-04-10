import { text, pgTable, integer, boolean } from "drizzle-orm/pg-core";

export const Audiobook = pgTable("audiobooks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  coverUrl: text("coverUrl"),
  srtFileUrl: text("srtFileUrl"),
  audioUrl: text("audioUrl"),
  bookUrl: text("bookUrl").notNull(),
  isPublic: boolean("isPublic").default(false).notNull(),
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
});
