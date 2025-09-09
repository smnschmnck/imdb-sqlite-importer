import type { EpisodeDataset, RatingDataset } from "../types/types";
import { parseTSV } from "./tsvParser";

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

export const importEpisodes = async ({ path }: EpisodeDataset) => {
  console.log("👀 Parsing and importing episodes to SQLite DB");
  for await (const row of parseTSV<EpisodeRow>(path)) {
  }
};

export const importRatings = async ({ path }: RatingDataset) => {
  console.log("👀 Parsing and importing ratings to SQLite DB");
  for await (const row of parseTSV<RatingRow>(path)) {
  }
};
