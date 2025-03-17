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
