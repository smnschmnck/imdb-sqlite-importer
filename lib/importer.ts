import { parseTSV } from "./tsvParser";
import type { EpisodeDataset, RatingDataset } from "../types/types";
import { db } from "../db/drizzle";
import { episodes, ratings } from "../db/schema";

type EpisodeRow = {
  tconst: string;
  parentTconst: string;
  seasonNumber: string;
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
  await db.insert(episodes).values(
    rows.map((r) => ({
      tconst: r.tconst,
      parentTconst: r.parentTconst,
      seasonNumber: cleanNumber(r.seasonNumber),
      episodeNumber: cleanNumber(r.episodeNumber),
    }))
  );
}

export const importEpisodes = async ({ path }: EpisodeDataset) => {
  console.log(
    "👀 Parsing and importing episodes to SQLite DB (this will take a while)"
  );

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

  if (batch.length > 0) {
    await insertEpisodes(batch);
    count += batch.length;
  }

  console.log(`✅ Done! Imported ${count.toLocaleString()} episode rows`);
};

async function insertRatings(rows: RatingRow[]) {
  await db.insert(ratings).values(
    rows.map((r) => ({
      tconst: r.tconst,
      averageRating: Number(r.averageRating),
      numVotes: Number(r.numVotes),
    }))
  );
}

export const importRatings = async ({ path }: RatingDataset) => {
  console.log(
    "👀 Parsing and importing ratings to SQLite DB (this will take a while)"
  );

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

  console.log(`✅ Done! Imported ${count.toLocaleString()} rating rows`);
};
