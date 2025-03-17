CREATE TABLE "audiobooks" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"coverUrl" text,
	"srtFileUrl" text,
	"audioUrl" text,
	"bookUrl" text NOT NULL
);
