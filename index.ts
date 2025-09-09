import { downloadDatasets } from "./lib/download";
import { unzipGzip } from "./lib/unzip";

const main = async () => {
  const files = await downloadDatasets();
  const unzippedFiles = await Promise.all(files.map((f) => unzipGzip(f)));
};

main();
