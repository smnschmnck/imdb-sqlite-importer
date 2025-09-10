import { parseTSV } from "./tsvParser"; // your parser
import type { EpisodeDataset, RatingDataset } from "../types/types";
import { db } from "../db/drizzle";
import { episodes, ratings } from "../db/schema";

type EpisodeRow = {
  tconst: string;
  parentTconst: string;
  seasonNumber: string; // TSV = strings, we convert below
  episodeNumber: string;
};

type RatingRow = {
  tconst: string;
  averageRating: string;
  numVotes: string;
};

// Helper: IMDb TSVs use "\N" = NULL
function cleanNumber(val: string): number | null {
  return val === "\\N" ? null : Number(val);
}

async function insertEpisodes(rows: EpisodeRow[]) {
  await db.transaction(async (tx) => {
    for (const r of rows) {
      await tx.insert(episodes).values({
        tconst: r.tconst,
        parentTconst: r.parentTconst,
        seasonNumber: cleanNumber(r.seasonNumber),
        episodeNumber: cleanNumber(r.episodeNumber),
      });
    }
  });
}

export const importEpisodes = async ({ path }: EpisodeDataset) => {
  console.log("👀 Parsing and importing episodes to SQLite DB");

  let batch: EpisodeRow[] = [];
  const BATCH_SIZE = 50_000;
  let count = 0;

  for await (const row of parseTSV<EpisodeRow>(path)) {
    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      await insertEpisodes(batch);
      count += batch.length;
      console.log(`📦 Inserted episodes rows: ${count}`);
      batch = [];
    }
  }

  // Insert any remaining
  if (batch.length > 0) {
    await insertEpisodes(batch);
    count += batch.length;
  }

  console.log(`✅ Done! Imported ${count} episodes rows`);
};

async function insertRatings(rows: RatingRow[]) {
  await db.transaction(async (tx) => {
    for (const r of rows) {
      await tx.insert(ratings).values({
        tconst: r.tconst,
        averageRating: Number(r.averageRating),
        numVotes: Number(r.numVotes),
      });
    }
  });
}

// Ratings Import
export const importRatings = async ({ path }: RatingDataset) => {
  console.log("👀 Parsing and importing ratings to SQLite DB");

  let batch: RatingRow[] = [];
  const BATCH_SIZE = 50_000;
  let count = 0;

  for await (const row of parseTSV<RatingRow>(path)) {
    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      await insertRatings(batch);
      count += batch.length;
      console.log(`📦 Inserted ratings rows: ${count}`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertRatings(batch);
    count += batch.length;
  }

  console.log(`✅ Done! Imported ${count} ratings rows`);
};
