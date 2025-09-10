import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// --- title.ratings.tsv.gz ---
// tconst (string), averageRating (float), numVotes (int)
export const ratings = sqliteTable("ratings", {
  tconst: text("tconst").primaryKey(),
  averageRating: real("average_rating").notNull(),
  numVotes: integer("num_votes").notNull(),
});

// --- title.episode.tsv.gz ---
// tconst (episode), parentTconst (show/series), seasonNumber, episodeNumber
export const episodes = sqliteTable("episodes", {
  tconst: text("tconst").primaryKey(),
  parentTconst: text("parent_tconst").notNull(),
  seasonNumber: integer("season_number"),
  episodeNumber: integer("episode_number"),
});
