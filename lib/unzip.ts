import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { DatasetInfo } from "../types/types";

export async function unzipGzip({ dataset, path: inputPath }: DatasetInfo) {
  const inputFile = Bun.file(inputPath);
  const compressed = await inputFile.arrayBuffer();

  // Bun.gunzip takes ArrayBuffer or Uint8Array
  const decompressed = Bun.gunzipSync(new Uint8Array(compressed));

  const finalOutputPath = inputPath.replace(/\.gz$/, "");
  await mkdir(dirname(finalOutputPath), { recursive: true });
  await Bun.write(finalOutputPath, decompressed);

  console.log(`✅ Unzipped ${inputPath} → ${finalOutputPath}`);

  return { dataset, path: finalOutputPath };
}
