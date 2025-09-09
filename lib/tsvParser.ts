import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

export async function* parseTSV<T = Record<string, string>>(path: string) {
  const parser = createReadStream(path).pipe(
    parse({
      delimiter: "\t",
      columns: true,
      skip_empty_lines: true,
    })
  );

  for await (const record of parser) {
    yield record as T;
  }
}
