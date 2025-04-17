import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

let db: DB | null = null;

export function getDb(): DB {
  if (!db) {
    const path =
      new URL("../data/prod-database.sqlite", import.meta.url).pathname;
    db = new DB(path);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
