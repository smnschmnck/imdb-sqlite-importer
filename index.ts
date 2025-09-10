import { downloadDatasets } from "./lib/download";
import { importEpisodes, importRatings } from "./lib/importer";
import { unzipGzip } from "./lib/unzip";
import type { DatasetInfo, DatasetName } from "./types/types";

const getTsVs = async (datasets: DatasetName[]) => {
  const files = await downloadDatasets(datasets);
  const unzippedFiles = (await Promise.all(
    files.map((f) => unzipGzip(f))
  )) as DatasetInfo[];

  const episodesPath = unzippedFiles.find((f) => f.dataset === "title.episode");
  const ratingsPath = unzippedFiles.find((f) => f.dataset === "title.ratings");

  if (!episodesPath) {
    throw new Error("❌ Failed to get episodes");
  }
  if (!ratingsPath) {
    throw new Error("❌ Failed to get ratings");
  }

  return { episodesPath, ratingsPath };
};

const main = async () => {
  const { episodesPath, ratingsPath } = await getTsVs([
    "title.episode",
    "title.ratings",
  ]);

  await importEpisodes(episodesPath);
  await importRatings(ratingsPath);

  console.log("All done 🎉 Your DB is ready 🎬");
};

main();
