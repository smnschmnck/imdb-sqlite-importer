import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import cliProgress from "cli-progress";
import type { DatasetInfo, DatasetName } from "../types/types";

const datasetBaseUrl = "https://datasets.imdbws.com";
const outputBasePath = "./.data";

const multiBar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: "{name} |{bar}| {percentage}% | {value}/{total} MB",
  },
  cliProgress.Presets.shades_classic
);

const downloadDataset = async ({
  dataset,
}: {
  dataset: DatasetInfo["dataset"];
}) => {
  console.log(`⬇️ Starting file download for ${dataset}`);
  const url = `${datasetBaseUrl}/${dataset}.tsv.gz`;
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to download (${url}): ${response.status} ${response.statusText}`
    );
  }

  const outputPath = `${outputBasePath}/${dataset}.tsv.gz`;
  await mkdir(dirname(outputPath), { recursive: true });

  const file = Bun.file(outputPath);
  const writer = file.writer();

  const contentLength = Number(response.headers.get("content-length")) || 0;
  const totalMB = Math.ceil(contentLength / (1024 * 1024));

  const bar = multiBar.create(totalMB, 0, { name: dataset });

  let received = 0;

  for await (const chunk of response.body as AsyncIterable<Uint8Array>) {
    received += chunk.length;
    writer.write(chunk);
    if (contentLength > 0) {
      const doneMB = Math.floor(received / (1024 * 1024));
      bar.update(doneMB);
    }
  }

  await writer.end();
  bar.update(totalMB);
  bar.stop();

  return { dataset, path: outputPath } as DatasetInfo;
};

export const downloadDatasets = async (datasets: DatasetName[]) => {
  const results = await Promise.all(
    datasets.map(async (d) => await downloadDataset({ dataset: d }))
  );

  multiBar.stop();

  return results;
};
