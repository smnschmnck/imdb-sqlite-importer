import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const datasetBaseUrl = "https://datasets.imdbws.com";
const outputBasePath = "./.data";

const downloadDataset = async ({ dataset }: { dataset: string }) => {
  console.log(`⬇️ Starting file download for ${dataset}`);

  const url = `${datasetBaseUrl}/${dataset}`;
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to download (${url}): ${response.status} ${response.statusText}`
    );
  }

  const outputPath = `${outputBasePath}/${dataset}`;

  // ✅ Ensure parent folder exists
  await mkdir(dirname(outputPath), { recursive: true });

  const file = Bun.file(outputPath);
  const writer = file.writer();

  const contentLength = Number(response.headers.get("content-length")) || 0;

  let received = 0;
  let lastLogged = 0;

  console.log("💾 Saving file...");

  for await (const chunk of response.body as AsyncIterable<Uint8Array>) {
    received += chunk.length;
    writer.write(chunk);

    if (contentLength > 0) {
      const progress = Math.floor((received / contentLength) * 100);
      if (progress >= lastLogged + 5) {
        console.log(`📦 Download progress: ${progress}%`);
        lastLogged = progress;
      }
    } else {
      if (received - lastLogged > 10 * 1024 * 1024) {
        console.log(
          `📦 Downloaded ${(received / (1024 * 1024)).toFixed(1)} MB...`
        );
        lastLogged = received;
      }
    }
  }

  await writer.end();
  console.log(`✅ File downloaded to ${outputPath}`);
};

export const downloadDatasets = async () => {
  await downloadDataset({ dataset: "title.episode.tsv.gz" });
  await downloadDataset({ dataset: "title.ratings.tsv.gz" });
};
