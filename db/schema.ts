import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const shows = sqliteTable("shows", {
  id: text(),
});
